import { supabase } from '../config/supabase.js';

// 1. GET ALL USERS (Admin Only - to see the customer list)
export const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. GET USER BY ID (Admin or the User themselves)
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

// 3. UPDATE USER PROFILE (Change Name, Phone, or Role)
export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // SECURITY CHECK: 
    // Only an Admin can change a 'role'. 
    // Regular users can only update their own profile (not others).
    if (updates.role && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Vous n'avez pas le droit de changer de rôle." });
    }

    if (id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Interdit de modifier le profil d'autrui." });
    }

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

// 4. DELETE USER PROFILE (Admin Only)
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // IMPORTANT: This deletes the Profile. 
    // To delete the Auth account, you'd use supabase.auth.admin.deleteUser(id)
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Profil supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};