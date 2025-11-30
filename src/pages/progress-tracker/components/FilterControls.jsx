import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FilterControls = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    timeRange: 'semester',
    subject: 'all',
    assignmentType: 'all',
    gradingPeriod: 'current'
  });

  const timeRangeOptions = [
    { value: 'semester', label: 'Current Semester' },
    { value: 'year', label: 'Academic Year' },
    { value: 'all', label: 'All Time' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const subjectOptions = [
    { value: 'all', label: 'All Subjects' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'english', label: 'English' },
    { value: 'history', label: 'History' }
  ];

  const assignmentTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'exam', label: 'Exams' },
    { value: 'quiz', label: 'Quizzes' },
    { value: 'homework', label: 'Homework' },
    { value: 'project', label: 'Projects' },
    { value: 'lab', label: 'Lab Reports' }
  ];

  const gradingPeriodOptions = [
    { value: 'current', label: 'Current Period' },
    { value: 'midterm', label: 'Midterm' },
    { value: 'final', label: 'Final' },
    { value: 'quarter1', label: 'Quarter 1' },
    { value: 'quarter2', label: 'Quarter 2' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      timeRange: 'semester',
      subject: 'all',
      assignmentType: 'all',
      gradingPeriod: 'current'
    };
    setFilters(defaultFilters);
    onFiltersChange?.(defaultFilters);
  };

  const exportData = () => {
    // Mock export functionality
    const exportData = {
      filters,
      timestamp: new Date()?.toISOString(),
      data: 'Mock performance data would be exported here'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progress-report-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6 academic-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
          <Select
            label="Time Range"
            options={timeRangeOptions}
            value={filters?.timeRange}
            onChange={(value) => handleFilterChange('timeRange', value)}
            className="w-full"
          />
          
          <Select
            label="Subject"
            options={subjectOptions}
            value={filters?.subject}
            onChange={(value) => handleFilterChange('subject', value)}
            className="w-full"
          />
          
          <Select
            label="Assignment Type"
            options={assignmentTypeOptions}
            value={filters?.assignmentType}
            onChange={(value) => handleFilterChange('assignmentType', value)}
            className="w-full"
          />
          
          <Select
            label="Grading Period"
            options={gradingPeriodOptions}
            value={filters?.gradingPeriod}
            onChange={(value) => handleFilterChange('gradingPeriod', value)}
            className="w-full"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 lg:ml-4">
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            onClick={resetFilters}
          >
            Reset
          </Button>
          
          <Button
            variant="secondary"
            size="sm"
            iconName="Download"
            onClick={exportData}
          >
            Export
          </Button>
        </div>
      </div>
      {/* Active Filters Display */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Active Filters:</span>
          
          {Object.entries(filters)?.map(([key, value]) => {
            if (value === 'all' || value === 'current') return null;
            
            const label = key?.charAt(0)?.toUpperCase() + key?.slice(1)?.replace(/([A-Z])/g, ' $1');
            const optionLabel = (() => {
              switch (key) {
                case 'timeRange':
                  return timeRangeOptions?.find(opt => opt?.value === value)?.label;
                case 'subject':
                  return subjectOptions?.find(opt => opt?.value === value)?.label;
                case 'assignmentType':
                  return assignmentTypeOptions?.find(opt => opt?.value === value)?.label;
                case 'gradingPeriod':
                  return gradingPeriodOptions?.find(opt => opt?.value === value)?.label;
                default:
                  return value;
              }
            })();

            return (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {label}: {optionLabel}
                <button
                  onClick={() => handleFilterChange(key, key === 'gradingPeriod' ? 'current' : 'all')}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-academic"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            );
          })}
          
          {Object.values(filters)?.every(value => value === 'all' || value === 'current' || value === 'semester') && (
            <span className="text-sm text-muted-foreground">No filters applied</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterControls;