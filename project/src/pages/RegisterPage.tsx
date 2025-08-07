import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, User, Mail, Lock, Phone, MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: '',
    address: '',
    // Student specific
    class: '',
    section: '',
    rollNumber: '',
    dateOfBirth: '',
    // Teacher specific
    subjects: '',
    qualification: '',
    salary: '',
    // Parent specific
    occupation: '',
    relationship: 'father'
  });
  
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [localError, setLocalError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setLocalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        address: formData.address,
      };

      // Add role-specific data
      if (formData.role === 'student') {
        userData.class = formData.class;
        userData.section = formData.section;
        userData.rollNumber = formData.rollNumber;
        userData.dateOfBirth = formData.dateOfBirth;
        userData.subjects = formData.subjects.split(',').map(s => s.trim());
      } else if (formData.role === 'teacher') {
        userData.subjects = formData.subjects.split(',').map(s => s.trim());
        userData.qualification = formData.qualification;
        userData.salary = parseFloat(formData.salary) || 50000;
      } else if (formData.role === 'parent') {
        userData.occupation = formData.occupation;
        userData.relationship = formData.relationship;
      }

      await register(userData);
      navigate(`/${formData.role}`);
    } catch (error) {
      // Error is handled by context
    }
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'student':
        return (
          <>
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Class</label>
                <select
                  name="class"
                  className="form-select"
                  value={formData.class}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Class</option>
                  <option value="1st">1st Grade</option>
                  <option value="2nd">2nd Grade</option>
                  <option value="3rd">3rd Grade</option>
                  <option value="4th">4th Grade</option>
                  <option value="5th">5th Grade</option>
                  <option value="6th">6th Grade</option>
                  <option value="7th">7th Grade</option>
                  <option value="8th">8th Grade</option>
                  <option value="9th">9th Grade</option>
                  <option value="10th">10th Grade</option>
                  <option value="11th">11th Grade</option>
                  <option value="12th">12th Grade</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Section</label>
                <select
                  name="section"
                  className="form-select"
                  value={formData.section}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Section</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Roll Number</label>
                <input
                  type="text"
                  name="rollNumber"
                  className="form-input"
                  placeholder="Enter roll number"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className="form-input"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Subjects (comma separated)</label>
              <input
                type="text"
                name="subjects"
                className="form-input"
                placeholder="e.g., Math, Science, English"
                value={formData.subjects}
                onChange={handleChange}
              />
            </div>
          </>
        );
        
      case 'teacher':
        return (
          <>
            <div className="form-group">
              <label className="form-label">Subjects (comma separated)</label>
              <input
                type="text"
                name="subjects"
                className="form-input"
                placeholder="e.g., Mathematics, Physics, Chemistry"
                value={formData.subjects}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  className="form-input"
                  placeholder="e.g., Master's in Mathematics"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Salary</label>
                <input
                  type="number"
                  name="salary"
                  className="form-input"
                  placeholder="50000"
                  value={formData.salary}
                  onChange={handleChange}
                />
              </div>
            </div>
          </>
        );
        
      case 'parent':
        return (
          <>
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  className="form-input"
                  placeholder="Enter occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Relationship</label>
                <select
                  name="relationship"
                  className="form-select"
                  value={formData.relationship}
                  onChange={handleChange}
                  required
                >
                  <option value="father">Father</option>
                  <option value="mother">Mother</option>
                  <option value="guardian">Guardian</option>
                </select>
              </div>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--neutral-50)', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
        <div className="card-body" style={{ padding: '40px' }}>
          <div className="text-center" style={{ marginBottom: '32px' }}>
            <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <GraduationCap size={32} />
              SchoolMS
            </Link>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: 'var(--neutral-800)' }}>
              Create Account
            </h1>
            <p style={{ color: 'var(--neutral-600)' }}>
              Join our school management system
            </p>
          </div>

          {(error || localError) && (
            <div className="alert error" style={{ marginBottom: '24px' }}>
              <AlertCircle size={16} style={{ marginRight: '8px' }} />
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <User size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Role
              </label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                <User size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                className="form-input"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Mail size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-input"
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-input"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label">
                  <Phone size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MapPin size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            {renderRoleSpecificFields()}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              style={{ marginBottom: '24px' }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            <div className="text-center">
              <p style={{ color: 'var(--neutral-600)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;