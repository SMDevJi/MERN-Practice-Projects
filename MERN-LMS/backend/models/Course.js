import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
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
  }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true,
    required:true
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
    type: [String],
    default: []
  },
  language: {
    type: String,
    required:true,
    default: 'English'
  },
  thumbnail: {
    type: String,
    required:true
  },
  lectures: {
    type: [lectureSchema],
    default: []
  }
}, {
  timestamps: true
});

const courceModel=mongoose.model('course', courseSchema);
export default courceModel
