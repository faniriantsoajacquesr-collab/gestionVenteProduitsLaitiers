import { adminSupabase as supabase } from '../../config/supabase.js';

// 1. RÉCUPÉRER TOUS LES UTILISATEURS (Auth + Profils)
export const getAllUsers = async (req, res) => {
  try {
    // Récupérer les utilisateurs de auth.users (nécessite service_role)
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    if (authError) throw authError;

    // Récupérer les profils correspondants dans la table publique
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    if (profilesError) throw profilesError;

    // Fusionner les données
    const combinedData = users.map(user => {
      const profile = profiles.find(p => p.id === user.id);
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        role: profile?.role || 'user',
        first_name: profile?.first_name || 'N/A',
        last_name: profile?.last_name || '',
        avatar_url: profile?.avatar_url,
        phone_number: profile?.phone_number,
        address: profile?.address
      };
    });

    res.status(200).json(combinedData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. SUPPRIMER UN UTILISATEUR
export const deleteUserAccount = async (req, res) => {
  const { id } = req.params;

  if (!id || id === 'null' || id === 'undefined') {
    return res.status(400).json({ error: "ID utilisateur manquant ou invalide." });
  }

  try {
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) throw error;
    res.status(200).json({ message: 'Utilisateur supprimé définitivement' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 3. CRÉER UN NOUVEL UTILISATEUR
export const createUser = async (req, res) => {
  const { email, password, role = 'client', first_name, last_name, phone_number, address } = req.body;

  try {
    // Créer l'utilisateur dans Supabase Auth
    const { data: userAuth, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Confirme l'email automatiquement pour les admins
    });

    if (authError) throw authError;

    // Créer le profil correspondant dans la table 'profiles'
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([{ id: userAuth.user.id, email, role, first_name, last_name, phone_number, address }])
      .select()
      .single();

    if (profileError) throw profileError;

    res.status(201).json({ user: userAuth.user, profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 4. RÉCUPÉRER UN UTILISATEUR PAR ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!id || id === 'null' || id === 'undefined') {
    return res.status(400).json({ error: "ID utilisateur manquant ou invalide." });
  }

  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (profileError) throw profileError;

    res.status(200).json(profile);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

// 5. METTRE À JOUR UN UTILISATEUR (profil uniquement)
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!id || id === 'null' || id === 'undefined') {
    return res.status(400).json({ error: "ID utilisateur manquant ou invalide." });
  }

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