import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const StudyStats = ({ studySessions, tasks }) => {
  const calculateStats = () => {
    const now = new Date();
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    // Study sessions stats
    const totalSessions = studySessions?.length;
    const weekSessions = studySessions?.filter(session => 
      new Date(session.date) >= thisWeek
    )?.length;
    
    const totalStudyHours = studySessions?.reduce((total, session) => 
      total + (session?.duration || 0), 0
    );
    
    const weekStudyHours = studySessions?.filter(session => new Date(session.date) >= thisWeek)?.reduce((total, session) => total + (session?.duration || 0), 0);
    
    // Task stats
    const totalTasks = tasks?.length;
    const completedTasks = tasks?.filter(task => task?.completed)?.length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    
    // Overdue tasks
    const overdueTasks = tasks?.filter(task => 
      !task?.completed && task?.dueDate && new Date(task.dueDate) < now
    )?.length;
    
    // Subject distribution
    const subjectHours = {};
    studySessions?.forEach(session => {
      const subject = session?.subject || 'Other';
      subjectHours[subject] = (subjectHours?.[subject] || 0) + (session?.duration || 0);
    });
    
    const topSubject = Object.entries(subjectHours)?.reduce((top, [subject, hours]) => 
      hours > (top?.hours || 0) ? { subject, hours } : top, {}
    );

    return {
      totalSessions,
      weekSessions,
      totalStudyHours,
      weekStudyHours,
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      overdueTasks,
      topSubject
    };
  };

  const stats = calculateStats();

  const StatCard = ({ icon, title, value, subtitle, color = 'primary', trend }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-card border border-border rounded-lg p-4 hover:shadow-sm transition-academic"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg bg-${color}/10`}>
          <Icon name={icon} size={20} className={`text-${color}`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${
            trend > 0 ? 'text-success' : trend < 0 ? 'text-error' : 'text-muted-foreground'
          }`}>
            <Icon 
              name={trend > 0 ? 'TrendingUp' : trend < 0 ? 'TrendingDown' : 'Minus'} 
              size={12} 
            />
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Study Statistics</h3>
        <div className="text-sm text-muted-foreground">
          Last 7 days
        </div>
      </div>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="Clock"
          title="Study Hours"
          value={`${stats?.weekStudyHours}h`}
          subtitle={`${stats?.totalStudyHours}h total`}
          color="primary"
          trend={12}
        />
        
        <StatCard
          icon="BookOpen"
          title="Study Sessions"
          value={stats?.weekSessions}
          subtitle={`${stats?.totalSessions} total`}
          color="secondary"
          trend={8}
        />
        
        <StatCard
          icon="CheckCircle"
          title="Tasks Completed"
          value={stats?.completedTasks}
          subtitle={`${stats?.completionRate?.toFixed(0)}% completion rate`}
          color="success"
          trend={5}
        />
        
        <StatCard
          icon="AlertCircle"
          title="Pending Tasks"
          value={stats?.pendingTasks}
          subtitle={`${stats?.overdueTasks} overdue`}
          color={stats?.overdueTasks > 0 ? 'error' : 'warning'}
          trend={-3}
        />
      </div>
      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Subject */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Icon name="Award" size={20} className="text-accent" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Most Studied Subject</h4>
              <p className="text-sm text-muted-foreground">This week</p>
            </div>
          </div>
          
          {stats?.topSubject?.subject ? (
            <div>
              <p className="text-lg font-semibold text-foreground">
                {stats?.topSubject?.subject}
              </p>
              <p className="text-sm text-muted-foreground">
                {stats?.topSubject?.hours} hours studied
              </p>
            </div>
          ) : (
            <p className="text-muted-foreground">No study sessions yet</p>
          )}
        </div>

        {/* Study Streak */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Icon name="Flame" size={20} className="text-success" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">Study Streak</h4>
              <p className="text-sm text-muted-foreground">Consecutive days</p>
            </div>
          </div>
          
          <div>
            <p className="text-lg font-semibold text-foreground">5 days</p>
            <p className="text-sm text-muted-foreground">
              Keep it up! 🔥
            </p>
          </div>
        </div>
      </div>
      {/* Progress Bars */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h4 className="font-medium text-foreground mb-4">Weekly Progress</h4>
        
        <div className="space-y-4">
          {/* Study Hours Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground">Study Hours Goal</span>
              <span className="text-sm text-muted-foreground">
                {stats?.weekStudyHours}/25h
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((stats?.weekStudyHours / 25) * 100, 100)}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-primary h-2 rounded-full"
              />
            </div>
          </div>

          {/* Task Completion Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-foreground">Task Completion</span>
              <span className="text-sm text-muted-foreground">
                {stats?.completedTasks}/{stats?.totalTasks}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats?.completionRate}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="bg-success h-2 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyStats;