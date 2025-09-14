import express from "express";
import authMiddleware from '../middleware/middleware.js';
import Feedback from "../models/Feedback.js";
import User from '../models/User.js'

const router = express.Router()



router.post('/submit-feedback', authMiddleware, async (req, res) => {
    try {
        const { comment } = req.body;

        if (!comment) {
            return res.status(400).json({ error: 'Comment is required' });
        }

        if (req.user.isTutor) {
            return res.status(403).json({ success: false, message: "Tutors can not submit feedback." });
        }

        const feedback = await Feedback.create({
            userId: req.user.id,
            comment,
        });

        return res.status(200).json({ success: true, message: 'Feedback submitted', feedback });
    } catch (error) {
        console.error('Error submitting feedback:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});





router.get('/get-feedbacks', async (req, res) => {
    try {
        const feedbacks = await Feedback
            .find()
            .sort({ _id: -1 })
            .limit(5)
            .populate({
                path: 'userId',
                select: 'name picture'
            });

        const formattedFeedbacks = feedbacks.map(feedback => ({
            _id: feedback._id,
            comment: feedback.comment,
            user: {
                _id: feedback.userId?._id,
                name: feedback.userId?.name,
                picture: feedback.userId?.picture,
            }
        }));

        return res.status(200).json({ success: true, feedbacks: formattedFeedbacks });
    } catch (error) {
        console.error('Error fetching feedbacks:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});







export default router;