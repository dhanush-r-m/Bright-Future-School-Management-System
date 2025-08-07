import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Users, GraduationCap, UserCheck, TrendingUp } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalParents: 0,
    activeUsers: 0
  });
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, studentsRes, teachersRes] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/admin/students'),
        axios.get('/api/admin/teachers')
      ]);
      
      setStats(statsRes.data);
      setStudents(studentsRes.data);
      setTeachers(teachersRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const DashboardHome = () => (
    <div>
      <div className="main-header">
        <h1 className="page-title">Admin Dashboard</h1>
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
              <GraduationCap size={24} />
            </div>
            <div className="stat-number">{stats.totalStudents}</div>
            <div className="stat-label">Total Students</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon secondary">
              <UserCheck size={24} />
            </div>
            <div className="stat-number">{stats.totalTeachers}</div>
            <div className="stat-label">Total Teachers</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon accent">
              <Users size={24} />
            </div>
            <div className="stat-number">{stats.totalParents}</div>
            <div className="stat-label">Total Parents</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon success">
              <TrendingUp size={24} />
            </div>
            <div className="stat-number">{stats.activeUsers}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-2">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Recent Students</h2>
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
                        <th>Name</th>
                        <th>Class</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.slice(0, 5).map((student: any) => (
                        <tr key={student._id}>
                          <td>{student.userId?.name}</td>
                          <td>{student.class} - {student.section}</td>
                          <td>
                            <span className="badge success">Active</span>
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
              <h2 className="card-title">Recent Teachers</h2>
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
                        <th>Name</th>
                        <th>Subjects</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.slice(0, 5).map((teacher: any) => (
                        <tr key={teacher._id}>
                          <td>{teacher.userId?.name}</td>
                          <td>{teacher.subjects?.slice(0, 2).join(', ')}</td>
                          <td>
                            <span className="badge success">Active</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const StudentsView = () => (
    <div>
      <div className="main-header">
        <h1 className="page-title">Students Management</h1>
        <button className="btn btn-primary">Add Student</button>
      </div>
      
      <div style={{ padding: '32px' }}>
        <div className="card">
          <div className="card-body">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Section</th>
                    <th>Roll No.</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student: any) => (
                    <tr key={student._id}>
                      <td>{student.studentId}</td>
                      <td>{student.userId?.name}</td>
                      <td>{student.class}</td>
                      <td>{student.section}</td>
                      <td>{student.rollNumber}</td>
                      <td>{student.userId?.email}</td>
                      <td>
                        <span className="badge success">Active</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-sm btn-outline">View</button>
                          <button className="btn btn-sm btn-primary">Edit</button>
                        </div>
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

  const TeachersView = () => (
    <div>
      <div className="main-header">
        <h1 className="page-title">Teachers Management</h1>
        <button className="btn btn-primary">Add Teacher</button>
      </div>
      
      <div style={{ padding: '32px' }}>
        <div className="card">
          <div className="card-body">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Subjects</th>
                    <th>Qualification</th>
                    <th>Experience</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher: any) => (
                    <tr key={teacher._id}>
                      <td>{teacher.employeeId}</td>
                      <td>{teacher.userId?.name}</td>
                      <td>{teacher.subjects?.join(', ')}</td>
                      <td>{teacher.qualification}</td>
                      <td>{teacher.experience} years</td>
                      <td>{teacher.userId?.email}</td>
                      <td>
                        <span className="badge success">Active</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-sm btn-outline">View</button>
                          <button className="btn btn-sm btn-primary">Edit</button>
                        </div>
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
      <Sidebar userRole="admin" />
      <div className="main-layout">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/students" element={<StudentsView />} />
          <Route path="/teachers" element={<TeachersView />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;