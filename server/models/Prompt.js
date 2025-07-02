import mongoose from 'mongoose';

const promptSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'general'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Prompt = mongoose.model('Prompt', promptSchema);