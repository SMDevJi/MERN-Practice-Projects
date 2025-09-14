import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default:"" },
    isOauth: { type: Boolean, required: true },
    picture:{ type: String, default:"" },
    enrolledCourses:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'course'
        },
    ],
    isTutor:{ type: Boolean, required: true }

})

const userModel = model('user', userSchema)
export default userModel