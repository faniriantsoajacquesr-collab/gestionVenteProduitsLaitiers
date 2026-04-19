import { supabase } from '../../config/supabase.js';
import { slugify } from '../../utils/slugify.js';

// 1. GET ALL PRODUCTS (With Primary Image)
export const getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_gallery (image_url,alt_text,is_primary)
      `);

    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. GET SINGLE PRODUCT
export const getProductBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_gallery (*)')
      .eq('slug', slug)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Produit non trouvé' });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. CREATE PRODUCT (Admin Only)
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, unit, category, milk_type, dietary_tags, stock_quantity, is_featured } = req.body;
    
    // Auto-generate slug from name
    const slug = slugify(name);

    const { data, error } = await supabase
      .from('products')
      .insert([{ 
        name, slug, price, description, unit, category, milk_type, dietary_tags, stock_quantity, is_featured 
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la création : " + err.message });
  }
};

// 4. EDIT / UPDATE PRODUCT (Admin Only)
export const updateProduct = async (req, res) => {
  const { id } = req.params; // Using UUID for updates to be safe
  const updates = req.body;

  try {
    // If the name is changed, we must re-generate the slug
    if (updates.name) {
      updates.slug = slugify(updates.name);
    }

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: "Erreur lors de la mise à jour : " + err.message });
  }
};

// 5. DELETE PRODUCT (Admin Only)
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // Note: Due to ON DELETE CASCADE in your SQL, 
    // this will automatically delete related gallery images and cart items.
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression : " + err.message });
  }
};