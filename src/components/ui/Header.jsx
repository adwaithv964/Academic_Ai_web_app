import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../services/db';
import Icon from '../AppIcon';
import Button from './Button';

const Header = ({ sidebarCollapsed = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const userProfile = useLiveQuery(() => db.userProfile.get(1));
  const displayName = userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'Student User';
  const displayEmail = userProfile?.email || 'student@university.edu';

  const primaryNavItems = [
    {
      label: 'Grade Predictor',
      path: '/grade-predictor',
      icon: 'TrendingUp'
    },
    {
      label: 'What-If Analysis',
      path: '/what-if-analysis',
      icon: 'Calculator'
    },
    {
      label: 'Progress Tracker',
      path: '/progress-tracker',
      icon: 'BarChart3'
    },
    {
      label: 'Study Planner',
      path: '/study-planner',
      icon: 'Calendar'
    }
  ];

  const secondaryNavItems = [
    {
      label: 'Profile Settings',
      path: '/student-profile-settings',
      icon: 'Settings'
    },
    {
      label: 'User Management',
      path: '/user-management',
      icon: 'Users',
      adminOnly: true
    }
  ];

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Grade Update Available',
      message: 'Your Mathematics grade has been updated',
      time: '2 hours ago',
      unread: true
    },
    {
      id: 2,
      title: 'Study Session Reminder',
      message: 'Physics study session starts in 30 minutes',
      time: '30 minutes ago',
      unread: true
    },
    {
      id: 3,
      title: 'Assignment Due Soon',
      message: 'Chemistry lab report due tomorrow',
      time: '1 day ago',
      unread: false
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const getPageTitle = () => {
    const currentPath = location?.pathname;
    const allItems = [...primaryNavItems, ...secondaryNavItems];
    const currentItem = allItems?.find(item => item?.path === currentPath);
    return currentItem?.label || 'Dashboard';
  };

  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  return (
    <header className={`
      fixed top-0 right-0 h-16 z-100 transition-academic-slow
      bg-card border-b border-border
      ${sidebarCollapsed ? 'left-0 lg:left-16' : 'left-0 lg:left-72'}
    `}>
      <div className="flex items-center justify-end lg:justify-between h-full px-4 lg:px-6">
        {/* Left Section - Page Title and Breadcrumb */}
        <div className="hidden lg:flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">{getPageTitle()}</h1>
            <p className="text-sm text-muted-foreground">Academic Result Predictor</p>
          </div>
        </div>

        {/* Center Section - Primary Navigation (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1">
          {primaryNavItems?.map((item) => {
            const isActive = isActiveRoute(item?.path);
            return (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-academic
                  hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20
                  ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}
                `}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section - Actions and Profile */}
        <div className="flex items-center gap-3">
          {/* Quick Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              iconName="Plus"
              onClick={() => navigate('/study-planner')}
            >
              New Session
            </Button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-academic focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-error-foreground text-xs font-medium rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className={`
                fixed top-16 left-4 right-4 md:absolute md:top-12 md:right-0 md:left-auto md:w-80
                bg-popover border border-border rounded-lg academic-shadow-lg z-300
              `}>
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification?.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`
                          p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-academic cursor-pointer
                          ${notification?.unread ? 'bg-primary/5' : ''}
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification?.unread ? 'bg-primary' : 'bg-muted'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm">{notification?.title}</p>
                            <p className="text-muted-foreground text-sm mt-1">{notification?.message}</p>
                            <p className="text-muted-foreground text-xs mt-2">{notification?.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-border">
                  <Button variant="ghost" size="sm" fullWidth onClick={() => setIsNotificationsOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-lg transition-academic focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-primary-foreground" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">{displayEmail}</p>
              </div>
              <Icon name="ChevronDown" size={16} className="text-muted-foreground" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 top-12 w-56 bg-popover border border-border rounded-lg academic-shadow-lg z-300">
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-foreground">{displayName}</p>
                  <p className="text-sm text-muted-foreground">{displayEmail}</p>
                </div>
                <div className="py-2">
                  {secondaryNavItems?.map((item) => (
                    <button
                      key={item?.path}
                      onClick={() => {
                        handleNavigation(item?.path);
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-foreground hover:bg-muted/50 transition-academic"
                    >
                      <Icon name={item?.icon} size={16} className="text-muted-foreground" />
                      {item?.label}
                    </button>
                  ))}
                  <hr className="my-2 border-border" />
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-foreground hover:bg-muted/50 transition-academic">
                    <Icon name="HelpCircle" size={16} className="text-muted-foreground" />
                    Help & Support
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-error hover:bg-muted/50 transition-academic">
                    <Icon name="LogOut" size={16} className="text-error" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Click outside handlers */}
      {(isProfileOpen || isNotificationsOpen) && (
        <div
          className="fixed inset-0 z-200"
          onClick={() => {
            setIsProfileOpen(false);
            setIsNotificationsOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;