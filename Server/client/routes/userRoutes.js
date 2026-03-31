import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  updateUserProfile, 
  deleteUser 
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// All user management routes must be protected
router.use(protect);

// Admin only: See everyone and delete profiles
router.get('/', adminOnly, getAllUsers);
router.delete('/:id', adminOnly, deleteUser);

// Self or Admin: See specific profile or update it
router.get('/:id', getUserById);
router.put('/:id', updateUserProfile);

export default router;