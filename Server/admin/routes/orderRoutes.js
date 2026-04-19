import express from 'express';
import { 
  getAllOrders, 
  updateOrderStatus,
  deleteOrder,
  updateDeliveryDate
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public read for development
router.get('/', getAllOrders);

// Protected status updates
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

// Protected delete order
router.delete('/:id', protect, adminOnly, deleteOrder);

// Protected delivery date update
router.put('/:id/delivery-date', protect, adminOnly, updateDeliveryDate);

export default router;
