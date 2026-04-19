import { adminSupabase as supabase } from '../../config/supabase.js';

// Utilité simple pour le slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// 1. LIRE TOUS LES PRODUITS
export const getProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_gallery (image_url, alt_text, is_primary)
      `);

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. LIRE UN PRODUIT PAR ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_gallery (*)')
      .eq('id', id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Produit non trouvé' });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. CRÉER UN PRODUIT
export const createProduct = async (req, res) => {
  try {
    const { 
      name, price, description, unit, category, milk_type, 
      dietary_tags, stock_quantity, is_featured, gallery 
    } = req.body;
    
    const slug = slugify(name);

    // A. Créer le produit
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([{ 
        name, slug, price, description, unit, category, milk_type, dietary_tags, stock_quantity, is_featured 
      }])
      .select()
      .single();

    if (productError) throw productError;

    // B. Ajouter la galerie si fournie
    if (gallery && Array.isArray(gallery)) {
      const galleryData = gallery.map(img => ({
        product_id: product.id,
        image_url: img.image_url,
        is_primary: img.is_primary || false,
        alt_text: name
      }));
      
      const { error: galleryError } = await supabase
        .from('product_gallery')
        .insert(galleryData);
      
      if (galleryError) {
        console.error('Gallery Update Error:', galleryError);
        console.error('Gallery Data being inserted:', galleryData);
        throw galleryError;
      }
    }

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 4. METTRE À JOUR UN PRODUIT
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { gallery, ...updates } = req.body;

  try {
    console.log(`[updateProduct] ID: ${id}, updates:`, JSON.stringify(updates));
    console.log(`[updateProduct] Gallery data:`, JSON.stringify(gallery));

    if (updates.name) {
      updates.slug = slugify(updates.name);
    }

    // A. Mettre à jour les infos de base
    const { data: product, error: productError } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (productError) throw productError;

    // B. Gérer la galerie
    if (gallery && Array.isArray(gallery)) {
      console.log(`[updateProduct] Deleting old gallery for product_id: ${id}`);
      
      // On remplace la galerie existante par la nouvelle sélection
      await supabase
        .from('product_gallery')
        .delete()
        .eq('product_id', id);

      const galleryData = gallery.map(img => ({
        product_id: id,
        image_url: img.image_url,
        is_primary: img.is_primary || false,
        alt_text: updates.name || product.name
      }));

      console.log(`[updateProduct] Inserting gallery items:`, JSON.stringify(galleryData));

      const { error: galleryError } = await supabase
        .from('product_gallery')
        .insert(galleryData);

      if (galleryError) {
        console.error('Gallery Update Error:', galleryError);
        console.error('Gallery Data being inserted:', galleryData);
        throw galleryError;
      }
    } else {
      console.log(`[updateProduct] No gallery data or invalid format:`, gallery);
    }

    res.status(200).json(product);
  } catch (err) {
    console.error(`[updateProduct] Error:`, err.message);
    res.status(400).json({ error: err.message });
  }
};

// 5. SUPPRIMER UN PRODUIT
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`[Admin Product API] Tentative de suppression en cascade pour ID: ${id}`);
    
    // A. Supprimer d'abord les images associées (pour éviter les erreurs de clé étrangère)
    await supabase
      .from('product_gallery')
      .delete()
      .eq('product_id', id);

    // B. Supprimer le produit
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    console.error('Delete Controller Error:', err);
    res.status(500).json({ error: err.message });
  }
};
