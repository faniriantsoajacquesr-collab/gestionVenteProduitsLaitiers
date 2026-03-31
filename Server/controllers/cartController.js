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

// 2. ADD TO CART (The "Upsert" Logic)
export const addToCart = async (req, res) => {
  const { productId, quantity: rawQuantity = 1 } = req.body;
  const userId = req.user?.id;
  const quantity = Number(rawQuantity);

  if (!userId || !productId) {
    return res.status(400).json({ error: "User ID and Product ID are required." });
  }

  try {
    const db = req.supabase;

    if (!db) {
      return res.status(500).json({ error: "Supabase client not initialized in middleware" });
    }

    // 1. Get or Create cart
    const { data: cart, error: cartError } = await db
      .from('carts')
      .upsert({ user_id: userId }, { onConflict: 'user_id' })
      .select('id')
      .single();

    if (cartError) throw cartError;

    // 2. Safety check before using cart.id
    if (!cart || !cart.id) {
      throw new Error("Could not initialize user cart.");
    }

    // 3. Check if item exists to increment quantity, or insert new
    const { data: existingItem } = await db
      .from('cart_items')
      .select('id, quantity')
      .eq('cart_id', cart.id)
      .eq('product_id', productId)
      .maybeSingle();

    if (existingItem) {
      // Logic: If called from "Add to Bag", we add. 
      // If called from "Cart Sidebar" to update, we might want to set.
      // For now, let's fix the sidebar logic by sending a delta or adjusting here.
      const { data, error } = await db
        .from('cart_items')
        .update({ quantity: req.body.setQuantity ? quantity : existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select()
        .single();
      if (error) throw error;
      return res.status(200).json(data);
    } else {
      const { data, error } = await db
        .from('cart_items')
        .insert([{ cart_id: cart.id, product_id: productId, quantity }])
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }
  } catch (err) {
    console.error("Add to Cart Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// 3. REMOVE ITEM (Delete one type of milk)
export const removeFromCart = async (req, res) => {
  const { itemId } = req.params; // The ID of the cart_item

  try {
    const db = req.supabase;

    if (!db) {
      return res.status(500).json({ error: "Supabase client not initialized in middleware" });
    }

    const { error } = await db
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};