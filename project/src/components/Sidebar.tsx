import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  GraduationCap, 
  UserCheck, 
  BookOpen, 
  Calendar,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  userRole: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const getNavigationItems = () => {
    const basePath = `/${userRole}`;
    
    switch (userRole) {
      case 'admin':
        return [
          { path: `${basePath}`, label: 'Dashboard', icon: Home },
          { path: `${basePath}/students`, label: 'Students', icon: GraduationCap },
          { path: `${basePath}/teachers`, label: 'Teachers', icon: UserCheck },
          { path: `${basePath}/parents`, label: 'Parents', icon: Users },
          { path: `${basePath}/settings`, label: 'Settings', icon: Settings },
        ];
      case 'teacher':
        return [
          { path: `${basePath}`, label: 'Dashboard', icon: Home },
          { path: `${basePath}/students`, label: 'My Students', icon: GraduationCap },
          { path: `${basePath}/classes`, label: 'Classes', icon: BookOpen },
          { path: `${basePath}/schedule`, label: 'Schedule', icon: Calendar },
          { path: `${basePath}/profile`, label: 'Profile', icon: Settings },
        ];
      case 'student':
        return [
          { path: `${basePath}`, label: 'Dashboard', icon: Home },
          { path: `${basePath}/grades`, label: 'Grades', icon: BookOpen },
          { path: `${basePath}/attendance`, label: 'Attendance', icon: Calendar },
          { path: `${basePath}/profile`, label: 'Profile', icon: Settings },
        ];
      case 'parent':
        return [
          { path: `${basePath}`, label: 'Dashboard', icon: Home },
          { path: `${basePath}/children`, label: 'Children', icon: GraduationCap },
          { path: `${basePath}/messages`, label: 'Messages', icon: BookOpen },
          { path: `${basePath}/profile`, label: 'Profile', icon: Settings },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-brand">
          <GraduationCap size={24} />
          SchoolMS
        </Link>
      </div>
      <nav className="sidebar-nav">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="sidebar-nav-item"
          style={{ 
            width: '100%', 
            background: 'none', 
            border: 'none', 
            textAlign: 'left',
            cursor: 'pointer'
          }}
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;