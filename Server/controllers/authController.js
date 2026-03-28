import { supabase } from '../config/supabase.js';

// 1. SIGN UP (Inscription)
export const register = async (req, res) => {
  const { email, password, fullName, phone } = req.body;

  try {
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) return res.status(400).json({ error: authError.message });

    // Create the profile in our 'profiles' table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: authData.user.id, 
          full_name: fullName, 
          phone_number: phone,
          role: 'client' // Default to client for safety
        }
      ]);

    if (profileError) throw profileError;

    res.status(201).json({ 
      message: 'Registration successful!', 
      user: authData.user 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. LOGIN (Connexion)
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return res.status(401).json({ error: 'Invalid credentials' });

    // We send back the user and the session (which contains the Access Token)
    res.status(200).json({
      message: 'Login successful',
      session: data.session,
      user: data.user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. GET CURRENT PROFILE (To show name/role in UI)
export const getMyProfile = async (req, res) => {
  try {
    // req.user is populated by your authMiddleware
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(404).json({ error: 'Profile not found' });
  }
};