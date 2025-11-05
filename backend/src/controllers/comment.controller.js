import asyncHandler from 'express-async-handler';
import { getAuth } from '@clerk/express';
import Comment from '../models/comment.model.js';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import { type } from 'os';

export const getComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.find({ post: postId })
    .populate('user', 'username firstName lastName aprofilePicture')
    .sort({ createdAt: -1 });
    res.status(200).json({ comments });
});

export const createComment = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { content } = req.body;
    const { userId } = getAuth(req);

    if (!content || content.trim() === '') {
        res.status(400);
        throw new Error('Comment content cannot be empty');
    }

    const user = await User.findOne({ clerkId: userId });
    const post = await Post.findById(postId);

    if (!user || !post) { return res.status(404).json({ error: 'User or Post not found' }); }

    const comment = await Comment.create({
        content,
        user: user._id,
        post: postId,
    });

   await Post.findByIdAndUpdate(postId, {
       $push: { comments: comment._id }
   });

   if (post.user.toString() !== user._id.toString()) {
       await Notification.create({
           from: user._id,
           to: post.user,
           type: 'comment',
           post: post._id,
           comment: comment._id,
       });
   }
    res.status(201).json({ comment });

});

export const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { userId } = getAuth(req);

    const user = await User.findOne({ clerkId: userId });
    const comment = await Comment.findById(commentId);

    if (!user || !comment) {
        return res.status(404).json({ error: 'User or Comment not found' });
    }

    if (comment.user.toString() !== user._id.toString()) {
        return res.status(403).json({ error: 'You are not authorized to delete this comment' });

    }

    await post.findByIdAndUpdate(comment.post, {
        $pull: { comments: commentId }
    });

    await comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: 'Comment deleted successfully' });
});