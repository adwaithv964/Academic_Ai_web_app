import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '../../components/ui/Sidebar';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AcademicTools = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const navigate = useNavigate();

    const tools = [
        {
            title: 'Grade Predictor',
            description: 'Forecast your final grades based on current performance, assignments, and exam weights.',
            icon: 'TrendingUp',
            path: '/grade-predictor',
            color: 'text-primary',
            bgColor: 'bg-primary/10'
        },
        {
            title: 'What-If Analysis',
            description: 'Explore different scenarios to see how exam scores and assignments affect your GPA.',
            icon: 'Calculator',
            path: '/what-if-analysis',
            color: 'text-accent',
            bgColor: 'bg-accent/10'
        },
        {
            title: 'Progress Tracker',
            description: 'Monitor your academic growth over time with visual charts and detailed insights.',
            icon: 'BarChart3',
            path: '/progress-tracker',
            color: 'text-success',
            bgColor: 'bg-success/10'
        }
    ];

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
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                                <Icon name="GraduationCap" size={24} className="text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Academic Tools</h1>
                                <p className="text-muted-foreground">
                                    Select a tool to manage and analyze your academic performance
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tools.map((tool, index) => (
                            <motion.div
                                key={tool.path}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                onClick={() => navigate(tool.path)}
                                className="bg-card border border-border rounded-xl p-6 cursor-pointer hover:border-primary/50 hover:shadow-lg transition-all group"
                            >
                                <div className={`w-12 h-12 ${tool.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon name={tool.icon} size={24} className={tool.color} />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                    {tool.title}
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    {tool.description}
                                </p>
                                <div className="flex items-center text-primary font-medium text-sm">
                                    Open Tool <Icon name="ArrowRight" size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AcademicTools;
