import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import MobileFooter from './MobileFooter';

import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: 'LayoutDashboard',
    },
    {
      label: 'Menu',
      path: '/menu',
      icon: 'Grid', // Using Grid for Menu
    },
    {
      label: 'AI Assistant',
      path: '/ai-assistant',
      icon: 'Bot', // or BrainCircuit if available
    },
    {
      label: 'Sessions',
      path: '/study-planner',
      icon: 'Clock', // Or 'Timer'
    },
    {
      label: 'Calendar',
      path: '/calendar', // We might need to route this to StudyPlanner tab 'calendar'
      icon: 'Calendar',
    },
    {
      label: 'Task',
      path: '/todo-list',
      icon: 'CheckSquare',
    },
    {
      label: 'Prediction',
      path: '/grade-predictor', // Mapping "Courses" to Grade Predictor as it deals with courses/grades
      icon: 'BookOpen',
    },
    {
      label: 'Data Room',
      path: '/data-room', // Mapping "Data Room" to Analysis tools
      icon: 'Database', // or BarChart3
    },
    {
      label: 'Achievements',
      path: '/achievements', // Placeholder
      icon: 'Trophy',
    },
    {
      label: 'Settings',
      path: '/student-profile-settings',
      icon: 'Settings',
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isActiveRoute = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const NavItem = ({ item }) => {
    const isActive = isActiveRoute(item.path);

    return (
      <button
        onClick={() => handleNavigation(item.path)}
        className={`
          w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 group
          ${isActive
            ? 'text-white bg-primary/20 border-r-2 border-primary'
            : 'text-zinc-400 hover:text-white hover:bg-white/5'}
          ${isCollapsed ? 'justify-center px-2' : ''}
        `}
      >
        <Icon
          name={item.icon}
          size={20}
          className={`flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-zinc-400 group-hover:text-white'}`}
        />
        {!isCollapsed && (
          <span className="font-medium text-sm">
            {item.label}
          </span>
        )}
      </button>
    );
  };

  const Logo = () => (
    <div className={`p-6 border-b border-white/5 flex items-center gap-3 ${isCollapsed ? 'justify-center px-2' : ''}`}>
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
        <span className="font-bold text-white">S</span>
      </div>
      {!isCollapsed && (
        <span className="font-bold text-lg text-white tracking-wide">StudyMate</span>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-[140] lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Header Toggle */}
      <div className="fixed top-0 left-0 h-16 z-[160] lg:hidden flex items-center px-4 gap-3">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg bg-zinc-900 border border-white/10 text-white"
        >
          <Icon name="Menu" size={24} />
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`
        fixed left-0 top-0 h-full bg-[#09090b] border-r border-white/5 z-[150] transition-all duration-300
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          <Logo />

          <nav className="flex-1 overflow-y-auto py-6 space-y-1 custom-scrollbar">
            {navigationItems.map((item) => (
              <NavItem key={item.path} item={item} />
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className={`p-4 border-t border-white/5 space-y-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>

            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-4 py-2 text-zinc-500 hover:text-red-500 hover:bg-white/5 transition-colors w-full rounded-md ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon name="LogOut" size={20} />
              {!isCollapsed && <span className="font-medium text-sm">Log Out</span>}
            </button>

            {!isCollapsed ? (
              <button
                onClick={onToggle}
                className="flex items-center gap-3 px-4 py-2 text-zinc-500 hover:text-white transition-colors w-full"
              >
                <Icon name="ChevronLeft" size={18} />
                <span className="text-sm">Collapse</span>
              </button>
            ) : (
              <button
                onClick={onToggle}
                className="p-2 text-zinc-500 hover:text-white"
              >
                <Icon name="ChevronRight" size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;