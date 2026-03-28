import express from 'express';
import { register, login, getMyProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMyProfile); // Only logged-in users can see their own info

export default router;