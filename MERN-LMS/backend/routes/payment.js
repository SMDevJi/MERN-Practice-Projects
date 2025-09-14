import express from "express";
import crypto from 'crypto';
import authMiddleware from "../middleware/middleware.js";
import dotenv from 'dotenv';
import Course from "../models/Course.js";
import { createCheckout } from "../utils/polar.js";
import Order from "../models/Order.js";
import User from "../models/User.js";

dotenv.config();


const router = express.Router()


router.post('/create-checkout', authMiddleware, async (req, res) => {
    const { courseId } = req.body;
    if (req.user.isTutor) {
        return res.status(403).json({ success: false, message: "Tutors can not buy courses." });
    }
    try {
        let course;
        try {
            course = await Course.findById(courseId);
        } catch (error) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }
        let user;
        try {
            user = await User.findById(req.user.id)
            if (user.enrolledCourses.includes(courseId)) {
                return res.status(400).json({ success: false, message: "Course already purchased." });
            }
        } catch (error) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const productId = course.polarProductId;
        const userId = req.user.id;
        const userEmail = req.user.email;
        const successUrl = `${process.env.FRONTEND_URL}/payment-success/${courseId}?title=${course.title}&price=${course.price}`;

        try {
            await Order.findOneAndDelete({
                'metadata.userId': userId,
                'metadata.courseId': courseId
            });
        } catch (error) {
            console.error('Order doesn\'t exist or failed to delete Order.')
            //return res.status(500).json({ success: false, message: 'Order doesn\'t exist or failed to delete Order.' });
        }


        const checkoutData = await createCheckout(productId, userId, userEmail, courseId, successUrl);

        const newOrder = new Order({
            metadata: {
                userId,
                userEmail,
                courseId,
                courseTitle:course.title,
                price:course.price,
                studentName:req.user.name,
                tutorId:course.tutorId
            },
            checkoutId: checkoutData.id,
            paid: false
        });

        await newOrder.save();

        res.status(200).json({
            success: true,
            checkoutUrl: checkoutData.url,
            checkoutId: checkoutData.id,
            expiresAt: checkoutData.expires_at
        });

    } catch (error) {
        console.error('Create checkout error:', error.message || error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});








router.post('/confirm', async (req, res) => {
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
    const signature = req.headers['webhook-signature'];
    const timestamp = req.headers['webhook-timestamp'];
    const webhookId = req.headers['webhook-id'];

    try {
        // Ensure we have the raw body as Buffer
        const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body);

        // Standard Webhooks format: {id}.{timestamp}.{body}
        const signaturePayload = `${webhookId}.${timestamp}.${rawBody.toString()}`;

        const expectedSignature = crypto
            .createHmac('sha256', webhookSecret)
            .update(signaturePayload)
            .digest('base64');

        //console.log('Expected signature:', expectedSignature);

        // Extract signature without v1, prefix
        const receivedSignature = signature.startsWith('v1,') ? signature.slice(3) : signature;
        //console.log('Received signature:', receivedSignature);

        if (receivedSignature !== expectedSignature) {
            console.log('❌ Signature mismatch');
            return res.status(403).send('Invalid signature');
        }

        //console.log(' Signature verified');


        const payload = JSON.parse(rawBody.toString());

        switch (payload.type) {
            case 'order.paid':
                //console.log('Payment completed:', payload.data);
                const { userId, courseId } = payload.data.metadata;

                await Order.findOneAndUpdate(
                    { 'metadata.userId': userId, 'metadata.courseId': courseId },
                    { paid: true }
                );

                await User.findByIdAndUpdate(
                    userId,
                    { $addToSet: { enrolledCourses: courseId } }
                );
                break;

            default:
                console.log('Unhandled webhook event:', payload.type);
        }

        res.status(200).send('OK');

    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send('Bad Request');
    }
});




export default router;