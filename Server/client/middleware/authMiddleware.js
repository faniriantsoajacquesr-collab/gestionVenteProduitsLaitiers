import { createClient } from '@supabase/supabase-js';

export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }

  try {
    // 1. Initialiser un client Supabase SPÉCIFIQUE à cette requête avec le JWT
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment variables are missing. Check your .env file and path.');
    }

    // C'est ce qui permet à PostgreSQL de savoir qui est auth.uid()
    const userSupabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: { headers: { Authorization: `Bearer ${token}` } }
      }
    );

    // 2. Vérifier le token
    const { data: { user }, error } = await userSupabase.auth.getUser();

    if (error || !user) throw new Error('Invalid token');

    // 3. Attacher l'utilisateur ET le client authentifié à la requête
    req.user = user;
    req.supabase = userSupabase; // <-- Très important pour le contrôleur

    // 4. Récupérer le profil complet (incluant le rôle, l'adresse, etc.)
    const { data: profile, error: profileError } = await userSupabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile) {
      req.user = { ...user, ...profile };
    } else {
      req.user.role = 'client';
    }

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Accès refusé. Réservé aux administrateurs.' });
  }
};