import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import MobileFooter from './MobileFooter';

const Sidebar = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/',
      icon: 'LayoutDashboard',
      description: 'Overview and key metrics'
    },
    {
      label: 'Academic Tools',
      path: '/academic-tools',
      icon: 'GraduationCap',
      children: [
        {
          label: 'Grade Predictor',
          path: '/grade-predictor',
          icon: 'TrendingUp',
          description: 'Predict future grades based on current performance'
        },
        {
          label: 'What-If Analysis',
          path: '/what-if-analysis',
          icon: 'Calculator',
          description: 'Explore different academic scenarios'
        },
        {
          label: 'Progress Tracker',
          path: '/progress-tracker',
          icon: 'BarChart3',
          description: 'Monitor academic progress over time'
        },
        {
          label: 'To-Do List',
          path: '/todo-list',
          icon: 'CheckSquare',
          description: 'Manage academic tasks and goals'
        }
      ]
    },
    {
      label: 'AI Assistant',
      path: '/ai-assistant',
      icon: 'Bot',
      description: 'Get help from your AI tutor'
    },
    {
      label: 'Settings',
      path: '/student-profile-settings',
      icon: 'Settings',
      description: 'Manage account and preferences'
    },
    {
      label: 'Study Planner',
      path: '/study-planner',
      icon: 'Calendar',
      description: 'Plan and organize study sessions'
    },
    {
      label: 'User Management',
      path: '/user-management',
      icon: 'Users',
      description: 'Administrative user controls',
      adminOnly: true
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const isParentActive = (children) => {
    return children?.some(child => isActiveRoute(child?.path));
  };

  const NavItem = ({ item, isChild = false }) => {
    const [isExpanded, setIsExpanded] = useState(isParentActive(item?.children));
    const hasChildren = item?.children && item?.children?.length > 0;
    const isActive = isActiveRoute(item?.path);
    const isParentActiveState = isParentActive(item?.children);

    const handleClick = () => {
      if (hasChildren) {
        setIsExpanded(!isExpanded);
      } else if (item?.path) {
        handleNavigation(item?.path);
      }
    };

    return (
      <div className="w-full">
        <button
          onClick={handleClick}
          className={`
            w-full flex items-center justify-between px-4 py-3 text-left transition-academic
            hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20
            ${isActive || isParentActiveState ? 'bg-primary/10 text-primary border-r-2 border-primary' : 'text-foreground'}
            ${isChild ? 'pl-12 py-2' : ''}
            ${isCollapsed ? 'justify-center px-2' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            <Icon
              name={item?.icon}
              size={20}
              className={`flex-shrink-0 ${isActive || isParentActiveState ? 'text-primary' : 'text-muted-foreground'}`}
            />
            {!isCollapsed && (
              <span className={`font-medium ${isChild ? 'text-sm' : ''}`}>
                {item?.label}
              </span>
            )}
          </div>
          {!isCollapsed && hasChildren && (
            <Icon
              name={isExpanded ? 'ChevronDown' : 'ChevronRight'}
              size={16}
              className="text-muted-foreground transition-academic"
            />
          )}
        </button>
        {!isCollapsed && hasChildren && isExpanded && (
          <div className="bg-muted/20">
            {item?.children?.map((child) => (
              <NavItem key={child?.path} item={child} isChild={true} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const UserProfile = () => (
    <div className={`p-4 border-t border-border ${isCollapsed ? 'px-2' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <Icon name="User" size={16} className="text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Student User</p>
            <p className="text-xs text-muted-foreground truncate">student@university.edu</p>
          </div>
        )}
      </div>
    </div>
  );

  const Logo = () => (
    <div className={`p-4 border-b border-border ${isCollapsed ? 'px-2' : ''}`}>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon name="GraduationCap" size={20} className="text-primary-foreground" />
        </div>
        {!isCollapsed && (
          <div>
            <h1 className="text-lg font-semibold text-foreground">StudyMate</h1>
            <p className="text-xs text-muted-foreground">Academic Result Predictor</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[140] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      {/* Mobile Toggle Button */}
      {/* Mobile Header Branding & Toggle */}
      <div className="fixed top-0 left-0 h-16 z-[160] lg:hidden flex items-center px-4 gap-3">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg hover:bg-muted/50 transition-academic"
        >
          <Icon name="Menu" size={24} className="text-foreground" />
        </button>
        {!isMobileOpen && <span className="text-xl font-bold text-primary">StudyMate</span>}
      </div>
      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-full bg-card border-r border-border z-[150] transition-academic-slow
        ${isCollapsed ? 'w-16' : 'w-72'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <Logo />

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1">
              {navigationItems?.map((item) => (
                <NavItem key={item?.path || item?.label} item={item} />
              ))}
            </div>
          </nav>

          {/* User Profile */}
          <UserProfile />
        </div>

        {/* Collapse Toggle - Desktop Only */}
        {!isCollapsed && (
          <button
            onClick={onToggle}
            className="absolute -right-3 top-20 hidden lg:flex items-center justify-center w-6 h-6 bg-card border border-border rounded-full academic-shadow hover:bg-muted transition-academic"
          >
            <Icon name="ChevronLeft" size={14} className="text-muted-foreground" />
          </button>
        )}
      </aside>
      {/* Mobile Bottom Navigation */}
      <MobileFooter navigationItems={navigationItems} />
    </>
  );
};

export default Sidebar;