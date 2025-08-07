import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  subjects: [{
    type: String,
    required: true
  }],
  classes: [{
    className: String,
    section: String
  }],
  qualification: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    default: 0
  },
  salary: {
    type: Number,
    required: true
  },
  joiningDate: {
    type: Date,
    required: true
  },
  schedule: [{
    day: String,
    periods: [{
      subject: String,
      class: String,
      section: String,
      time: String
    }]
  }]
}, {
  timestamps: true
});

export default mongoose.model('Teacher', teacherSchema);