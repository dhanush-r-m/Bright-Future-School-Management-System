import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Calendar, Award, User } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [grades, setGrades] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const [profileRes, gradesRes, attendanceRes] = await Promise.all([
        axios.get('/api/student/profile'),
        axios.get('/api/student/grades'),
        axios.get('/api/student/attendance')
      ]);
      
      setProfile(profileRes.data);
      setGrades(gradesRes.data);
      setAttendance(attendanceRes.data);
    } catch (error) {
      console.error('Failed to fetch student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAttendancePercentage = () => {
    if (attendance.length === 0) return 0;
    const presentDays = attendance.filter(day => day.status === 'present').length;
    return Math.round((presentDays / attendance.length) * 100);
  };

  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    const totalPoints = grades.reduce((sum, grade) => {
      const percentage = (grade.marks / grade.totalMarks) * 100;
      let points = 0;
      if (percentage >= 90) points = 4.0;
      else if (percentage >= 80) points = 3.0;
      else if (percentage >= 70) points = 2.0;
      else if (percentage >= 60) points = 1.0;
      return sum + points;
    }, 0);
    return (totalPoints / grades.length).toFixed(1);
  };

  const DashboardHome = () => (
    <div>
      <div className="main-header">
        <h1 className="page-title">Student Dashboard</h1>
        <div className="user-menu">
          <div className="user-avatar">{user?.name?.charAt(0)}</div>
          <span style={{ fontWeight: '600' }}>{user?.name}</span>
        </div>
      </div>
      
      <div style={{ padding: '32px' }}>
        {/* Statistics Cards */}
        <div className="grid grid-cols-4" style={{ marginBottom: '32px' }}>
          <div className="stat-card">
            <div className="stat-icon primary">
              <BookOpen size={24} />
            </div>
            <div className="stat-number">{grades.length}</div>
            <div className="stat-label">Subjects</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon secondary">
              <Award size={24} />
            </div>
            <div className="stat-number">{calculateGPA()}</div>
            <div className="stat-label">GPA</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon accent">
              <Calendar size={24} />
            </div>
            <div className="stat-number">{calculateAttendancePercentage()}%</div>
            <div className="stat-label">Attendance</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon success">
              <User size={24} />
            </div>
            <div className="stat-number">{profile?.class}-{profile?.section}</div>
            <div className="stat-label">Class</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-2">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Grades</h2>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center">
                  <div className="spinner"></div>
                </div>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Marks</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {grades.slice(0, 5).map((grade: any, index) => (
                        <tr key={index}>
                          <td>{grade.subject}</td>
                          <td>{grade.marks}/{grade.totalMarks}</td>
                          <td>
                            <span className={`badge ${grade.marks >= grade.totalMarks * 0.8 ? 'success' : grade.marks >= grade.totalMarks * 0.6 ? 'warning' : 'error'}`}>
                              {grade.grade || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Attendance Overview</h2>
            </div>
            <div className="card-body">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '48px', fontWeight: '700', color: 'var(--primary-color)' }}>
                  {calculateAttendancePercentage()}%
                </div>
                <div style={{ color: 'var(--neutral-600)' }}>Overall Attendance</div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--success-color)' }}>
                    {attendance.filter(day => day.status === 'present').length}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--neutral-600)' }}>Present</div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--error-color)' }}>
                    {attendance.filter(day => day.status === 'absent').length}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--neutral-600)' }}>Absent</div>
                </div>
                <div>
                  <div style={{ fontWeight: '600', color: 'var(--warning-color)' }}>
                    {attendance.filter(day => day.status === 'late').length}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--neutral-600)' }}>Late</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const GradesView = () => (
    <div>
      <div className="main-header">
        <h1 className="page-title">My Grades</h1>
      </div>
      
      <div style={{ padding: '32px' }}>
        <div className="card">
          <div className="card-body">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Marks Obtained</th>
                    <th>Total Marks</th>
                    <th>Percentage</th>
                    <th>Grade</th>
                    <th>Exam Date</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade: any, index) => {
                    const percentage = Math.round((grade.marks / grade.totalMarks) * 100);
                    return (
                      <tr key={index}>
                        <td>{grade.subject}</td>
                        <td>{grade.marks}</td>
                        <td>{grade.totalMarks}</td>
                        <td>{percentage}%</td>
                        <td>
                          <span className={`badge ${percentage >= 80 ? 'success' : percentage >= 60 ? 'warning' : 'error'}`}>
                            {grade.grade || (percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : 'C')}
                          </span>
                        </td>
                        <td>{grade.examDate ? new Date(grade.examDate).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const AttendanceView = () => (
    <div>
      <div className="main-header">
        <h1 className="page-title">My Attendance</h1>
      </div>
      
      <div style={{ padding: '32px' }}>
        <div className="grid grid-cols-3" style={{ marginBottom: '32px' }}>
          <div className="stat-card">
            <div className="stat-icon success">
              <Calendar size={24} />
            </div>
            <div className="stat-number">{attendance.filter(day => day.status === 'present').length}</div>
            <div className="stat-label">Present Days</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon error">
              <Calendar size={24} />
            </div>
            <div className="stat-number">{attendance.filter(day => day.status === 'absent').length}</div>
            <div className="stat-label">Absent Days</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon warning">
              <Calendar size={24} />
            </div>
            <div className="stat-number">{calculateAttendancePercentage()}%</div>
            <div className="stat-label">Attendance Rate</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.slice(0, 20).map((day: any, index) => (
                    <tr key={index}>
                      <td>{new Date(day.date).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${
                          day.status === 'present' ? 'success' : 
                          day.status === 'absent' ? 'error' : 'warning'
                        }`}>
                          {day.status.charAt(0).toUpperCase() + day.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar userRole="student" />
      <div className="main-layout">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/grades" element={<GradesView />} />
          <Route path="/attendance" element={<AttendanceView />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;