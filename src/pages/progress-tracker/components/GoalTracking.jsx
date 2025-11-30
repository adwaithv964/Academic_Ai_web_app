import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const GoalTracking = () => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target: '',
    deadline: '',
    type: 'gpa'
  });

  const goals = [
    {
      id: 1,
      title: "Achieve 3.8 GPA",
      current: 3.67,
      target: 3.8,
      progress: 85,
      deadline: "2024-12-15",
      type: "gpa",
      status: "on-track"
    },
    {
      id: 2,
      title: "Complete All Assignments",
      current: 24,
      target: 28,
      progress: 86,
      deadline: "2024-11-30",
      type: "assignments",
      status: "on-track"
    },
    {
      id: 3,
      title: "Improve Math Grade to A",
      current: 92,
      target: 95,
      progress: 75,
      deadline: "2024-12-10",
      type: "course",
      status: "needs-attention"
    },
    {
      id: 4,
      title: "Study 150 Hours This Month",
      current: 142,
      target: 150,
      progress: 95,
      deadline: "2024-09-30",
      type: "study-time",
      status: "excellent"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent':
        return 'text-success bg-success/10 border-success/20';
      case 'on-track':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'needs-attention':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'behind':
        return 'text-error bg-error/10 border-error/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-muted/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent':
        return 'CheckCircle2';
      case 'on-track':
        return 'TrendingUp';
      case 'needs-attention':
        return 'AlertTriangle';
      case 'behind':
        return 'AlertCircle';
      default:
        return 'Clock';
    }
  };

  const handleAddGoal = () => {
    if (newGoal?.title && newGoal?.target && newGoal?.deadline) {
      // Mock add goal functionality
      console.log('Adding new goal:', newGoal);
      setNewGoal({ title: '', target: '', deadline: '', type: 'gpa' });
      setShowAddGoal(false);
    }
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    if (diffDays <= 7) return `${diffDays} days left`;
    return date?.toLocaleDateString();
  };

  return (
    <div className="bg-card border border-border rounded-lg academic-shadow">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Goal Tracking</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor progress toward your academic objectives
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            onClick={() => setShowAddGoal(!showAddGoal)}
          >
            Add Goal
          </Button>
        </div>

        {/* Add Goal Form */}
        {showAddGoal && (
          <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Goal Title"
                type="text"
                placeholder="e.g., Achieve 3.8 GPA"
                value={newGoal?.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e?.target?.value })}
              />
              <Input
                label="Target Value"
                type="text"
                placeholder="e.g., 3.8 or 95%"
                value={newGoal?.target}
                onChange={(e) => setNewGoal({ ...newGoal, target: e?.target?.value })}
              />
              <Input
                label="Deadline"
                type="date"
                value={newGoal?.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e?.target?.value })}
              />
              <div className="flex items-end gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleAddGoal}
                  className="flex-1"
                >
                  Add Goal
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddGoal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {goals?.map((goal) => (
            <div
              key={goal?.id}
              className="border border-border rounded-lg p-4 hover:academic-shadow-lg transition-academic"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{goal?.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDeadline(goal?.deadline)}
                  </p>
                </div>
                <div className={`
                  flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border
                  ${getStatusColor(goal?.status)}
                `}>
                  <Icon name={getStatusIcon(goal?.status)} size={12} />
                  <span className="capitalize">{goal?.status?.replace('-', ' ')}</span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{goal?.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`
                        h-2 rounded-full transition-all duration-500
                        ${goal?.progress >= 90 ? 'bg-success' : 
                          goal?.progress >= 70 ? 'bg-primary' : 
                          goal?.progress >= 50 ? 'bg-warning' : 'bg-error'}
                      `}
                      style={{ width: `${goal?.progress}%` }}
                    />
                  </div>
                </div>

                {/* Current vs Target */}
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">Current: </span>
                    <span className="font-medium text-foreground">
                      {goal?.type === 'gpa' ? goal?.current?.toFixed(2) : goal?.current}
                      {goal?.type === 'course' && '%'}
                      {goal?.type === 'study-time' && 'h'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Target: </span>
                    <span className="font-medium text-foreground">
                      {goal?.type === 'gpa' ? parseFloat(goal?.target)?.toFixed(2) : goal?.target}
                      {goal?.type === 'course' && '%'}
                      {goal?.type === 'study-time' && 'h'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="ghost" size="xs" iconName="Edit2">
                    Edit
                  </Button>
                  <Button variant="ghost" size="xs" iconName="Trash2">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalTracking;