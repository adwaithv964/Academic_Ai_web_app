import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CourseSelectionForm = ({ onPredict, isLoading, initialData }) => {
  const [formData, setFormData] = useState({
    course: '',
    currentGrade: '',
    examWeight: 40,
    homeworkWeight: 30,
    participationWeight: 30,
    remainingAssignments: 5,
    difficulty: 'medium',
    historicalPerformance: 'average'
  });

  // Load initial data if provided
  React.useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const [showAdvanced, setShowAdvanced] = useState(false);

  const courseOptions = [
    { value: 'math101', label: 'Mathematics 101' },
    { value: 'phys201', label: 'Physics 201' },
    { value: 'chem150', label: 'Chemistry 150' },
    { value: 'eng102', label: 'English Literature 102' },
    { value: 'hist200', label: 'World History 200' },
    { value: 'bio101', label: 'Biology 101' },
    { value: 'cs201', label: 'Computer Science 201' },
    { value: 'econ101', label: 'Economics 101' }
  ];

  const difficultyOptions = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const performanceOptions = [
    { value: 'excellent', label: 'Excellent (A average)' },
    { value: 'good', label: 'Good (B average)' },
    { value: 'average', label: 'Average (C average)' },
    { value: 'below-average', label: 'Below Average (D average)' }
  ];

  const remainingOptions = [
    { value: 1, label: '1 assignment' },
    { value: 2, label: '2 assignments' },
    { value: 3, label: '3 assignments' },
    { value: 4, label: '4 assignments' },
    { value: 5, label: '5 assignments' },
    { value: 6, label: '6+ assignments' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSliderChange = (field, value) => {
    const numValue = parseInt(value);
    let updatedData = { ...formData, [field]: numValue };

    // Auto-adjust other weights to maintain 100% total
    if (field === 'examWeight') {
      const remaining = 100 - numValue;
      updatedData.homeworkWeight = Math.round(remaining * 0.6);
      updatedData.participationWeight = remaining - updatedData?.homeworkWeight;
    } else if (field === 'homeworkWeight') {
      const remaining = 100 - numValue;
      updatedData.examWeight = Math.round(remaining * 0.7);
      updatedData.participationWeight = remaining - updatedData?.examWeight;
    } else if (field === 'participationWeight') {
      const remaining = 100 - numValue;
      updatedData.examWeight = Math.round(remaining * 0.7);
      updatedData.homeworkWeight = remaining - updatedData?.examWeight;
    }

    setFormData(updatedData);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (formData?.course && formData?.currentGrade) {
      const selectedCourse = courseOptions.find(c => c.value === formData.course);
      onPredict({
        ...formData,
        courseName: selectedCourse ? selectedCourse.label : formData.course
      });
    }
  };

  const isFormValid = formData?.course && formData?.currentGrade &&
    parseFloat(formData?.currentGrade) >= 0 && parseFloat(formData?.currentGrade) <= 100;

  const totalWeight = formData?.examWeight + formData?.homeworkWeight + formData?.participationWeight;

  return (
    <div className="bg-card rounded-lg border border-border p-6 academic-shadow">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="TrendingUp" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Grade Prediction</h2>
          <p className="text-sm text-muted-foreground">Enter your course details for AI-powered grade forecasting</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Select Course"
            placeholder="Choose your course"
            options={courseOptions}
            value={formData?.course}
            onChange={(value) => handleInputChange('course', value)}
            required
            searchable
          />

          <Input
            label="Current Grade (%)"
            type="number"
            placeholder="Enter current grade"
            value={formData?.currentGrade}
            onChange={(e) => handleInputChange('currentGrade', e?.target?.value)}
            min="0"
            max="100"
            required
            description="Your current overall grade percentage"
          />
        </div>

        {/* Assignment Weights */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">Assignment Weights</h3>
            <div className={`text-sm px-3 py-1 rounded-full ${totalWeight === 100 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
              }`}>
              Total: {totalWeight}%
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Exam Weight */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center justify-between">
                Exams
                <span className="text-primary font-semibold">{formData?.examWeight}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData?.examWeight}
                onChange={(e) => handleSliderChange('examWeight', e?.target?.value)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Homework Weight */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center justify-between">
                Homework
                <span className="text-secondary font-semibold">{formData?.homeworkWeight}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData?.homeworkWeight}
                onChange={(e) => handleSliderChange('homeworkWeight', e?.target?.value)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Participation Weight */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center justify-between">
                Participation
                <span className="text-accent font-semibold">{formData?.participationWeight}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData?.participationWeight}
                onChange={(e) => handleSliderChange('participationWeight', e?.target?.value)}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Remaining Assignments */}
        <Select
          label="Remaining Assignments"
          placeholder="Select number of assignments"
          options={remainingOptions}
          value={formData?.remainingAssignments}
          onChange={(value) => handleInputChange('remainingAssignments', value)}
          description="How many assignments are left in the semester"
        />

        {/* Advanced Options Toggle */}
        <div className="border-t border-border pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-academic"
          >
            <Icon name={showAdvanced ? 'ChevronUp' : 'ChevronDown'} size={16} />
            Advanced Options
          </button>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-4 bg-muted/30 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Course Difficulty"
                placeholder="Select difficulty level"
                options={difficultyOptions}
                value={formData?.difficulty}
                onChange={(value) => handleInputChange('difficulty', value)}
                description="How challenging is this course for you"
              />

              <Select
                label="Historical Performance"
                placeholder="Select your typical performance"
                options={performanceOptions}
                value={formData?.historicalPerformance}
                onChange={(value) => handleInputChange('historicalPerformance', value)}
                description="Your average performance in similar courses"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            variant="default"
            size="lg"
            loading={isLoading}
            disabled={!isFormValid || totalWeight !== 100}
            iconName="TrendingUp"
            iconPosition="left"
            className="flex-1"
          >
            {isLoading ? 'Analyzing...' : 'Predict Grade'}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => setFormData({
              course: '',
              currentGrade: '',
              examWeight: 40,
              homeworkWeight: 30,
              participationWeight: 30,
              remainingAssignments: 5,
              difficulty: 'medium',
              historicalPerformance: 'average'
            })}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset Form
          </Button>
        </div>

        {/* Form Validation Messages */}
        {!isFormValid && formData?.course && formData?.currentGrade && (
          <div className="flex items-center gap-2 text-sm text-error bg-error/10 rounded-lg p-3">
            <Icon name="AlertCircle" size={16} />
            <span>Please enter a valid grade between 0 and 100</span>
          </div>
        )}

        {totalWeight !== 100 && (
          <div className="flex items-center gap-2 text-sm text-warning bg-warning/10 rounded-lg p-3">
            <Icon name="AlertTriangle" size={16} />
            <span>Assignment weights must total 100%. Current total: {totalWeight}%</span>
          </div>
        )}
      </form>
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--color-primary);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default CourseSelectionForm;