const mongoose = require('mongoose');

// Student Schema
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  fatherName: {
    type: String,
    required: true,
    trim: true
  },
  motherName: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  admissionDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  class: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parent'
  }
}, {
  timestamps: true
});

const Student = mongoose.model('Student', studentSchema);

// Student Controller Functions
class StudentController {
  // Create new student
  static async createStudent(studentData) {
    try {
      const student = new Student(studentData);
      await student.save();
      return { success: true, data: student };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get all students
  static async getAllStudents() {
    try {
      const students = await Student.find().populate('parentId');
      return { success: true, data: students };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get student by ID
  static async getStudentById(studentId) {
    try {
      const student = await Student.findById(studentId).populate('parentId');
      if (!student) {
        return { success: false, error: 'Student not found' };
      }
      return { success: true, data: student };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update student
  static async updateStudent(studentId, updateData) {
    try {
      const student = await Student.findByIdAndUpdate(
        studentId, 
        updateData, 
        { new: true, runValidators: true }
      );
      if (!student) {
        return { success: false, error: 'Student not found' };
      }
      return { success: true, data: student };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete student
  static async deleteStudent(studentId) {
    try {
      const student = await Student.findByIdAndDelete(studentId);
      if (!student) {
        return { success: false, error: 'Student not found' };
      }
      return { success: true, message: 'Student deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get students by class
  static async getStudentsByClass(className) {
    try {
      const students = await Student.find({ class: className }).populate('parentId');
      return { success: true, data: students };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = { Student, StudentController };