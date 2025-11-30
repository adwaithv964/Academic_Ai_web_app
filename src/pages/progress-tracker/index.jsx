import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import PerformanceCards from './components/PerformanceCards';
import ChartTabs from './components/ChartTabs';
import FilterControls from './components/FilterControls';
import GoalTracking from './components/GoalTracking';
import DetailedAnalysis from './components/DetailedAnalysis';

const ProgressTracker = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    timeRange: 'semester',
    subject: 'all',
    assignmentType: 'all',
    gradingPeriod: 'current'
  });

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    // Mock filter application
    console.log('Applying filters:', newFilters);
  };

  const quickActions = [
    {
      label: 'Grade Predictor',
      description: 'Predict future grades',
      icon: 'TrendingUp',
      path: '/grade-predictor',
      color: 'bg-primary/10 text-primary border-primary/20'
    },
    {
      label: 'What-If Analysis',
      description: 'Explore scenarios',
      icon: 'Calculator',
      path: '/what-if-analysis',
      color: 'bg-secondary/10 text-secondary border-secondary/20'
    },
    {
      label: 'Study Planner',
      description: 'Plan study sessions',
      icon: 'Calendar',
      path: '/study-planner',
      color: 'bg-accent/10 text-accent border-accent/20'
    }
  ];

  const insights = [
    {
      id: 1,
      type: 'positive',
      title: 'Strong Performance Trend',
      message: 'Your GPA has improved by 0.23 points this semester, showing consistent academic growth.',
      icon: 'TrendingUp',
      action: 'View Details'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Assignment Due Soon',
      message: 'You have 4 assignments due within the next week. Consider prioritizing your study schedule.',
      icon: 'AlertTriangle',
      action: 'Plan Study Time'
    },
    {
      id: 3,
      type: 'info',
      title: 'Course Comparison Available',
      message: 'Compare your performance across different courses to identify strengths and improvement areas.',
      icon: 'BarChart3',
      action: 'Compare Courses'
    }
  ];

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive':
        return 'bg-success/10 text-success border-success/20';
      case 'warning':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'info':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Progress Tracker</h1>
              <p className="text-muted-foreground mt-2">
                Monitor your academic performance with comprehensive analytics and insights
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                iconName="Share"
                onClick={() => console.log('Share progress report')}
              >
                Share Report
              </Button>
              <Button
                variant="default"
                iconName="Target"
                onClick={() => console.log('Set new goal')}
              >
                Set Goal
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Performance Overview Cards */}
        <PerformanceCards />

        {/* Filter Controls */}
        <FilterControls onFiltersChange={handleFiltersChange} />

        {/* Charts Section */}
        <ChartTabs />

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions?.map((action, index) => (
            <div
              key={index}
              className={`
                border rounded-lg p-6 cursor-pointer hover:academic-shadow-lg 
                transition-academic ${action?.color}
              `}
              onClick={() => navigate(action?.path)}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action?.color}`}>
                  <Icon name={action?.icon} size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{action?.label}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{action?.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Goal Tracking - Takes 2 columns */}
          <div className="xl:col-span-2">
            <GoalTracking />
          </div>

          {/* Insights Panel - Takes 1 column */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg academic-shadow">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Academic Insights</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Personalized recommendations based on your performance
                </p>
              </div>
              <div className="p-6 space-y-4">
                {insights?.map((insight) => (
                  <div
                    key={insight?.id}
                    className={`
                      border rounded-lg p-4 transition-academic hover:academic-shadow
                      ${getInsightColor(insight?.type)}
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <Icon name={insight?.icon} size={20} className="mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm">{insight?.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{insight?.message}</p>
                        <Button
                          variant="ghost"
                          size="xs"
                          className="mt-2 p-0 h-auto text-xs"
                        >
                          {insight?.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Statistics */}
            <div className="bg-card border border-border rounded-lg academic-shadow">
              <div className="p-6 border-b border-border">
                <h3 className="text-lg font-semibold text-foreground">Study Statistics</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Study Hours</span>
                  <span className="font-semibold text-foreground">142h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Average Session</span>
                  <span className="font-semibold text-foreground">2.3h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Most Productive Day</span>
                  <span className="font-semibold text-foreground">Tuesday</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Streak</span>
                  <span className="font-semibold text-foreground">12 days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <DetailedAnalysis />

        {/* Achievement Badges */}
        <div className="bg-card border border-border rounded-lg academic-shadow">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Achievement Badges</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Celebrate your academic milestones and accomplishments
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { name: 'GPA Improver', icon: 'TrendingUp', earned: true, color: 'text-success' },
                { name: 'Perfect Attendance', icon: 'Calendar', earned: true, color: 'text-primary' },
                { name: 'Assignment Master', icon: 'CheckCircle', earned: true, color: 'text-secondary' },
                { name: 'Study Streak', icon: 'Flame', earned: false, color: 'text-muted-foreground' },
                { name: 'Top Performer', icon: 'Award', earned: false, color: 'text-muted-foreground' },
                { name: 'Goal Achiever', icon: 'Target', earned: false, color: 'text-muted-foreground' }
              ]?.map((badge, index) => (
                <div
                  key={index}
                  className={`
                    flex flex-col items-center gap-2 p-4 rounded-lg border transition-academic
                    ${badge?.earned 
                      ? 'bg-primary/5 border-primary/20 hover:bg-primary/10' :'bg-muted/20 border-muted/20 hover:bg-muted/30'
                    }
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${badge?.earned ? 'bg-primary/10' : 'bg-muted/30'}
                  `}>
                    <Icon name={badge?.icon} size={20} className={badge?.color} />
                  </div>
                  <span className={`
                    text-xs font-medium text-center
                    ${badge?.earned ? 'text-foreground' : 'text-muted-foreground'}
                  `}>
                    {badge?.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;