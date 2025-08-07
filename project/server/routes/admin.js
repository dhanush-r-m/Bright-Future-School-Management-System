import express from 'express';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Parent from '../models/Parent.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalTeachers = await Teacher.countDocuments();
    const totalParents = await Parent.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });

    res.json({
      totalStudents,
      totalTeachers,
      totalParents,
      activeUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all users
router.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all students
router.get('/students', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const students = await Student.find().populate('userId', 'name email phone');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all teachers
router.get('/teachers', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const teachers = await Teacher.find().populate('userId', 'name email phone');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;