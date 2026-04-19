import express from 'express';
import multer from 'multer';
import { 
  getAllUsers, 
  getUserById, 
  upsertUserProfile, 
  deleteUser,
  uploadAvatar
} from '../controllers/userController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// All user management routes must be protected
router.use(protect);

// Static routes FIRST (before :id routes)
router.post('/avatar/upload', upload.single('avatar'), uploadAvatar);

// Admin only: See everyone and delete profiles
router.get('/', adminOnly, getAllUsers);
router.delete('/:id', adminOnly, deleteUser);

// Self or Admin: See specific profile or update it
router.get('/:id', getUserById);
router.put('/:id', upsertUserProfile);

export default router;