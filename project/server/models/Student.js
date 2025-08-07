import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  class: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  subjects: [{
    type: String
  }],
  grades: [{
    subject: String,
    marks: Number,
    totalMarks: Number,
    grade: String,
    examDate: Date
  }],
  attendance: [{
    date: Date,
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      default: 'present'
    }
  }],
  fees: {
    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
    lastPaymentDate: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('Student', studentSchema);