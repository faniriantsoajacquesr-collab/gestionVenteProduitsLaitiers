import { adminSupabase } from '../../config/supabase.js';

// Upload image to storage and return public URL
export const uploadProductImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `Products_Gallery/${fileName}`;

    console.log(`[uploadProductImage] Uploading file: ${filePath}`);

    // Upload using service role (adminSupabase bypasses RLS)
    const { error: uploadError } = await adminSupabase.storage
      .from('Products_Gallery')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = adminSupabase.storage
      .from('Products_Gallery')
      .getPublicUrl(filePath);

    console.log(`[uploadProductImage] Upload successful: ${publicUrl}`);

    res.status(200).json({ 
      success: true,
      image_url: publicUrl,
      file_path: filePath
    });
  } catch (err) {
    console.error('Upload Controller Error:', err);
    res.status(500).json({ error: err.message });
  }
};
