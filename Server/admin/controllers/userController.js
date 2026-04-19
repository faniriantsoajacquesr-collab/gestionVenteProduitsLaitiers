import { supabase } from '../../config/supabase.js';

// 1. LISTER TOUS LES CLIENTS
export const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, phone_number, role, updated_at')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. OBTENIR UN UTILISATEUR PAR ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. CRÉER UN UTILISATEUR
export const createUser = async (req, res) => {
  const { email, password, firstName, lastName, phone, role } = req.body;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ 
        first_name: firstName,
        last_name: lastName,
        phone_number: phone, 
        role: role || 'client' 
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 4. METTRE À JOUR UN UTILISATEUR
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 5. SUPPRIMER UN UTILISATEUR
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
