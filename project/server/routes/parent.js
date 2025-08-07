import express from 'express';
import Parent from '../models/Parent.js';
import Student from '../models/Student.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Get parent profile
router.get('/profile', authenticateToken, authorizeRoles('parent'), async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.user._id })
      .populate('userId', 'name email phone')
      .populate('children');
    
    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }
    res.json(parent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get children's information
router.get('/children', authenticateToken, authorizeRoles('parent'), async (req, res) => {
  try {
    const parent = await Parent.findOne({ userId: req.user._id });
    if (!parent) {
      return res.status(404).json({ message: 'Parent not found' });
    }

    const children = await Student.find({ _id: { $in: parent.children } }).populate('userId', 'name');
    res.json(children);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;