import express from 'express';
import { getProducts, getProductBySlug, createProduct } from '../client/controllers/productController.js';
import { protect, adminOnly } from '../client/middleware/authMiddleware.js';

const router = express.Router();

// Public: Everyone in Toliara can browse the shop
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);

// Private: Only Jacques (Admin) can add new inventory
router.post('/', protect, adminOnly, createProduct);

export default router;