import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    trim: true  // Remove whitespace
  },
  mood: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  sentimentScore: {
    type: Number,
    default: 0,
    min: -1,  // Assuming sentiment score is between -1 and 1
    max: 1
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true // Adds createdAt and updatedAt
});

const Entry = mongoose.model('Entry', entrySchema);
export default Entry;
