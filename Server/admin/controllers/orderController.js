import { supabase } from '../../config/supabase.js';

// 1. LISTER TOUTES LES COMMANDES
export const getAllOrders = async (req, res) => {
  try {
    // A. Récupérer les commandes et leurs articles
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*, order_items (*, products (name))')
      .order('created_at', { ascending: false });

    if (ordersError) throw ordersError;

    if (!orders || orders.length === 0) {
      return res.status(200).json([]);
    }

    // B. Récupérer les profils pour tous les user_id des commandes
    const userIds = [...new Set(orders.map(o => o.user_id))];
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, phone_number')
      .in('id', userIds);

    if (profilesError) throw profilesError;

    // C. Fusionner les données manuellement
    const ordersWithProfiles = orders.map(order => ({
      ...order,
      profiles: profiles.find(p => p.id === order.user_id) || null
    }));

    res.status(200).json(ordersWithProfiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. METTRE À JOUR LE STATUT D'UNE COMMANDE
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 3. SUPPRIMER UNE COMMANDE
export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    // Supprimer d'abord les items associés
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', id);

    if (itemsError) throw itemsError;

    // Puis supprimer la commande
    const { error: orderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (orderError) throw orderError;

    res.status(200).json({ message: 'Commande supprimée avec succès' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 4. METTRE À JOUR LA DATE DE LIVRAISON
export const updateDeliveryDate = async (req, res) => {
  const { id } = req.params;
  const { delivery_date } = req.body;
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ delivery_date })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
