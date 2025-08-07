const mongoose = require('mongoose');
require('dotenv').config();

// Database Configuration
class DatabaseConfig {
  constructor() {
    this.connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/school_management';
    this.options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };
  }

  async connect() {
    try {
      await mongoose.connect(this.connectionString, this.options);
      console.log('✅ MongoDB connected successfully');
      
      // Handle connection events
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        console.log('🔄 MongoDB reconnected');
      });

      // Graceful shutdown
      process.on('SIGINT', this.gracefulShutdown);
      process.on('SIGTERM', this.gracefulShutdown);

    } catch (error) {
      console.error('❌ MongoDB connection failed:', error.message);
      process.exit(1);
    }
  }

  async gracefulShutdown() {
    try {
      await mongoose.connection.close();
      console.log('🔒 MongoDB connection closed through app termination');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during graceful shutdown:', error);
      process.exit(1);
    }
  }

  // Database health check
  async healthCheck() {
    try {
      const state = mongoose.connection.readyState;
      const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      };
      
      return {
        status: states[state],
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port
      };
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      };
    }
  }

  // Create indexes for better performance
  async createIndexes() {
    try {
      const { Student } = require('../profiles/student');
      const { Teacher } = require('../profiles/teacher');
      const { Parent } = require('../Profiles/parent');

      // Student indexes
      await Student.createIndexes([
        { rollNumber: 1 },
        { class: 1 },
        { name: 1 },
        { parentId: 1 }
      ]);

      // Teacher indexes
      await Teacher.createIndexes([
        { employeeId: 1 },
        { email: 1 },
        { subjectsHandling: 1 },
        { classTeacher: 1 }
      ]);

      // Parent indexes
      await Parent.createIndexes([
        { email: 1 },
        { phone: 1 },
        { 'wardDetails.studentId': 1 }
      ]);

      console.log('✅ Database indexes created successfully');
    } catch (error) {
      console.error('❌ Error creating indexes:', error.message);
    }
  }
}

// Singleton instance
const dbConfig = new DatabaseConfig();

module.exports = dbConfig;