const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import database configuration
const dbConfig = require('./Database/database');

// Import controllers
const { StudentController } = require('./profiles/student');
const { TeacherController } = require('./profiles/teacher');
const { ParentController } = require('./Profiles/parent');
const { AdminController } = require('./Profiles/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Connect to database
dbConfig.connect().then(() => {
  // Create indexes after connection
  dbConfig.createIndexes();
});

// Health check endpoint
app.get('/health', async (req, res) => {
  const dbHealth = await dbConfig.healthCheck();
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: dbHealth
  });
});

// ===== STUDENT ROUTES =====
app.post('/api/students', async (req, res) => {
  try {
    const result = await StudentController.createStudent(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/students', async (req, res) => {
  try {
    const result = await StudentController.getAllStudents();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/students/:id', async (req, res) => {
  try {
    const result = await StudentController.getStudentById(req.params.id);
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/students/:id', async (req, res) => {
  try {
    const result = await StudentController.updateStudent(req.params.id, req.body);
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/students/:id', async (req, res) => {
  try {
    const result = await StudentController.deleteStudent(req.params.id);
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/students/class/:className', async (req, res) => {
  try {
    const result = await StudentController.getStudentsByClass(req.params.className);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== TEACHER ROUTES =====
app.post('/api/teachers', async (req, res) => {
  try {
    const result = await TeacherController.createTeacher(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/teachers', async (req, res) => {
  try {
    const result = await TeacherController.getAllTeachers();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/teachers/:id', async (req, res) => {
  try {
    const result = await TeacherController.getTeacherById(req.params.id);
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/teachers/:id', async (req, res) => {
  try {
    const result = await TeacherController.updateTeacher(req.params.id, req.body);
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/teachers/:id', async (req, res) => {
  try {
    const result = await TeacherController.deleteTeacher(req.params.id);
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/teachers/subject/:subject', async (req, res) => {
  try {
    const result = await TeacherController.getTeachersBySubject(req.params.subject);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/teachers/:id/assign-class/:className', async (req, res) => {
  try {
    const result = await TeacherController.assignClassTeacher(req.params.id, req.params.className);
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== PARENT ROUTES =====
app.post('/api/parents', async (req, res) => {
  try {
    const result = await ParentController.createParent(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/parents', async (req, res) => {
  try {
    const result = await ParentController.getAllParents();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/parents/:id', async (req, res) => {
  try {
    const result = await ParentController.getParentById(req.params.id);
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/parents/:id', async (req, res) => {
  try {
    const result = await ParentController.updateParent(req.params.id, req.body);
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/parents/:id/scores', async (req, res) => {
  try {
    const result = await ParentController.addWardScore(req.params.id, req.body);
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/parents/:id/payments', async (req, res) => {
  try {
    const result = await ParentController.addFeePayment(req.params.id, req.body);
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/parents/:parentId/scores/:studentId', async (req, res) => {
  try {
    const result = await ParentController.getWardScores(req.params.parentId, req.params.studentId);
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/parents/:parentId/payments', async (req, res) => {
  try {
    const studentId = req.query.studentId || null;
    const result = await ParentController.getFeePayments(req.params.parentId, studentId);
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== ADMIN ROUTES =====

// Timetable Management
app.post('/api/admin/timetable', async (req, res) => {
  try {
    const result = await AdminController.createTimetable(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/timetable/:className', async (req, res) => {
  try {
    const result = await AdminController.getTimetableByClass(req.params.className);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/timetable/:id', async (req, res) => {
  try {
    const result = await AdminController.updateTimetable(req.params.id, req.body);
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Documentation Management
app.post('/api/admin/documents', async (req, res) => {
  try {
    const result = await AdminController.addDocument(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/documents', async (req, res) => {
  try {
    const result = await AdminController.getAllDocuments();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/documents/:type', async (req, res) => {
  try {
    const result = await AdminController.getDocumentsByType(req.params.type);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Circulars Management
app.post('/api/admin/circulars', async (req, res) => {
  try {
    const result = await AdminController.createCircular(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/circulars', async (req, res) => {
  try {
    const result = await AdminController.getAllCirculars();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/circulars/:audience', async (req, res) => {
  try {
    const result = await AdminController.getCircularsByAudience(req.params.audience);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Curriculum Management
app.post('/api/admin/curriculum', async (req, res) => {
  try {
    const result = await AdminController.addCurriculum(req.body);
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/curriculum/:className', async (req, res) => {
  try {
    const result = await AdminController.getCurriculumByClass(req.params.className);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Analytics and Reports
app.get('/api/admin/statistics', async (req, res) => {
  try {
    const result = await AdminController.getSchoolStatistics();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const result = await AdminController.getAllUsers();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/reports/attendance/:className', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const result = await AdminController.generateAttendanceReport(
      req.params.className, 
      startDate, 
      endDate
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/reports/fees', async (req, res) => {
  try {
    const result = await AdminController.getFeeStatusReport();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 School Management System server running on port ${PORT}`);
  console.log(`🌐 API Documentation: http://localhost:${PORT}/health`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;