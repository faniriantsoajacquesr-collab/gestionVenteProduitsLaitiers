import { adminSupabase } from '../../config/supabase.js';

// 1. GET CART (Show the user their current bag)
export const getMyCart = async (req, res) => {
  try {
    const db = req.supabase;

    if (!db) {
      return res.status(500).json({ error: "Supabase client not initialized in middleware" });
    }

    const { data, error } = await db
      .from('cart_items')
      .select(`
        id,
        quantity,
        products (
          id,
          name,
          price,
          unit,
          stock_quantity,
          product_gallery (image_url)
        ),
        carts!inner(user_id)
      `)
      .eq('carts.user_id', req.user.id);
    
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. ADD TO CART 
export const addToCart = async (req, res) => {
  const { productId, quantity: rawQuantity = 1, setQuantity = false } = req.body;
  const userId = req.user?.id; 
  const quantity = Number(rawQuantity);

  console.log("\n>>>>>> [DEBUG START] addToCart <<<<<<");
  console.log("1. Inputs:", { userId, productId, rawQuantity, quantity, setQuantity });
  
  if (!userId || !productId) {
    console.error("DEBUG ERR: userId ou productId manquant.");
    return res.status(400).json({ error: "ID utilisateur et ID produit sont requis." });
  }

  try {
    const db = req.supabase;

    if (!db) {
      console.error("DEBUG ERR: Supabase client non initialisé dans le middleware.");
      return res.status(500).json({ error: "Supabase client not initialized in middleware" });
    }

    // 0. VÉRIFICATION DU STOCK
    // On utilise adminSupabase pour s'assurer de lire la valeur réelle sans cache RLS
    console.log(`2. Step 0: Vérification stock pour produit ${productId}`);
    const { data: product, error: prodError } = await adminSupabase
      .from('products')
      .select('stock_quantity')
      .eq('id', productId)
      .single();
    if (prodError || !product) {
      console.error("DEBUG ERR Step 0:", prodError);
      throw new Error("Produit introuvable.");
    }
    console.log("   -> Stock en base (original):", product.stock_quantity);

    // 1. GESTION DU PANIER (Upsert 'carts')
    // On utilise adminSupabase ici aussi pour éviter que des problèmes de RLS sur 'carts' 
    // ne bloquent la suite de la fonction (et donc l'update du stock)
    console.log(`3. Step 1: Upsert du panier pour user ${userId}`);
    const { data: cart, error: cartError } = await adminSupabase
      .from('carts')
      .upsert({ user_id: userId.trim() }, { onConflict: 'user_id' })
      .select('id')
      .single();

    if (cartError) {
      console.error("DEBUG ERR Step 1 (Upsert cart):", cartError);
      if (cartError.code === '42501') {
        throw new Error('RLS violation while creating/updating cart. Ensure SUPABASE_SERVICE_ROLE_KEY is configured on the server.');
      }
      throw cartError;
    }

    if (!cart || !cart.id) {
      console.error("DEBUG ERR Step 2: Panier introuvable après upsert.");
      throw new Error("Could not initialize user cart.");
    }
    console.log("   -> Cart ID:", cart.id);

    // 3. VÉRIFICATION DE L'ITEM DÉJÀ PRÉSENT
    console.log(`4. Step 3: Recherche si l'item est déjà dans cart_items...`);
    const { data: existingItem, error: existingItemError } = await adminSupabase
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .maybeSingle();
    
    if (existingItemError) {
      console.error("DEBUG ERR Step 3 (Query item):", existingItemError);
      throw existingItemError;
    }

    const currentProductStock = Number(product.stock_quantity);
    const existingQuantity = existingItem ? Number(existingItem.quantity) : 0;

    let stockAdjustment = 0;
    if (existingItem) {
      stockAdjustment = setQuantity ? (quantity - existingQuantity) : quantity;
    } else {
      stockAdjustment = quantity;
    }
    
    console.log("   -> Data:", { currentProductStock, existingQuantity, stockAdjustment });

    if (stockAdjustment > 0 && currentProductStock < stockAdjustment) {
      console.warn(`DEBUG WARN: Stock insuffisant (${currentProductStock} < ${stockAdjustment})`);
      return res.status(400).json({ error: `Stock insuffisant. Seulement ${currentProductStock} restants.` });
    }

    // 4. MISE À JOUR DU STOCK (Produits)
    const newStock = currentProductStock - stockAdjustment;
    console.log(`5. Step 4: Update stock table (New Stock: ${newStock})`);
    const { data: updatedProduct, error: stockUpdateError } = await adminSupabase
      .from('products')
      .update({ stock_quantity: newStock })
      .eq('id', productId)
      .select('id, stock_quantity')
      .single();

    if (stockUpdateError) {
      console.error("DEBUG ERR Step 4 (Update Product):", stockUpdateError);
      throw stockUpdateError;
    }

    console.log("   -> Stock update result:", updatedProduct);

    // 5. MISE À JOUR OU INSERTION DANS LE PANIER
    if (existingItem) {
      console.log("6. Final Step: Mise à jour cart_item existant (ID:", existingItem.id, ")");
      const { data, error } = await adminSupabase
        .from('cart_items')
        .update({ quantity: setQuantity ? quantity : existingQuantity + quantity })
        .eq('id', existingItem.id)
        .select()
        .single();
      if (error) { console.error("DEBUG ERR Final Update:", error); throw error; }
      console.log(">>>>>> [DEBUG SUCCESS] <<<<<<");
      return res.status(200).json(data);
    } else {
      console.log("6. Final Step: Insertion nouvel item dans cart_items");
      const { data, error } = await adminSupabase
        .from('cart_items')
        .insert([{ cart_id: cart.id, product_id: productId, quantity }])
        .select()
        .single();
      if (error) { console.error("DEBUG ERR Final Insert:", error); throw error; }
      console.log(">>>>>> [DEBUG SUCCESS] <<<<<<");
      return res.status(201).json(data);
    }
  } catch (err) {
    console.error(">>>>>> [DEBUG FATAL ERROR] <<<<<<");
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// 3. REMOVE ITEM 
export const removeFromCart = async (req, res) => {
  const { itemId } = req.params; 

  try {
    const db = req.supabase;

    if (!db) {
      return res.status(500).json({ error: "Supabase client not initialized in middleware" });
    }

    // 1. Récupérer l'item pour connaître la quantité à rendre au stock avant suppression
    // On vérifie que l'item appartient bien à l'utilisateur via une jointure inner
    const { data: item, error: itemError } = await adminSupabase
      .from('cart_items')
      .select('quantity, product_id, carts!inner(user_id)')
      .eq('id', itemId)
      .eq('carts.user_id', req.user.id)
      .single();

    if (item && !itemError) {
        // Utiliser adminSupabase pour tout le processus de récupération de stock
        const { data: product } = await adminSupabase
            .from('products')
            .select('stock_quantity')
            .eq('id', item.product_id)
            .single();

        if (product) {
            const newStock = Number(product.stock_quantity) + Number(item.quantity);
            await adminSupabase.from('products')
                .update({ stock_quantity: newStock })
                .eq('id', item.product_id);
        }
    }

    const { error } = await adminSupabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};