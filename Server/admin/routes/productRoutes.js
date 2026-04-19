import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Logger specifically for Admin Product routes to debug 401/403 issues
router.use((req, res, next) => {
  console.log(`[Admin Product API] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// Public read access for admin panel preview
router.get('/', getProducts);
router.get('/:id', getProductById);

// Public access for USER TESTING (CRUD)
router.post('/', createProduct); 
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
