const mongoose = require('mongoose');

// Teacher Schema
const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: Date,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  subjectsHandling: [{
    type: String,
    required: true
  }],
  qualifications: [{
    degree: {
      type: String,
      required: true
    },
    institution: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    grade: String
  }],
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  joiningDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  classTeacher: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  salary: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

const Teacher = mongoose.model('Teacher', teacherSchema);

// Teacher Controller Functions
class TeacherController {
  // Create new teacher
  static async createTeacher(teacherData) {
    try {
      const teacher = new Teacher(teacherData);
      await teacher.save();
      return { success: true, data: teacher };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get all teachers
  static async getAllTeachers() {
    try {
      const teachers = await Teacher.find();
      return { success: true, data: teachers };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get teacher by ID
  static async getTeacherById(teacherId) {
    try {
      const teacher = await Teacher.findById(teacherId);
      if (!teacher) {
        return { success: false, error: 'Teacher not found' };
      }
      return { success: true, data: teacher };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update teacher
  static async updateTeacher(teacherId, updateData) {
    try {
      const teacher = await Teacher.findByIdAndUpdate(
        teacherId, 
        updateData, 
        { new: true, runValidators: true }
      );
      if (!teacher) {
        return { success: false, error: 'Teacher not found' };
      }
      return { success: true, data: teacher };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete teacher
  static async deleteTeacher(teacherId) {
    try {
      const teacher = await Teacher.findByIdAndDelete(teacherId);
      if (!teacher) {
        return { success: false, error: 'Teacher not found' };
      }
      return { success: true, message: 'Teacher deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get teachers by subject
  static async getTeachersBySubject(subject) {
    try {
      const teachers = await Teacher.find({ subjectsHandling: { $in: [subject] } });
      return { success: true, data: teachers };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Assign class teacher
  static async assignClassTeacher(teacherId, className) {
    try {
      const teacher = await Teacher.findByIdAndUpdate(
        teacherId,
        { classTeacher: className },
        { new: true }
      );
      if (!teacher) {
        return { success: false, error: 'Teacher not found' };
      }
      return { success: true, data: teacher };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = { Teacher, TeacherController };