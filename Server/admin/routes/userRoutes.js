import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser,
  deleteUserAccount
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public read for development
router.get('/', getAllUsers);
router.get('/:id', getUserById);

// Protected sensitive operations
router.post('/', protect, adminOnly, createUser);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUserAccount);

export default router;
