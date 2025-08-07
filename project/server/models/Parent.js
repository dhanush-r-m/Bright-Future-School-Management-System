import mongoose from 'mongoose';

const parentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  occupation: {
    type: String
  },
  emergencyContact: {
    type: String
  },
  relationship: {
    type: String,
    enum: ['father', 'mother', 'guardian'],
    default: 'father'
  }
}, {
  timestamps: true
});

export default mongoose.model('Parent', parentSchema);