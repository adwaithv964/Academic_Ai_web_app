import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const GoalSetting = ({ onSetGoal, onCalculateRequirements }) => {
  const [targetGPA, setTargetGPA] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [goalType, setGoalType] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);

  const goalTypeOptions = [
    { value: 'graduation', label: 'Graduation GPA' },
    { value: 'semester', label: 'Semester GPA' },
    { value: 'dean_list', label: 'Dean\'s List (3.5+)' },
    { value: 'honors', label: 'Magna Cum Laude (3.7+)' },
    { value: 'summa', label: 'Summa Cum Laude (3.9+)' }
  ];

  const semesterOptions = [
    { value: 'spring_2025', label: 'Spring 2025' },
    { value: 'fall_2025', label: 'Fall 2025' },
    { value: 'spring_2026', label: 'Spring 2026' },
    { value: 'fall_2026', label: 'Fall 2026' }
  ];

  const recommendations = [
    {
      course: 'Advanced Mathematics',
      currentGrade: 'B',
      requiredGrade: 'A-',
      credits: 4,
      difficulty: 'High',
      impact: '+0.12 GPA'
    },
    {
      course: 'Physics Laboratory',
      currentGrade: 'B+',
      requiredGrade: 'A',
      credits: 3,
      difficulty: 'Medium',
      impact: '+0.08 GPA'
    },
    {
      course: 'Computer Science Elective',
      currentGrade: 'A-',
      requiredGrade: 'A',
      credits: 3,
      difficulty: 'Low',
      impact: '+0.05 GPA'
    }
  ];

  const handleCalculateGoal = () => {
    if (targetGPA && goalType) {
      setShowRecommendations(true);
      onCalculateRequirements({ targetGPA, goalType, targetDate });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Low': return 'text-success bg-success/10 border-success/20';
      case 'Medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'High': return 'text-error bg-error/10 border-error/20';
      default: return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Goal Setting & Requirements</h2>
        <div className="flex items-center gap-2">
          <Icon name="Target" size={20} className="text-primary" />
          <span className="text-sm text-muted-foreground">Set Academic Goals</span>
        </div>
      </div>
      {/* Goal Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Input
            label="Target GPA"
            type="number"
            placeholder="e.g., 3.75"
            value={targetGPA}
            onChange={(e) => setTargetGPA(e?.target?.value)}
            min="0"
            max="4"
            step="0.01"
          />
        </div>
        <div>
          <Select
            label="Goal Type"
            options={goalTypeOptions}
            value={goalType}
            onChange={setGoalType}
            placeholder="Select goal type"
          />
        </div>
        <div>
          <Select
            label="Target Date"
            options={semesterOptions}
            value={targetDate}
            onChange={setTargetDate}
            placeholder="Select semester"
          />
        </div>
      </div>
      <div className="mb-6">
        <Button
          variant="default"
          iconName="Calculator"
          iconPosition="left"
          onClick={handleCalculateGoal}
          disabled={!targetGPA || !goalType}
        >
          Calculate Requirements
        </Button>
      </div>
      {/* Goal Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="User" size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Current GPA</span>
          </div>
          <p className="text-2xl font-bold text-foreground">3.60</p>
          <p className="text-xs text-muted-foreground">Based on 96 credits</p>
        </div>

        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Target" size={16} className="text-primary" />
            <span className="text-sm font-medium text-primary">Target GPA</span>
          </div>
          <p className="text-2xl font-bold text-primary">{targetGPA || '0.00'}</p>
          <p className="text-xs text-muted-foreground">Goal for graduation</p>
        </div>

        <div className="p-4 bg-success/5 rounded-lg border border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="TrendingUp" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">Required Improvement</span>
          </div>
          <p className="text-2xl font-bold text-success">
            +{targetGPA ? (parseFloat(targetGPA) - 3.60)?.toFixed(2) : '0.00'}
          </p>
          <p className="text-xs text-muted-foreground">GPA points needed</p>
        </div>
      </div>
      {/* Recommendations */}
      {showRecommendations && (
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Grade Recommendations</h3>
          <div className="space-y-4">
            {recommendations?.map((rec, index) => (
              <div key={index} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{rec?.course}</h4>
                    <p className="text-sm text-muted-foreground">{rec?.credits} Credits</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(rec?.difficulty)}`}>
                    {rec?.difficulty}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Current Grade</p>
                    <p className="font-medium text-foreground">{rec?.currentGrade}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Required Grade</p>
                    <p className="font-medium text-primary">{rec?.requiredGrade}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">GPA Impact</p>
                    <p className="font-medium text-success">{rec?.impact}</p>
                  </div>
                  <div className="flex items-center">
                    <Button variant="ghost" size="sm" iconName="BookOpen">
                      Study Plan
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Plan */}
          <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
            <div className="flex items-center gap-2 mb-3">
              <Icon name="CheckCircle" size={16} className="text-accent" />
              <span className="text-sm font-medium text-accent">Action Plan</span>
            </div>
            <ul className="space-y-2 text-sm text-foreground">
              <li className="flex items-start gap-2">
                <Icon name="ArrowRight" size={14} className="text-primary mt-0.5" />
                <span>Focus on improving Advanced Mathematics grade from B to A- (highest impact)</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="ArrowRight" size={14} className="text-primary mt-0.5" />
                <span>Maintain current performance in Computer Science Elective</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="ArrowRight" size={14} className="text-primary mt-0.5" />
                <span>Consider additional study sessions for Physics Laboratory</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalSetting;