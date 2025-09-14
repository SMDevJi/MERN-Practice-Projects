import mongoose, { Schema, model } from "mongoose";

const feedbackSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    comment: { type: String, required: true },
    
})

const feedbackModel = model('feedback', feedbackSchema)
export default feedbackModel