const mongoose = require('mongoose');

// Timetable Schema
const timetableSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true
  },
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    required: true
  },
  periods: [{
    periodNumber: Number,
    subject: String,
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    },
    teacherName: String,
    startTime: String,
    endTime: String
  }]
}, {
  timestamps: true
});

// School Documentation Schema
const documentationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Policy', 'Procedure', 'Form', 'Certificate', 'Report', 'Other'],
    required: true
  },
  description: String,
  fileUrl: String,
  uploadDate: {
    type: Date,
    default: Date.now
  },
  uploadedBy: {
    type: String,
    required: true
  },
  category: String,
  version: {
    type: String,
    default: '1.0'
  }
}, {
  timestamps: true
});

// Circulars Schema
const circularSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  targetAudience: [{
    type: String,
    enum: ['Students', 'Teachers', 'Parents', 'All'],
    required: true
  }],
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: Date,
  attachments: [String],
  publishedBy: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Curriculum Schema
const curriculumSchema = new mongoose.Schema({
  class: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  syllabus: [{
    unit: String,
    topics: [String],
    duration: String,
    learningObjectives: [String]
  }],
  textbooks: [{
    title: String,
    author: String,
    publisher: String,
    isbn: String
  }],
  assessmentCriteria: [{
    type: String,
    weightage: Number,
    description: String
  }],
  academicYear: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Admin Schema
const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['Super Admin', 'Principal', 'Vice Principal', 'Academic Coordinator'],
    required: true
  },
  permissions: [{
    module: String,
    actions: [String]
  }],
  lastLogin: Date
}, {
  timestamps: true
});

// Models
const Timetable = mongoose.model('Timetable', timetableSchema);
const Documentation = mongoose.model('Documentation', documentationSchema);
const Circular = mongoose.model('Circular', circularSchema);
const Curriculum = mongoose.model('Curriculum', curriculumSchema);
const Admin = mongoose.model('Admin', adminSchema);

// Admin Controller Functions
class AdminController {
  // ===== TIMETABLE MANAGEMENT =====
  static async createTimetable(timetableData) {
    try {
      const timetable = new Timetable(timetableData);
      await timetable.save();
      return { success: true, data: timetable };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getTimetableByClass(className) {
    try {
      const timetable = await Timetable.find({ class: className }).populate('periods.teacherId');
      return { success: true, data: timetable };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async updateTimetable(timetableId, updateData) {
    try {
      const timetable = await Timetable.findByIdAndUpdate(
        timetableId, 
        updateData, 
        { new: true }
      );
      return { success: true, data: timetable };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== DOCUMENTATION MANAGEMENT =====
  static async addDocument(documentData) {
    try {
      const document = new Documentation(documentData);
      await document.save();
      return { success: true, data: document };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getAllDocuments() {
    try {
      const documents = await Documentation.find().sort({ uploadDate: -1 });
      return { success: true, data: documents };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getDocumentsByType(type) {
    try {
      const documents = await Documentation.find({ type }).sort({ uploadDate: -1 });
      return { success: true, data: documents };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== CIRCULARS MANAGEMENT =====
  static async createCircular(circularData) {
    try {
      const circular = new Circular(circularData);
      await circular.save();
      return { success: true, data: circular };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getAllCirculars() {
    try {
      const circulars = await Circular.find({ isActive: true }).sort({ publishDate: -1 });
      return { success: true, data: circulars };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getCircularsByAudience(audience) {
    try {
      const circulars = await Circular.find({ 
        targetAudience: { $in: [audience] },
        isActive: true 
      }).sort({ publishDate: -1 });
      return { success: true, data: circulars };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== CURRICULUM MANAGEMENT =====
  static async addCurriculum(curriculumData) {
    try {
      const curriculum = new Curriculum(curriculumData);
      await curriculum.save();
      return { success: true, data: curriculum };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getCurriculumByClass(className) {
    try {
      const curriculum = await Curriculum.find({ class: className });
      return { success: true, data: curriculum };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== DATA ANALYTICS & REPORTS =====
  static async getSchoolStatistics() {
    try {
      const Student = require('./student').Student;
      const Teacher = require('./teacher').Teacher;
      const Parent = require('../parent').Parent;

      const totalStudents = await Student.countDocuments();
      const totalTeachers = await Teacher.countDocuments();
      const totalParents = await Parent.countDocuments();

      const studentsByClass = await Student.aggregate([
        { $group: { _id: '$class', count: { $sum: 1 } } }
      ]);

      const teachersBySubject = await Teacher.aggregate([
        { $unwind: '$subjectsHandling' },
        { $group: { _id: '$subjectsHandling', count: { $sum: 1 } } }
      ]);

      return {
        success: true,
        data: {
          totalStudents,
          totalTeachers,
          totalParents,
          studentsByClass,
          teachersBySubject
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== USER MANAGEMENT =====
  static async getAllUsers() {
    try {
      const Student = require('./student').Student;
      const Teacher = require('./teacher').Teacher;
      const Parent = require('../parent').Parent;

      const students = await Student.find().select('name email class rollNumber');
      const teachers = await Teacher.find().select('name email subjectsHandling employeeId');
      const parents = await Parent.find().select('name email phone');

      return {
        success: true,
        data: {
          students,
          teachers,
          parents
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== ATTENDANCE MANAGEMENT =====
  static async generateAttendanceReport(className, startDate, endDate) {
    try {
      // This would typically integrate with an attendance system
      // For now, returning a placeholder structure
      return {
        success: true,
        data: {
          class: className,
          period: { startDate, endDate },
          summary: 'Attendance report generated successfully'
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // ===== FEE MANAGEMENT =====
  static async getFeeStatusReport() {
    try {
      const Parent = require('../parent').Parent;
      
      const feeData = await Parent.aggregate([
        { $unwind: '$feePayments' },
        {
          $group: {
            _id: '$feePayments.status',
            count: { $sum: 1 },
            totalAmount: { $sum: '$feePayments.amount' }
          }
        }
      ]);

      return { success: true, data: feeData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = { 
  Admin, 
  Timetable, 
  Documentation, 
  Circular, 
  Curriculum, 
  AdminController 
};