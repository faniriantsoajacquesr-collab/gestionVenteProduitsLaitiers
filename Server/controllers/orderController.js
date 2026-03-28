import { supabase } from '../config/supabase.js';

export const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { deliveryAddress, deliveryDate } = req.body;

  try {
    // 1. GET THE CART ITEMS
    const { data: cartItems, error: cartError } = await supabase
      .from('cart_items')
      .select(`
        quantity,
        products (id, name, price, unit)
      `)
      .innerJoin('carts', 'cart_items.cart_id', 'carts.id')
      .eq('carts.user_id', userId);

    if (cartError || !cartItems.length) {
      return res.status(400).json({ error: "Votre panier est vide." });
    }

    // 2. CALCULATE TOTAL (Server-side for security)
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + (item.products.price * item.quantity);
    }, 0);

    // 3. CREATE THE ORDER HEADER
    const { data: order, error: orderError } = await supabase
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

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsData);

    if (itemsError) throw itemsError;

    // 5. CLEAR THE CART
    await supabase
      .from('cart_items')
      .delete()
      .eq('cart_id', (await supabase.from('carts').select('id').eq('user_id', userId).single()).data.id);

    res.status(201).json({ message: 'Commande réussie !', orderId: order.id });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ORDER HISTORY (For the Client)
export const getMyOrders = async (req, res) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*, products(name))')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.status(200).json(data);
};