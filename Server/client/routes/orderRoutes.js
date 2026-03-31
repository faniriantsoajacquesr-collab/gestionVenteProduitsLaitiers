import express from 'express';
import { createOrder, getMyOrders } from '../client/controllers/orderController.js';
import { protect } from '../client/middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/checkout', createOrder);
router.get('/history', getMyOrders);

export default router;