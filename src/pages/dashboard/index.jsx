import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import AIChat from '../../components/AIChat';

const Dashboard = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showAIChat, setShowAIChat] = useState(false);
    const navigate = useNavigate();

    const handleSidebarToggle = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="min-h-screen bg-background">
            <Sidebar isCollapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />
            <Header sidebarCollapsed={sidebarCollapsed} />
            <main className={`
        transition-academic-slow pt-16 pb-20 lg:pb-8
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
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                    <Icon name="LayoutDashboard" size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                                    <p className="text-muted-foreground">
                                        Welcome back! Here's your academic overview.
                                    </p>
                                </div>
                            </div>

                            {/* AI Chat Toggle */}
                            <Button
                                onClick={() => setShowAIChat(!showAIChat)}
                                iconName="MessageCircle"
                                variant="outline"
                                className="relative"
                            >
                                AI Tutor
                            </Button>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-card rounded-lg border border-border p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon name="BookOpen" size={16} className="text-primary" />
                                    <span className="text-sm font-medium text-muted-foreground">Active Courses</span>
                                </div>
                                <p className="text-2xl font-bold text-foreground">6</p>
                            </div>

                            <div className="bg-card rounded-lg border border-border p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon name="Target" size={16} className="text-success" />
                                    <span className="text-sm font-medium text-muted-foreground">Predictions Made</span>
                                </div>
                                <p className="text-2xl font-bold text-foreground">23</p>
                            </div>

                            <div className="bg-card rounded-lg border border-border p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon name="TrendingUp" size={16} className="text-accent" />
                                    <span className="text-sm font-medium text-muted-foreground">Avg Accuracy</span>
                                </div>
                                <p className="text-2xl font-bold text-foreground">87%</p>
                            </div>

                            <div className="bg-card rounded-lg border border-border p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon name="Award" size={16} className="text-warning" />
                                    <span className="text-sm font-medium text-muted-foreground">Current GPA</span>
                                </div>
                                <p className="text-2xl font-bold text-foreground">3.45</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-card rounded-lg border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Button
                                    variant="outline"
                                    iconName="TrendingUp"
                                    iconPosition="left"
                                    fullWidth
                                    onClick={() => navigate('/grade-predictor')}
                                >
                                    Grade Predictor
                                </Button>

                                <Button
                                    variant="outline"
                                    iconName="Calculator"
                                    iconPosition="left"
                                    fullWidth
                                    onClick={() => navigate('/what-if-analysis')}
                                >
                                    What-If Analysis
                                </Button>

                                <Button
                                    variant="outline"
                                    iconName="BarChart3"
                                    iconPosition="left"
                                    fullWidth
                                    onClick={() => navigate('/progress-tracker')}
                                >
                                    Progress Tracker
                                </Button>

                                <Button
                                    variant="outline"
                                    iconName="Calendar"
                                    iconPosition="left"
                                    fullWidth
                                    onClick={() => navigate('/study-planner')}
                                >
                                    Study Planner
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* AI Chat Component */}
            <AIChat
                subject="academic planning"
                isOpen={showAIChat}
                onClose={() => setShowAIChat(false)}
            />
        </div>
    );
};

export default Dashboard;
