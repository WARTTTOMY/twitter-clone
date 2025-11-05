import express from 'express';
import { createPost,
     getPosts,
     getPosts,
     getUserPosts,
     likePost,
     deletePost
} from '../controllers/post.controller.js';
import {protectRoute} from '../middlewares/auth.middleware.js';
import upload from '../middlewares/upload.middleware.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:postid', getPosts);
router.get('/user/:username', getUserPosts );

//protected routes
router.post('/', protectRoute, upload.single('image'), createPost);
router.post('/:postid/like', protectRoute, likePost);
router.post('/:postId', protectRoute, deletePost);

export default router; 