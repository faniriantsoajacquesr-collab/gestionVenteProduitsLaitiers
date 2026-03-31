import express from 'express';
import { getMyCart, addToCart, removeFromCart } from '../client/controllers/cartController.js';
import { protect } from '../client/middleware/authMiddleware.js';

const router = express.Router();

// All routes here require being logged in
router.use(protect); 

router.get('/', getMyCart);
router.post('/add', addToCart);
router.delete('/:itemId', removeFromCart);

export default router;