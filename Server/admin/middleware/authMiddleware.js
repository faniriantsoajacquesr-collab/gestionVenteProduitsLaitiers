import { supabase } from '../../config/supabase.js';

// 1. Vérifier si l'utilisateur est authentifié
export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Non autorisé, jeton manquant' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) throw new Error('Jeton invalide');

    req.user = user;
    
    // Récupérer le rôle depuis la table public.profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    req.user.role = profile?.role || 'client';

    next();
  } catch (err) {
    res.status(401).json({ error: 'Non autorisé, échec du jeton' });
  }
};

// 2. Vérifier si l'utilisateur est un Admin
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Accès refusé. Administrateurs uniquement.' });
  }
};
