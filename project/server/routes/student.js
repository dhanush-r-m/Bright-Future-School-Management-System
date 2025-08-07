import express from 'express';
import Student from '../models/Student.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get student profile
router.get('/profile', authenticateToken, authorizeRoles('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id }).populate('userId', 'name email phone');
    if (!student) {
      return res.status(404).json({ message: 'Student profile not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student grades
router.get('/grades', authenticateToken, authorizeRoles('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student.grades);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student attendance
router.get('/attendance', authenticateToken, authorizeRoles('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ userId: req.user._id });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student.attendance);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;