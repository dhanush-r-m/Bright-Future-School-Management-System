const mongoose = require('mongoose');

// Parent Schema
const parentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  wardDetails: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    studentName: {
      type: String,
      required: true
    },
    class: {
      type: String,
      required: true
    },
    rollNumber: {
      type: String,
      required: true
    }
  }],
  wardScores: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    subject: String,
    examType: {
      type: String,
      enum: ['Unit Test', 'Mid Term', 'Final Exam', 'Assignment']
    },
    score: Number,
    maxScore: Number,
    grade: String,
    date: Date
  }],
  feePayments: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    term: {
      type: String,
      enum: ['Term 1', 'Term 2', 'Term 3', 'Annual']
    },
    amount: {
      type: Number,
      required: true
    },
    paymentDate: {
      type: Date,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['Cash', 'Cheque', 'Online', 'Bank Transfer'],
      required: true
    },
    receiptNumber: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['Paid', 'Pending', 'Overdue'],
      default: 'Paid'
    }
  }],
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  occupation: String,
  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  }
}, {
  timestamps: true
});

const Parent = mongoose.model('Parent', parentSchema);

// Parent Controller Functions
class ParentController {
  // Create new parent
  static async createParent(parentData) {
    try {
      const parent = new Parent(parentData);
      await parent.save();
      return { success: true, data: parent };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get all parents
  static async getAllParents() {
    try {
      const parents = await Parent.find().populate('wardDetails.studentId');
      return { success: true, data: parents };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get parent by ID
  static async getParentById(parentId) {
    try {
      const parent = await Parent.findById(parentId)
        .populate('wardDetails.studentId')
        .populate('wardScores.studentId')
        .populate('feePayments.studentId');
      if (!parent) {
        return { success: false, error: 'Parent not found' };
      }
      return { success: true, data: parent };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update parent
  static async updateParent(parentId, updateData) {
    try {
      const parent = await Parent.findByIdAndUpdate(
        parentId, 
        updateData, 
        { new: true, runValidators: true }
      );
      if (!parent) {
        return { success: false, error: 'Parent not found' };
      }
      return { success: true, data: parent };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Add ward score
  static async addWardScore(parentId, scoreData) {
    try {
      const parent = await Parent.findByIdAndUpdate(
        parentId,
        { $push: { wardScores: scoreData } },
        { new: true }
      );
      if (!parent) {
        return { success: false, error: 'Parent not found' };
      }
      return { success: true, data: parent };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Add fee payment
  static async addFeePayment(parentId, paymentData) {
    try {
      const parent = await Parent.findByIdAndUpdate(
        parentId,
        { $push: { feePayments: paymentData } },
        { new: true }
      );
      if (!parent) {
        return { success: false, error: 'Parent not found' };
      }
      return { success: true, data: parent };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get ward scores for specific student
  static async getWardScores(parentId, studentId) {
    try {
      const parent = await Parent.findById(parentId);
      if (!parent) {
        return { success: false, error: 'Parent not found' };
      }
      const scores = parent.wardScores.filter(
        score => score.studentId.toString() === studentId
      );
      return { success: true, data: scores };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get fee payment history
  static async getFeePayments(parentId, studentId = null) {
    try {
      const parent = await Parent.findById(parentId);
      if (!parent) {
        return { success: false, error: 'Parent not found' };
      }
      let payments = parent.feePayments;
      if (studentId) {
        payments = payments.filter(
          payment => payment.studentId.toString() === studentId
        );
      }
      return { success: true, data: payments };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = { Parent, ParentController };