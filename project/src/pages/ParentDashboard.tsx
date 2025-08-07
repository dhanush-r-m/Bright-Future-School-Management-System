import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Users, BookOpen, Calendar, Award } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchParentData();
  }, []);

  const fetchParentData = async () => {
    try {
      const [profileRes, childrenRes] = await Promise.all([
        axios.get('/api/parent/profile'),
        axios.get('/api/parent/children')
      ]);
      
      setProfile(profileRes.data);
      setChildren(childrenRes.data);
    } catch (error) {
      console.error('Failed to fetch parent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const DashboardHome = () => (
    <div>
      <div className="main-header">
        <h1 className="page-title">Parent Dashboard</h1>
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
            <div className="stat-number">{children.length}</div>
            <div className="stat-label">My Children</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon secondary">
              <BookOpen size={24} />
            </div>
            <div className="stat-number">{children.reduce((sum, child) => sum + (child.subjects?.length || 0), 0)}</div>
            <div className="stat-label">Total Subjects</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon accent">
              <Calendar size={24} />
            </div>
            <div className="stat-number">
              {children.length > 0 ? Math.round(
                children.reduce((sum, child) => {
                  const presentDays = child.attendance?.filter(day => day.status === 'present').length || 0;
                  const totalDays = child.attendance?.length || 1;
                  return sum + (presentDays / totalDays);
                }, 0) / children.length * 100
              ) : 0}%
            </div>
            <div className="stat-label">Avg Attendance</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon success">
              <Award size={24} />
            </div>
            <div className="stat-number">
              {children.length > 0 ? (
                children.reduce((sum, child) => {
                  const grades = child.grades || [];
                  const avgGrade = grades.length > 0 ? 
                    grades.reduce((gSum, grade) => gSum + (grade.marks / grade.totalMarks), 0) / grades.length * 100 : 0;
                  return sum + avgGrade;
                }, 0) / children.length
              ).toFixed(0) : 0}%
            </div>
            <div className="stat-label">Avg Performance</div>
          </div>
        </div>

        {/* Children Overview */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">My Children</h2>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center">
                <div className="spinner"></div>
              </div>
            ) : children.length > 0 ? (
              <div className="grid grid-cols-2">
                {children.map((child: any) => (
                  <div key={child._id} className="card" style={{ margin: '8px' }}>
                    <div className="card-body">
                      <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
                        {child.userId?.name}
                      </h3>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Class:</strong> {child.class} - {child.section}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Roll No:</strong> {child.rollNumber}
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>Student ID:</strong> {child.studentId}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                        <button className="btn btn-sm btn-primary">View Details</button>
                        <button className="btn btn-sm btn-outline">Contact Teacher</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center" style={{ padding: '40px' }}>
                <p style={{ color: 'var(--neutral-600)' }}>No children registered yet.</p>
                <button className="btn btn-primary" style={{ marginTop: '16px' }}>
                  Register Child
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const ChildrenView = () => (
    <div>
      <div className="main-header">
        <h1 className="page-title">My Children</h1>
        <button className="btn btn-primary">Register Child</button>
      </div>
      
      <div style={{ padding: '32px' }}>
        {children.map((child: any) => (
          <div key={child._id} className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <h3 className="card-title">{child.userId?.name}</h3>
              <div>
                <span className="badge primary">{child.class} - {child.section}</span>
              </div>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-3">
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Basic Info</h4>
                  <p><strong>Student ID:</strong> {child.studentId}</p>
                  <p><strong>Roll Number:</strong> {child.rollNumber}</p>
                  <p><strong>Class:</strong> {child.class} - {child.section}</p>
                </div>
                
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Recent Grades</h4>
                  {child.grades?.slice(0, 3).map((grade: any, index: number) => (
                    <p key={index}>
                      <strong>{grade.subject}:</strong> {grade.marks}/{grade.totalMarks}
                    </p>
                  )) || <p>No grades available</p>}
                </div>
                
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Attendance</h4>
                  <p>
                    <strong>Present:</strong> {child.attendance?.filter(day => day.status === 'present').length || 0}
                  </p>
                  <p>
                    <strong>Absent:</strong> {child.attendance?.filter(day => day.status === 'absent').length || 0}
                  </p>
                  <p>
                    <strong>Rate:</strong> {
                      child.attendance?.length > 0 ? 
                      Math.round((child.attendance.filter(day => day.status === 'present').length / child.attendance.length) * 100) : 0
                    }%
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {children.length === 0 && (
          <div className="card">
            <div className="card-body text-center" style={{ padding: '60px' }}>
              <h3 style={{ marginBottom: '16px', color: 'var(--neutral-600)' }}>No Children Registered</h3>
              <p style={{ marginBottom: '24px', color: 'var(--neutral-500)' }}>
                Register your children to start monitoring their academic progress.
              </p>
              <button className="btn btn-primary">Register Child</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar userRole="parent" />
      <div className="main-layout">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="/children" element={<ChildrenView />} />
        </Routes>
      </div>
    </div>
  );
};

export default ParentDashboard;