import { supabase } from '../config/supabase.js';

// 1. Check if the user is authenticated
export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract 'Bearer TOKEN'

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }

  try {
    // Ask Supabase to verify this token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) throw new Error('Invalid token');

    // Attach the user to the request object so the Controller can use it
    req.user = user;
    
    // Fetch the role from our public.profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    req.user.role = profile?.role || 'client';

    next(); // Move to the next function (The Controller)
  } catch (err) {
    res.status(401).json({ error: 'Not authorized, token failed' });
  }
};

// 2. Check if the user is an Admin
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Admins only.' });
  }
};