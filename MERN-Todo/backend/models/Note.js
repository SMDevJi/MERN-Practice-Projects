import mongoose, { Schema, model } from "mongoose";

const noteSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
},{timestamps:true})

const noteModel = model('note', noteSchema)
export default noteModel