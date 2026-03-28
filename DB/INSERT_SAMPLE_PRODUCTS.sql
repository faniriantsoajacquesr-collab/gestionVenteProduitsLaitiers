-- Insert sample products into the products table
INSERT INTO public.products (name, slug, description, price, unit, category, milk_type, dietary_tags, stock_quantity, is_featured, is_available) VALUES
(
  'Fresh Whole Milk',
  'fresh-whole-milk',
  'Premium whole milk from grass-fed cows, rich in calcium and nutrients',
  3500,
  '1L',
  'milk',
  'cow',
  ARRAY['organic', 'fresh'],
  50,
  true,
  true
),
(
  'Artisanal Cheddar Cheese',
  'artisanal-cheddar-cheese',
  'Aged 12 months, sharp and creamy cheddar with complex flavor notes',
  8500,
  '200g',
  'cheese',
  'cow',
  ARRAY['aged', 'premium'],
  30,
  true,
  true
),
(
  'Organic Yogurt',
  'organic-yogurt',
  'Creamy, probiotics-rich yogurt made from organic milk',
  4200,
  '500ml',
  'yogurt',
  'cow',
  ARRAY['organic', 'probiotic', 'plain'],
  45,
  true,
  true
),
(
  'Butter Premium',
  'butter-premium',
  'Hand-churned butter with a golden color and rich, creamy taste',
  6500,
  '250g',
  'butter',
  'cow',
  ARRAY['artisanal', 'unsalted'],
  25,
  false,
  true
),
(
  'Fresh Mozzarella',
  'fresh-mozzarella',
  'Soft, stretchy mozzarella perfect for fresh salads and pizzas',
  7200,
  '250g',
  'cheese',
  'cow',
  ARRAY['fresh', 'vegetarian'],
  40,
  true,
  true
);

-- Insert product gallery images (sample URLs - replace with actual image URLs)
INSERT INTO public.product_gallery (product_id, image_url, alt_text, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1550583724-b2692b25a968?w=500', 'Fresh milk glass', true FROM public.products WHERE slug = 'fresh-whole-milk'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1589985643862-8e2b94e26d4f?w=500', 'Cheddar cheese block', true FROM public.products WHERE slug = 'artisanal-cheddar-cheese'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1488477181946-85a4f58eae50?w=500', 'Yogurt bowl', true FROM public.products WHERE slug = 'organic-yogurt'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=500', 'Butter on bread', true FROM public.products WHERE slug = 'butter-premium'
UNION ALL
SELECT id, 'https://images.unsplash.com/photo-1552159375-1b6c7f5f8b8c?w=500', 'Fresh mozzarella', true FROM public.products WHERE slug = 'fresh-mozzarella';
