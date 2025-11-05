
import express from 'express';
import { getUserProfile } from '../controllers/user.controller.js';
import{
    followUser,
    getCurrentUser,
    getUserProfile,
    syncUser,
    updateProfile
} from '../controllers/user.controller.js';
import { ProtectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/sync', ProtectRoute, syncUser);
router.post('/me', ProtectRoute, getCurrentUser);
router.put('/profile', ProtectRoute, updateProfile);
router.post('/follow/:targetUserId', ProtectRoute, followUser);

export default router;