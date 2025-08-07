import express from 'express';
import Teacher from '../models/Teacher.js';
import Student from '../models/Student.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get teacher profile
router.get('/profile', authenticateToken, authorizeRoles('teacher'), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id }).populate('userId', 'name email phone');
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher profile not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get students in teacher's classes
router.get('/students', authenticateToken, authorizeRoles('teacher'), async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user._id });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    const classConditions = teacher.classes.map(cls => ({
      class: cls.className,
      section: cls.section
    }));

    const students = await Student.find({ $or: classConditions }).populate('userId', 'name email');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;