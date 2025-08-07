import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import studentRoutes from './routes/student.js';
import teacherRoutes from './routes/teacher.js';
import parentRoutes from './routes/parent.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/parent', parentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'School Management System API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});