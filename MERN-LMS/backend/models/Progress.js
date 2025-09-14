import mongoose, { Schema, model } from "mongoose";

const progressSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    unique: true,
  },
  courses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course',
        required: true,
      },
      progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      completedLectureIds: [
        {
          type: String
        }
      ]
    }
  ]
}, { timestamps: true });

const progressModel = model('progress', progressSchema);
export default progressModel;
