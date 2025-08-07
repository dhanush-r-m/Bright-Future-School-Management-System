import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Users, BookOpen, Calendar, Award } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      const [profileRes, studentsRes] = await Promise.all([
        axios.get('/api/teacher/profile'),
        axios.get('/api/teacher/students')
      ]);
      
      setProfile(profileRes.data);
      setStudents(studentsRes.data);
    } catch (error) {
      console.error('Failed to fetch teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  const DashboardHome = () => (
    <div>
      <div className="main-header">
        <h1 className="page-title">Teacher Dashboard</h1>
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
              <Users size={24} />
            </div>
            <div className="stat-number">{students.length}</div>
            <div className="stat-label">My Students</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon secondary">
              <BookOpen size={24} />
            </div>
            <div className="stat-number">{profile?.subjects?.length || 0}</div>
            <div className="stat-label">Subjects</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon accent">
              <Calendar size={24} />
            </div>
            <div className="stat-number">{profile?.classes?.length || 0}</div>
            <div className="stat-label">Classes</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon success">
              <Award size={24} />
            </div>
            <div className="stat-number">{profile?.experience || 0}</div>
            <div className="stat-label">Years Experience</div>
          </div>
        </div>

        {/* Teacher Info and Students */}
        <div className="grid grid-cols-2">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">My Profile</h2>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center">
                  <div className="spinner"></div>
                </div>
              ) : profile ? (
                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Employee ID:</strong> {profile.employeeId}
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Subjects:</strong> {profile.subjects?.join(', ')}
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Qualification:</strong> {profile.qualification}
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Experience:</strong> {profile.experience} years
                  </div>
                  <div>
                    <strong>Joining Date:</strong> {new Date(profile.joiningDate).toLocaleDateString()}
                  </div>
                </div>
              ) : (
                <p>No profile data available</p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">My Students</h2>
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
                        <th>Roll No.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.slice(0, 5).map((student: any) => (
                        <tr key={student._id}>
                          <td>{student.userId?.name}</td>
                          <td>{student.class} - {student.section}</td>
                          <td>{student.rollNumber}</td>
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
        <h1 className="page-title">My Students</h1>
        <button className="btn btn-primary">Add Grade</button>
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
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-sm btn-outline">View</button>
                          <button className="btn btn-sm btn-primary">Grade</button>
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
      <Sidebar userRole="teacher" />
      <div className="main-layout">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/students" element={<StudentsView />} />
        </Routes>
      </div>
    </div>
  );
};

export default TeacherDashboard;