import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js'; 

import { getAuth } from '@clerk/express';
import { clerkClient} from '@clerk/express';


export const getUserProfile = asyncHandler(async (req,res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const { userid } = getAuth(req);
    const user = await User.findOneAndUpdate({clerkid: userid}, req.body, { new: true });

  
    if (!user) {
        return res.status(404).json({error: 'User not found' });
    }
    res.status(200).json({ user });
});

export const syncUser = asyncHandler(async (req, res) => {
    const { userid } = getAuth(req);

// Check if user already exists in mongo 
    const existingUser = await User.findOne({ clerkid: userid });
    if (existingUser) {
        return res.status(200).json({ user: existingUser, message: 'User already exists' });

    }

// Create new user from Clerk data
    const clerkUser = await clerkClient.users.getUser(userid);
    const userData = {
        clerkid: userid,
        email: clerkUser.emailAddresses[0].emailAddress,
        firstName: clerkUser.firstName || '',
        lastName: clerkUser.lastName || '',
        profilePicture: clerkUser.imageUrl || '',
    };
    
    const user = await User.create(userData);
    res.status(201).json({ user, message: 'User create successfully' });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
    const { userid } = getAuth(req);
    const user = await User.findOne({ clerkid: userid });
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
});

export const followUser = asyncHandler(async (req, res) => {
    const { userid } = getAuth(req);
    const { targetUserId } = req.params;

    if (userid === targetUserId) return res.status(400).json({ error: 'You cannot follow yourself' });

    const currentUser = await User.findOne({ clerkid: userid });
    const targetUser = await User.findById({ targetUserId });

    if (!currentUser || !targetUser) return res.status(404).json({ error: 'User not found' });

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
        // Unfollow user
        await User.findByIdAndUpdate(currentUser._id,{
            $pull: { followers: currentUser._id },
    }
        );
    }else {
        // Follow user
        await User.findByIdAndUpdate( currentUser._id,{
            $addToSet: { following: targetUserId },
        });
        await User.findByIdAndUpdate(targetUser._id,{
            $addToSet: { followers: currentUser._id },
        });
        
        // Create notification
        await Notification.create({
            from: currentUser._id,
            to: targetUserId,
            type: 'follow',
            
        });
    }

    res.status(200).json({
         message: isFollowing ? 'User unfollowed successfully' : 'User followed successfully' });
});

