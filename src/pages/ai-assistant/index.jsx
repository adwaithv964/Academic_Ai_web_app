import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import AIChat from '../../components/AIChat';
import AIImageAnalyzer from '../../components/AIImageAnalyzer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { useAI } from '../../hooks/useAI';
import { health as apiHealth } from '../../services/api';

/**
 * AI Assistant Page
 * Comprehensive AI-powered academic assistance hub
 */
const AIAssistant = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedSubject, setSelectedSubject] = useState('general');

  const { loading, error } = useAI();
  const [serverAIReady, setServerAIReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const h = await apiHealth();
        if (mounted) setServerAIReady(Boolean(h?.aiReady));
      } catch {
        if (mounted) setServerAIReady(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const tabs = [
    { id: 'chat', label: 'AI Tutor Chat', icon: 'MessageCircle', description: 'Interactive AI tutoring' },
    { id: 'analyzer', label: 'Document Analyzer', icon: 'FileImage', description: 'Analyze academic documents' },
    { id: 'recommendations', label: 'Study Recommendations', icon: 'BookOpen', description: 'Personalized study plans' }
  ];

  const subjects = [
    { value: 'general', label: 'General Academic', icon: 'GraduationCap' },
    { value: 'mathematics', label: 'Mathematics', icon: 'Calculator' },
    { value: 'science', label: 'Science', icon: 'Atom' },
    { value: 'english', label: 'English', icon: 'BookOpen' },
    { value: 'history', label: 'History', icon: 'Clock' },
    { value: 'computer-science', label: 'Computer Science', icon: 'Monitor' }
  ];

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleAnalysisComplete = (result) => {
    console.log('Analysis completed:', result);
    // You could add logic here to store results, show notifications, etc.
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
      <Header sidebarCollapsed={sidebarCollapsed} />
      <main className={`
        transition-academic-slow pt-16 pb-8
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon name="Bot" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">AI Assistant</h1>
                <p className="text-muted-foreground">
                  {serverAIReady ? 'Gemini-powered academic assistance' : 'AI features in demo mode (start backend and set GEMINI_API_KEY)'}
                </p>
              </div>
            </div>

            {/* Backend AI Status */}
            {!serverAIReady && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Icon name="AlertTriangle" size={20} className="text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-amber-800 mb-1">Demo Mode Active</h4>
                    <p className="text-sm text-amber-700">Start the backend server and set GEMINI_API_KEY in .env to unlock full AI capabilities (chat and image analysis).</p>
                  </div>
                </div>
              </div>
            )}

            {/* Feature Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="MessageCircle" size={16} className="text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">Chat Sessions</span>
                </div>
                <p className="text-2xl font-bold text-foreground">12</p>
              </div>

              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="FileImage" size={16} className="text-success" />
                  <span className="text-sm font-medium text-muted-foreground">Documents Analyzed</span>
                </div>
                <p className="text-2xl font-bold text-foreground">8</p>
              </div>

              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="BookOpen" size={16} className="text-accent" />
                  <span className="text-sm font-medium text-muted-foreground">Study Plans</span>
                </div>
                <p className="text-2xl font-bold text-foreground">5</p>
              </div>

              <div className="bg-card rounded-lg border border-border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="TrendingUp" size={16} className="text-warning" />
                  <span className="text-sm font-medium text-muted-foreground">Avg. Improvement</span>
                </div>
                <p className="text-2xl font-bold text-foreground">15%</p>
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs?.map((tab) => (
                <Button
                  key={tab?.id}
                  variant={activeTab === tab?.id ? 'default' : 'outline'}
                  onClick={() => setActiveTab(tab?.id)}
                  iconName={tab?.icon}
                  iconPosition="left"
                  className="flex-shrink-0"
                >
                  {tab?.label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Subject Selection (for Chat tab) */}
          {activeTab === 'chat' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <h3 className="text-lg font-medium text-foreground mb-4">Select Subject</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {subjects?.map((subject) => (
                  <Button
                    key={subject?.value}
                    variant={selectedSubject === subject?.value ? 'default' : 'outline'}
                    onClick={() => setSelectedSubject(subject?.value)}
                    iconName={subject?.icon}
                    iconPosition="top"
                    className="h-auto py-3 flex-col gap-2"
                    fullWidth
                  >
                    <span className="text-xs">{subject?.label}</span>
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card rounded-lg border border-border"
          >
            {activeTab === 'chat' && (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Icon name="MessageCircle" size={20} className="text-primary" />
                  <h3 className="text-lg font-medium text-foreground">AI Tutor Chat</h3>
                  <div className="px-2 py-1 bg-primary/10 rounded text-xs text-primary capitalize">
                    {subjects?.find(s => s?.value === selectedSubject)?.label}
                  </div>
                </div>

                <div className="relative h-[600px] bg-muted/20 rounded-lg">
                  <AIChat
                    subject={selectedSubject}
                    isOpen={true}
                    onClose={() => { }}
                    className="relative inset-0 w-full h-full"
                  />
                </div>
              </div>
            )}

            {activeTab === 'analyzer' && (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Icon name="FileImage" size={20} className="text-primary" />
                  <h3 className="text-lg font-medium text-foreground">Document Analyzer</h3>
                </div>

                <AIImageAnalyzer
                  onAnalysisComplete={handleAnalysisComplete}
                  className="max-w-4xl mx-auto"
                />
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Icon name="BookOpen" size={20} className="text-primary" />
                  <h3 className="text-lg font-medium text-foreground">Study Recommendations</h3>
                </div>

                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Construction" size={24} className="text-primary" />
                  </div>
                  <h4 className="text-lg font-medium text-foreground mb-2">Coming Soon</h4>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Personalized study recommendations based on your academic profile and learning patterns.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
            >
              <div className="flex items-start gap-3">
                <Icon name="AlertCircle" size={20} className="text-destructive mt-0.5" />
                <div>
                  <h4 className="font-medium text-destructive mb-1">AI Service Error</h4>
                  <p className="text-sm text-destructive/80">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 bg-card rounded-lg border border-border p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="outline"
                iconName="TrendingUp"
                iconPosition="left"
                fullWidth
              >
                Grade Predictor
              </Button>

              <Button
                variant="outline"
                iconName="BarChart3"
                iconPosition="left"
                fullWidth
              >
                Progress Tracker
              </Button>

              <Button
                variant="outline"
                iconName="Calculator"
                iconPosition="left"
                fullWidth
              >
                What-If Analysis
              </Button>

              <Button
                variant="outline"
                iconName="Calendar"
                iconPosition="left"
                fullWidth
              >
                Study Planner
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AIAssistant;