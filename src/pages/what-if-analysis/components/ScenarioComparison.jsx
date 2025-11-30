import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ScenarioComparison = ({ scenarios, onSaveScenario, onExportReport }) => {
  const comparisonData = [
    {
      id: 1,
      name: 'Optimistic Scenario',
      description: 'Achieving A grades in all new courses',
      currentGPA: 3.60,
      projectedGPA: 3.75,
      change: +0.15,
      graduationDate: 'May 2025',
      academicStanding: 'Dean\'s List',
      totalCredits: 128,
      coursesAdded: 6,
      riskLevel: 'Low',
      color: 'primary'
    },
    {
      id: 2,
      name: 'Conservative Scenario',
      description: 'Maintaining current performance levels',
      currentGPA: 3.60,
      projectedGPA: 3.45,
      change: -0.15,
      graduationDate: 'December 2025',
      academicStanding: 'Good Standing',
      totalCredits: 132,
      coursesAdded: 8,
      riskLevel: 'Medium',
      color: 'success'
    },
    {
      id: 3,
      name: 'Realistic Scenario',
      description: 'Balanced approach with mixed grades',
      currentGPA: 3.60,
      projectedGPA: 3.68,
      change: +0.08,
      graduationDate: 'May 2025',
      academicStanding: 'Dean\'s List',
      totalCredits: 128,
      coursesAdded: 6,
      riskLevel: 'Low',
      color: 'warning'
    }
  ];

  const getChangeIcon = (change) => {
    if (change > 0) return { name: 'TrendingUp', color: 'text-success' };
    if (change < 0) return { name: 'TrendingDown', color: 'text-error' };
    return { name: 'Minus', color: 'text-muted-foreground' };
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-success bg-success/10 border-success/20';
      case 'Medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'High': return 'text-error bg-error/10 border-error/20';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  const getCardColor = (color) => {
    switch (color) {
      case 'primary': return 'border-primary/20 bg-primary/5';
      case 'success': return 'border-success/20 bg-success/5';
      case 'warning': return 'border-warning/20 bg-warning/5';
      default: return 'border-border bg-card';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Scenario Comparison</h2>
        <div className="flex items-center gap-2">
          <Icon name="BarChart3" size={20} className="text-primary" />
          <span className="text-sm text-muted-foreground">Side-by-Side Analysis</span>
        </div>
      </div>
      {/* Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {comparisonData?.map((scenario) => {
          const changeIcon = getChangeIcon(scenario?.change);
          return (
            <div
              key={scenario?.id}
              className={`p-6 rounded-lg border-2 transition-academic hover:shadow-lg ${getCardColor(scenario?.color)}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {scenario?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {scenario?.description}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getRiskColor(scenario?.riskLevel)}`}>
                  {scenario?.riskLevel} Risk
                </div>
              </div>
              {/* GPA Change */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">GPA Change</span>
                  <div className="flex items-center gap-1">
                    <Icon name={changeIcon?.name} size={16} className={changeIcon?.color} />
                    <span className={`text-sm font-medium ${changeIcon?.color}`}>
                      {scenario?.change > 0 ? '+' : ''}{scenario?.change?.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">
                    {scenario?.projectedGPA?.toFixed(2)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    from {scenario?.currentGPA?.toFixed(2)}
                  </span>
                </div>
              </div>
              {/* Key Metrics */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Graduation Date</span>
                  <span className="font-medium text-foreground">{scenario?.graduationDate}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Academic Standing</span>
                  <span className="font-medium text-foreground">{scenario?.academicStanding}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Credits</span>
                  <span className="font-medium text-foreground">{scenario?.totalCredits}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Courses Added</span>
                  <span className="font-medium text-foreground">{scenario?.coursesAdded}</span>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Save"
                    onClick={() => onSaveScenario(scenario?.id)}
                    className="flex-1"
                  >
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Share"
                    className="flex-1"
                  >
                    Share
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Impact Summary */}
      <div className="bg-muted/30 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Impact Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="TrendingUp" size={24} className="text-success" />
            </div>
            <h4 className="font-semibold text-foreground mb-1">Best Case</h4>
            <p className="text-2xl font-bold text-success mb-1">+0.15</p>
            <p className="text-sm text-muted-foreground">GPA Improvement</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="Target" size={24} className="text-warning" />
            </div>
            <h4 className="font-semibold text-foreground mb-1">Most Likely</h4>
            <p className="text-2xl font-bold text-warning mb-1">+0.08</p>
            <p className="text-sm text-muted-foreground">GPA Improvement</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="AlertTriangle" size={24} className="text-error" />
            </div>
            <h4 className="font-semibold text-foreground mb-1">Worst Case</h4>
            <p className="text-2xl font-bold text-error mb-1">-0.15</p>
            <p className="text-sm text-muted-foreground">GPA Decline</p>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="default"
          iconName="Download"
          iconPosition="left"
          onClick={onExportReport}
          className="flex-1"
        >
          Export PDF Report
        </Button>
        <Button
          variant="outline"
          iconName="Calendar"
          iconPosition="left"
          className="flex-1"
        >
          Create Study Plan
        </Button>
        <Button
          variant="outline"
          iconName="Users"
          iconPosition="left"
          className="flex-1"
        >
          Schedule Advisor Meeting
        </Button>
      </div>
    </div>
  );
};

export default ScenarioComparison;