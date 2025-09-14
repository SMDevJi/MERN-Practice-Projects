import mongoose, { Schema, model } from "mongoose";

const orderSchema = new Schema({
    metadata: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        userEmail: {
            type: String,
            required: true
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'course',
            required: true
        },
        courseTitle: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min:0
        },
        studentName: {
            type: String,
            required: true
        }, 
        tutorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
    },
    paid: {
        type: Boolean,
        default: false
    },
    checkoutId: {
        type: String,
        default: ''
    }
}, { timestamps: true });

const orderModel = model('order', orderSchema);
export default orderModel
