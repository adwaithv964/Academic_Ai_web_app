import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ScenarioBuilder = ({ scenarios, activeScenario, onScenarioChange, onAddCourse, onRemoveCourse, onUpdateCourse }) => {
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState('');
  const [newCourseGrade, setNewCourseGrade] = useState('');

  const gradeOptions = [
    { value: 'A+', label: 'A+ (4.0)' },
    { value: 'A', label: 'A (4.0)' },
    { value: 'A-', label: 'A- (3.7)' },
    { value: 'B+', label: 'B+ (3.3)' },
    { value: 'B', label: 'B (3.0)' },
    { value: 'B-', label: 'B- (2.7)' },
    { value: 'C+', label: 'C+ (2.3)' },
    { value: 'C', label: 'C (2.0)' },
    { value: 'C-', label: 'C- (1.7)' },
    { value: 'D+', label: 'D+ (1.3)' },
    { value: 'D', label: 'D (1.0)' },
    { value: 'F', label: 'F (0.0)' }
  ];

  const creditOptions = [
    { value: '1', label: '1 Credit' },
    { value: '2', label: '2 Credits' },
    { value: '3', label: '3 Credits' },
    { value: '4', label: '4 Credits' },
    { value: '5', label: '5 Credits' },
    { value: '6', label: '6 Credits' }
  ];

  const handleAddCourse = () => {
    if (newCourseName && newCourseCredits && newCourseGrade) {
      onAddCourse(activeScenario, {
        id: Date.now(),
        name: newCourseName,
        credits: parseInt(newCourseCredits),
        grade: newCourseGrade,
        isNew: true
      });
      setNewCourseName('');
      setNewCourseCredits('');
      setNewCourseGrade('');
    }
  };

  const currentScenario = scenarios?.find(s => s?.id === activeScenario);

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Scenario Builder</h2>
        <div className="flex items-center gap-2">
          <Icon name="Calculator" size={20} className="text-primary" />
          <span className="text-sm text-muted-foreground">Build Your Academic Scenario</span>
        </div>
      </div>
      {/* Scenario Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-border">
        {scenarios?.map((scenario) => (
          <button
            key={scenario?.id}
            onClick={() => onScenarioChange(scenario?.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-academic border-b-2 ${
              activeScenario === scenario?.id
                ? 'text-primary border-primary bg-primary/5' :'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50'
            }`}
          >
            {scenario?.name}
          </button>
        ))}
      </div>
      {/* Current Courses */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Current Courses</h3>
        <div className="space-y-3">
          {currentScenario?.courses?.map((course) => (
            <div key={course?.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground">{course?.name}</h4>
                  {course?.isNew && (
                    <span className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded-full">
                      New
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {course?.credits} {course?.credits === 1 ? 'Credit' : 'Credits'} • Grade: {course?.grade}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  options={gradeOptions}
                  value={course?.grade}
                  onChange={(value) => onUpdateCourse(activeScenario, course?.id, { grade: value })}
                  className="w-32"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  onClick={() => onRemoveCourse(activeScenario, course?.id)}
                  className="text-error hover:text-error"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Add New Course */}
      <div className="border-t border-border pt-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Add New Course</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Course Name"
              type="text"
              placeholder="e.g., Advanced Calculus"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e?.target?.value)}
            />
          </div>
          <div>
            <Select
              label="Credits"
              options={creditOptions}
              value={newCourseCredits}
              onChange={setNewCourseCredits}
              placeholder="Select credits"
            />
          </div>
          <div>
            <Select
              label="Expected Grade"
              options={gradeOptions}
              value={newCourseGrade}
              onChange={setNewCourseGrade}
              placeholder="Select grade"
            />
          </div>
        </div>
        <div className="mt-4">
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={handleAddCourse}
            disabled={!newCourseName || !newCourseCredits || !newCourseGrade}
          >
            Add Course
          </Button>
        </div>
      </div>
      {/* Scenario Summary */}
      <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="Info" size={16} className="text-primary" />
          <span className="text-sm font-medium text-primary">Scenario Summary</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Total Courses</p>
            <p className="font-medium text-foreground">{currentScenario?.courses?.length || 0}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Credits</p>
            <p className="font-medium text-foreground">
              {currentScenario?.courses?.reduce((sum, course) => sum + course?.credits, 0) || 0}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">New Courses</p>
            <p className="font-medium text-foreground">
              {currentScenario?.courses?.filter(course => course?.isNew)?.length || 0}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Projected GPA</p>
            <p className="font-medium text-primary">
              {currentScenario?.projectedGPA || '0.00'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioBuilder;