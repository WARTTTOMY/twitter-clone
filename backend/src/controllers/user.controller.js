import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js';
import { getAuth } from '@clerk/express';


export const getUserProfile = asyncHandler(async (req,res) => {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const { username } = req.params;
    const { bio, location } = req.body;
    const user = await User.findOneAndUpdate(
        { username },
        { bio, location },
        { new: true }
    );
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
});

export const syncUser = asyncHandler(async (req, res) => {
});
