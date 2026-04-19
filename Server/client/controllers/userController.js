import { supabase, adminSupabase } from '../../config/supabase.js';

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

// 3. UPSERT USER PROFILE (Create or Update Name, Phone, Address, or Role)
export const upsertUserProfile = async (req, res) => {
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

    // Ensure the ID from the URL matches the authenticated user's ID for the upsert payload
    const payload = {
      id: req.user.id, // Use req.user.id to ensure consistency and prevent malicious updates
      ...updates
    };

    const { data, error } = await req.supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'id' }) // Upsert based on the 'id' column
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

// 5. UPLOAD USER AVATAR
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier fourni' });
    }

    const userId = req.user.id;
    const fileExt = req.file.originalname.split('.').pop();
    const filePath = `avatars/${userId}/avatar.${fileExt}`;

    // Upload using adminSupabase to Products_Gallery bucket (bypasses RLS)
    const { error: uploadError } = await adminSupabase.storage
      .from('Products_Gallery')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (uploadError) {
      throw new Error(`Erreur d'upload: ${uploadError.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = adminSupabase.storage
      .from('Products_Gallery')
      .getPublicUrl(filePath);

    // Update the profile with avatar_url using adminSupabase (service role)
    const { error: updateError } = await adminSupabase
      .from('profiles')
      .update({ avatar_url: publicUrlData.publicUrl })
      .eq('id', userId);

    if (updateError) {
      throw new Error(`Erreur mise à jour profil: ${updateError.message}`);
    }

    res.status(200).json({
      success: true,
      avatar_url: publicUrlData.publicUrl,
      message: 'Avatar téléchargé avec succès'
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: error.message || 'Erreur lors du téléchargement de l\'avatar' });
  }
};