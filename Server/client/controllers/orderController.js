export const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { deliveryAddress, deliveryDate } = req.body;

  try {
    const db = req.supabase;

    if (!db) {
      return res.status(500).json({ error: "Supabase client not initialized in middleware" });
    }

    // 1. GET THE CART ITEMS
    const { data: cartItems, error: cartError } = await db
      .from('cart_items')
      .select(`
        cart_id,
        quantity,
        carts!inner(user_id),
        products (id, name, price, unit)
      `)
      .eq('carts.user_id', userId);

    if (cartError || !cartItems.length) {
      return res.status(400).json({ error: "Votre panier est vide." });
    }

    // 2. CALCULATE TOTAL (Server-side for security)
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.products.price * item.quantity);
    }, 0);

    // 3. CREATE THE ORDER HEADER
    const { data: order, error: orderError } = await db
      .from('orders')
      .insert([{ 
        user_id: userId, 
        total_amount: totalAmount, 
        delivery_address: deliveryAddress,
        delivery_date: deliveryDate,
        status: 'pending' 
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // 4. CREATE ORDER ITEMS (Snapshotted prices)
    const orderItemsData = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.products.id,
      quantity: item.quantity,
      price_at_purchase: item.products.price,
      unit_bought: item.products.unit
    }));

    const { error: itemsError } = await db
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) throw itemsError;

    // 5. CLEAR THE CART (Using the ID we already fetched)
    const cartId = cartItems[0].cart_id;
    await db
      .from('cart_items')
      .delete()
      .eq('cart_id', cartId);

    res.status(201).json({ message: 'Commande réussie !', orderId: order.id });

  } catch (err) {
    console.error("Order Creation Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET ORDER HISTORY (For the Client)
export const getMyOrders = async (req, res) => {
  const db = req.supabase;

  if (!db) {
    return res.status(500).json({ error: "Supabase client not initialized in middleware" });
  }

  const { data, error } = await db
    .from('orders')
    .select('*, order_items(*, products(name))')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
};