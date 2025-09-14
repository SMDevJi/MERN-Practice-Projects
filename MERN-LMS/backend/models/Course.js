import mongoose, { Schema, model } from 'mongoose';

const lectureSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  isFree: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    required: true,
    default: 0
  }
});

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true,
    required: true
  },
  tutorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  tutor: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  whatsLearned: {
    type: String,
    default: ""
  },
  language: {
    type: String,
    required: true,
    default: 'English'
  },
  thumbnail: {
    type: String,
    required: true
  },
  lectures: {
    type: [lectureSchema],
    default: []
  },
  polarProductId: {
    type: String,
    required: true,
    default:''
  }
}, {
  timestamps: true
});

//its for setting order value before saving
// courseSchema.pre('save', function(next) {
//   if (this.isModified('lectures')) {
//     this.lectures.forEach((lecture, index) => {
//       lecture.order = index + 1;
//     });
//   }
//   next();
// });

const courseModel = model('course', courseSchema);
export default courseModel;
