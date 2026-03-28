import express from 'express';
import { createOrder, getMyOrders } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/checkout', createOrder);
router.get('/history', getMyOrders);

export default router;