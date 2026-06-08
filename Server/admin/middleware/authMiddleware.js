import { createClient } from '@supabase/supabase-js';

// 1. Vérifier si l'utilisateur est authentifié
export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  console.log('[Admin Auth Middleware]', {
    hasAuthHeader: !!authHeader,
    tokenLength: token?.length || 0,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  if (!token) {
    console.warn('[Admin Auth] No token provided');
    return res.status(401).json({ error: 'Non autorisé, jeton manquant' });
  }

  try {
    // Create a Supabase client with the user's token in the Authorization header
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error('[Admin Auth] Missing env vars:', {
        hasUrl: !!process.env.SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_ANON_KEY
      });
      throw new Error('Supabase environment variables are missing');
    }

    const userSupabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: { headers: { Authorization: `Bearer ${token}` } }
      }
    );

    console.log('[Admin Auth] Attempting to verify token...');
    // Verify the token
    const { data: { user }, error } = await userSupabase.auth.getUser();

    if (error) {
      console.error('[Admin Auth] Token verification error:', {
        errorMessage: error.message,
        errorCode: error.code,
        errorStatus: error.status
      });
    }

    if (error || !user) {
      console.error('[Admin Auth] Token invalide or no user');
      throw new Error('Token invalide');
    }

    console.log('[Admin Auth] User verified:', {
      userId: user.id,
      email: user.email
    });
    req.user = user;
    req.supabase = userSupabase;

    // Récupérer le rôle depuis la table public.profiles
    const { data: profile, error: profileError } = await userSupabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.warn('[Admin Auth] Profile fetch error:', {
        message: profileError.message,
        code: profileError.code
      });
    }

    req.user.role = profile?.role || 'client';
    console.log('[Admin Auth] Request allowed. User role:', req.user.role);

    next();
  } catch (err) {
    console.error('[Admin Auth Middleware Error]:', {
      message: err.message,
      stack: err.stack
    });
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
