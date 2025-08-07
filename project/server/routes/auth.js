import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Parent from '../models/Parent.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role,
      phone,
      address
    });

    await user.save();

    // Create role-specific profile
    if (role === 'student') {
      const student = new Student({
        userId: user._id,
        studentId: `STU${Date.now()}`,
        class: req.body.class || '1st',
        section: req.body.section || 'A',
        rollNumber: req.body.rollNumber || '1',
        dateOfBirth: req.body.dateOfBirth || new Date(),
        subjects: req.body.subjects || []
      });
      await student.save();
    } else if (role === 'teacher') {
      const teacher = new Teacher({
        userId: user._id,
        employeeId: `TECH${Date.now()}`,
        subjects: req.body.subjects || [],
        qualification: req.body.qualification || 'Bachelor\'s Degree',
        salary: req.body.salary || 50000,
        joiningDate: new Date()
      });
      await teacher.save();
    } else if (role === 'parent') {
      const parent = new Parent({
        userId: user._id,
        occupation: req.body.occupation || '',
        relationship: req.body.relationship || 'father'
      });
      await parent.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;