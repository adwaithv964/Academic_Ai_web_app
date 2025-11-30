import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import Sidebar from '../../components/ui/Sidebar';
import ProfileTab from './components/ProfileTab';
import AcademicSettingsTab from './components/AcademicSettingsTab';
import PreferencesTab from './components/PreferencesTab';
import SecurityTab from './components/SecurityTab';
import DataExportTab from './components/DataExportTab';

const StudentProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: 'User',
      component: ProfileTab,
      description: 'Personal information and academic details'
    },
    {
      id: 'academic',
      label: 'Academic Settings',
      icon: 'GraduationCap',
      component: AcademicSettingsTab,
      description: 'GPA configuration and academic preferences'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: 'Settings',
      component: PreferencesTab,
      description: 'Notifications and display preferences'
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Shield',
      component: SecurityTab,
      description: 'Password and security settings'
    },
    {
      id: 'data',
      label: 'Data & Privacy',
      icon: 'Download',
      component: DataExportTab,
      description: 'Export data and account management'
    }
  ];

  const ActiveComponent = tabs?.find(tab => tab?.id === activeTab)?.component || ProfileTab;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      {/* Mobile Header */}
      <div className="lg:hidden bg-card border-b border-border p-4 relative z-50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Profile Settings</h1>
            <p className="text-sm text-muted-foreground">
              {tabs?.find(tab => tab?.id === activeTab)?.description}
            </p>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-muted/50 rounded-lg transition-academic"
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} className="text-foreground" />
          </button>
        </div>

        {/* Mobile Tab Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => handleTabChange(tab?.id)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-lg text-left transition-academic
                  ${activeTab === tab?.id
                    ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-muted/50 text-foreground'
                  }
                `}
              >
                <Icon name={tab?.icon} size={20} />
                <div>
                  <p className="font-medium">{tab?.label}</p>
                  <p className="text-xs text-muted-foreground">{tab?.description}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </div>
      <div className="flex lg:ml-72 pb-20 lg:pb-0">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 bg-card border-r border-border min-h-screen">
          <div className="p-6 border-b border-border">
            <h1 className="text-2xl font-semibold text-foreground">Profile Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your account and preferences
            </p>
          </div>

          <nav className="p-4">
            <div className="space-y-2">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => handleTabChange(tab?.id)}
                  className={`
                    w-full flex items-center gap-3 p-4 rounded-lg text-left transition-academic
                    ${activeTab === tab?.id
                      ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-muted/50 text-foreground'
                    }
                  `}
                >
                  <Icon name={tab?.icon} size={20} />
                  <div>
                    <p className="font-medium">{tab?.label}</p>
                    <p className="text-xs text-muted-foreground">{tab?.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </nav>

          {/* User Info Card */}
          <div className="p-4 border-t border-border mt-auto">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="User" size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium text-foreground">John Smith</p>
                  <p className="text-sm text-muted-foreground">STU2024001</p>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Computer Science • Class of 2026</p>
                <p>Current GPA: 3.7 / 4.0</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ActiveComponent />
            </motion.div>
          </div>
        </main>
      </div>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default StudentProfileSettings;