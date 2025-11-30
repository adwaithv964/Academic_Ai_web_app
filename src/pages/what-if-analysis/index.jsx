import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import ScenarioBuilder from './components/ScenarioBuilder';
import GPAChart from './components/GPAChart';
import ScenarioComparison from './components/ScenarioComparison';
import GoalSetting from './components/GoalSetting';

import { calculateGPA, getStoredGpaScale } from '../../utils/gradeScale';

const WhatIfAnalysis = () => {
  const navigate = useNavigate();
  const [activeScenario, setActiveScenario] = useState(1);
  const [chartType, setChartType] = useState('line');
  const [viewMode, setViewMode] = useState('builder'); // builder, comparison, goals
  const [gpaScale, setGpaScale] = useState('4.0');

  useEffect(() => {
    const storedScale = getStoredGpaScale();
    setGpaScale(storedScale);
  }, []);

  const [scenarios, setScenarios] = useState([
    {
      id: 1,
      name: 'Optimistic Scenario',
      description: 'Best case academic performance',
      projectedGPA: 3.75,
      courses: [
        { id: 1, name: 'Advanced Calculus', credits: 4, grade: 'B+', isNew: false },
        { id: 2, name: 'Physics II', credits: 4, grade: 'A-', isNew: false },
        { id: 3, name: 'Computer Science', credits: 3, grade: 'A', isNew: false },
        { id: 4, name: 'Statistics', credits: 3, grade: 'B', isNew: false }
      ]
    },
    {
      id: 2,
      name: 'Conservative Scenario',
      description: 'Cautious academic approach',
      projectedGPA: 3.45,
      courses: [
        { id: 1, name: 'Advanced Calculus', credits: 4, grade: 'B', isNew: false },
        { id: 2, name: 'Physics II', credits: 4, grade: 'B-', isNew: false },
        { id: 3, name: 'Computer Science', credits: 3, grade: 'B+', isNew: false },
        { id: 4, name: 'Statistics', credits: 3, grade: 'C+', isNew: false }
      ]
    },
    {
      id: 3,
      name: 'Realistic Scenario',
      description: 'Balanced performance expectations',
      projectedGPA: 3.68,
      courses: [
        { id: 1, name: 'Advanced Calculus', credits: 4, grade: 'B+', isNew: false },
        { id: 2, name: 'Physics II', credits: 4, grade: 'A-', isNew: false },
        { id: 3, name: 'Computer Science', credits: 3, grade: 'A-', isNew: false },
        { id: 4, name: 'Statistics', credits: 3, grade: 'B+', isNew: false }
      ]
    }
  ]);

  // Recalculate GPAs when scale changes or scenarios load
  useEffect(() => {
    setScenarios(prev => prev.map(scenario => ({
      ...scenario,
      projectedGPA: calculateGPA(scenario.courses, gpaScale)
    })));
  }, [gpaScale]);

  const chartTypeOptions = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' }
  ];

  const viewModeOptions = [
    { value: 'builder', label: 'Scenario Builder' },
    { value: 'comparison', label: 'Comparison View' },
    { value: 'goals', label: 'Goal Setting' }
  ];

  const handleAddCourse = (scenarioId, course) => {
    setScenarios(prev => prev?.map(scenario => {
      if (scenario?.id === scenarioId) {
        const updatedCourses = [...scenario?.courses, course];
        const newGPA = calculateGPA(updatedCourses, gpaScale);
        return { ...scenario, courses: updatedCourses, projectedGPA: newGPA };
      }
      return scenario;
    }));
  };

  const handleRemoveCourse = (scenarioId, courseId) => {
    setScenarios(prev => prev?.map(scenario => {
      if (scenario?.id === scenarioId) {
        const updatedCourses = scenario?.courses?.filter(course => course?.id !== courseId);
        const newGPA = calculateGPA(updatedCourses, gpaScale);
        return { ...scenario, courses: updatedCourses, projectedGPA: newGPA };
      }
      return scenario;
    }));
  };

  const handleUpdateCourse = (scenarioId, courseId, updates) => {
    setScenarios(prev => prev?.map(scenario => {
      if (scenario?.id === scenarioId) {
        const updatedCourses = scenario?.courses?.map(course =>
          course?.id === courseId ? { ...course, ...updates } : course
        );
        const newGPA = calculateGPA(updatedCourses, gpaScale);
        return { ...scenario, courses: updatedCourses, projectedGPA: newGPA };
      }
      return scenario;
    }));
  };

  const handleSaveScenario = (scenarioId) => {
    // Mock save functionality
    console.log('Saving scenario:', scenarioId);
  };

  const handleExportReport = () => {
    // Mock export functionality
    console.log('Exporting PDF report');
  };

  const handleSetGoal = (goalData) => {
    console.log('Setting goal:', goalData);
  };

  const handleCalculateRequirements = (requirements) => {
    console.log('Calculating requirements:', requirements);
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'comparison':
        return (
          <ScenarioComparison
            scenarios={scenarios}
            onSaveScenario={handleSaveScenario}
            onExportReport={handleExportReport}
          />
        );
      case 'goals':
        return (
          <GoalSetting
            onSetGoal={handleSetGoal}
            onCalculateRequirements={handleCalculateRequirements}
          />
        );
      default:
        return (
          <ScenarioBuilder
            scenarios={scenarios}
            activeScenario={activeScenario}
            onScenarioChange={setActiveScenario}
            onAddCourse={handleAddCourse}
            onRemoveCourse={handleRemoveCourse}
            onUpdateCourse={handleUpdateCourse}
            gpaScale={gpaScale}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">What-If Analysis</h1>
              <p className="text-muted-foreground">Explore academic scenarios and calculate GPA impact</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                iconName="ArrowLeft"
                iconPosition="left"
                onClick={() => navigate('/grade-predictor')}
              >
                Back to Predictor
              </Button>
              <Button
                variant="default"
                iconName="Calendar"
                iconPosition="left"
                onClick={() => navigate('/study-planner')}
              >
                Create Study Plan
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Select
              label="View Mode"
              options={viewModeOptions}
              value={viewMode}
              onChange={setViewMode}
            />
          </div>
          {viewMode === 'builder' && (
            <div className="flex-1">
              <Select
                label="Chart Type"
                options={chartTypeOptions}
                value={chartType}
                onChange={setChartType}
              />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {renderContent()}
          </div>

          {/* Right Column - Chart and Quick Stats */}
          <div className="space-y-6">
            {/* GPA Chart */}
            {viewMode !== 'goals' && (
              <GPAChart scenarios={scenarios} chartType={chartType} />
            )}

            {/* Quick Stats */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Current GPA</span>
                  <span className="font-semibold text-foreground">3.60</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Credits Completed</span>
                  <span className="font-semibold text-foreground">96</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Credits Remaining</span>
                  <span className="font-semibold text-foreground">32</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Best Scenario</span>
                  <span className="font-semibold text-success">3.75</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Worst Scenario</span>
                  <span className="font-semibold text-error">3.45</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  iconName="TrendingUp"
                  iconPosition="left"
                  fullWidth
                  onClick={() => navigate('/progress-tracker')}
                >
                  View Progress
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
                <Button
                  variant="outline"
                  iconName="Settings"
                  iconPosition="left"
                  fullWidth
                  onClick={() => navigate('/student-profile-settings')}
                >
                  Profile Settings
                </Button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-accent/5 rounded-lg border border-accent/20 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Lightbulb" size={16} className="text-accent" />
                <span className="text-sm font-medium text-accent">Pro Tips</span>
              </div>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle" size={14} className="text-success mt-0.5" />
                  <span>Create multiple scenarios to compare different outcomes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle" size={14} className="text-success mt-0.5" />
                  <span>Focus on high-credit courses for maximum GPA impact</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="CheckCircle" size={14} className="text-success mt-0.5" />
                  <span>Set realistic goals based on your current performance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIfAnalysis;