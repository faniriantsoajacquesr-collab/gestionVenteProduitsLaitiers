import { supabase } from '../config/supabase.js';

// 1. GET CART (Show the user their current bag)
export const getMyCart = async (req, res) => {
  try {
    // We join the cart_items with products to get Names, Prices, and Images
    const { data, error } = await supabase
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
        )
      `)
      .innerJoin('carts', 'cart_items.cart_id', 'carts.id')
      .eq('carts.user_id', req.user.id)
      .eq('products.product_gallery.is_primary', true);

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. ADD TO CART (The "Upsert" Logic)
export const addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;

  try {
    // A. Ensure the user has a Cart header first
    let { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!cart) {
      const { data: newCart } = await supabase
        .from('carts')
        .insert([{ user_id: userId }])
        .select()
        .single();
      cart = newCart;
    }

    // B. Add or Update the item (using the UNIQUE constraint we set in SQL)
    const { data, error } = await supabase
      .from('cart_items')
      .upsert(
        { cart_id: cart.id, product_id: productId, quantity }, 
        { onConflict: 'cart_id, product_id' }
      )
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. REMOVE ITEM (Delete one type of milk)
export const removeFromCart = async (req, res) => {
  const { itemId } = req.params; // The ID of the cart_item

  try {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
    res.status(200).json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};