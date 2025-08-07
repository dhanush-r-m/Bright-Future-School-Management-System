import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, Award, ArrowRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: 'Multi-Role Access',
      description: 'Separate portals for administrators, teachers, students, and parents with role-based permissions.'
    },
    {
      icon: BookOpen,
      title: 'Academic Management',
      description: 'Complete grade tracking, attendance monitoring, and academic progress reporting.'
    },
    {
      icon: Award,
      title: 'Performance Analytics',
      description: 'Detailed analytics and insights into student performance and school operations.'
    }
  ];

  return (
    <div className="page-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <Link to="/" className="navbar-brand">
              <GraduationCap size={32} style={{ marginRight: '12px' }} />
              SchoolMS
            </Link>
            <div className="navbar-nav">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <div className="container text-center">
          <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '24px', lineHeight: '1.2' }}>
            Modern School Management System
          </h1>
          <p style={{ fontSize: '20px', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Streamline your educational institution with our comprehensive management platform. 
            Separate portals for every role, integrated into one powerful system.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-lg" style={{ backgroundColor: 'white', color: '#667eea' }}>
              Start Free Trial
              <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn btn-lg btn-outline" style={{ borderColor: 'white', color: 'white' }}>
              Login to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '16px', color: 'var(--neutral-800)' }}>
              Everything You Need
            </h2>
            <p style={{ fontSize: '18px', color: 'var(--neutral-600)', maxWidth: '600px', margin: '0 auto' }}>
              A complete solution for managing your educational institution with dedicated portals for every user type.
            </p>
          </div>
          
          <div className="grid grid-cols-3" style={{ marginBottom: '60px' }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
                  <div className="stat-icon primary" style={{ margin: '0 auto 24px', width: '64px', height: '64px' }}>
                    <Icon size={32} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: 'var(--neutral-800)' }}>
                    {feature.title}
                  </h3>
                  <p style={{ color: 'var(--neutral-600)', lineHeight: '1.6' }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Portal Cards */}
          <div className="grid grid-cols-4">
            <div className="card">
              <div className="card-body text-center">
                <div className="stat-icon primary" style={{ margin: '0 auto 16px' }}>
                  <Users size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Admin Portal</h3>
                <p style={{ color: 'var(--neutral-600)', fontSize: '14px', marginBottom: '16px' }}>
                  Complete system oversight and management
                </p>
                <Link to="/register" className="btn btn-sm btn-primary">Access Portal</Link>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body text-center">
                <div className="stat-icon secondary" style={{ margin: '0 auto 16px' }}>
                  <BookOpen size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Teacher Portal</h3>
                <p style={{ color: 'var(--neutral-600)', fontSize: '14px', marginBottom: '16px' }}>
                  Manage classes, grades, and student progress
                </p>
                <Link to="/register" className="btn btn-sm btn-secondary">Access Portal</Link>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body text-center">
                <div className="stat-icon accent" style={{ margin: '0 auto 16px' }}>
                  <GraduationCap size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Student Portal</h3>
                <p style={{ color: 'var(--neutral-600)', fontSize: '14px', marginBottom: '16px' }}>
                  View grades, attendance, and assignments
                </p>
                <Link to="/register" className="btn btn-sm" style={{ backgroundColor: 'var(--accent-color)', color: 'white' }}>Access Portal</Link>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body text-center">
                <div className="stat-icon success" style={{ margin: '0 auto 16px' }}>
                  <Award size={24} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Parent Portal</h3>
                <p style={{ color: 'var(--neutral-600)', fontSize: '14px', marginBottom: '16px' }}>
                  Monitor child's progress and school updates
                </p>
                <Link to="/register" className="btn btn-sm" style={{ backgroundColor: 'var(--success-color)', color: 'white' }}>Access Portal</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'var(--neutral-800)', color: 'white', padding: '40px 0' }}>
        <div className="container text-center">
          <div className="navbar-brand" style={{ color: 'white', marginBottom: '16px' }}>
            <GraduationCap size={28} style={{ marginRight: '12px' }} />
            SchoolMS
          </div>
          <p style={{ color: 'var(--neutral-400)' }}>
            © 2025 SchoolMS. All rights reserved. Built for modern educational institutions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;