import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      // Navigation will be handled by checking user role
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      navigate(`/${user.role}`);
    } catch (error) {
      // Error is handled by context
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--neutral-50)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', margin: '20px' }}>
        <div className="card-body" style={{ padding: '40px' }}>
          <div className="text-center" style={{ marginBottom: '32px' }}>
            <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <GraduationCap size={32} />
              SchoolMS
            </Link>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: 'var(--neutral-800)' }}>
              Welcome Back
            </h1>
            <p style={{ color: 'var(--neutral-600)' }}>
              Sign in to access your portal
            </p>
          </div>

          {error && (
            <div className="alert error" style={{ marginBottom: '24px' }}>
              <AlertCircle size={16} style={{ marginRight: '8px' }} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
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

            <div className="form-group">
              <label className="form-label">
                <Lock size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                Password
              </label>
              <input
                type="password"
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
              style={{ marginBottom: '24px' }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }} />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center">
              <p style={{ color: 'var(--neutral-600)' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;