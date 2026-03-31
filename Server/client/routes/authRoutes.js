import express from 'express';
import { register, login, getMyProfile } from '../client/controllers/authController.js';
import { protect } from '../client/middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMyProfile); // Only logged-in users can see their own info

export default router;