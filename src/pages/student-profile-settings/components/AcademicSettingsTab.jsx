import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const AcademicSettingsTab = () => {
  const [academicSettings, setAcademicSettings] = useState({
    currentGPA: "3.7",
    gpaScale: "4.0",
    targetGPA: "3.8",
    creditHours: "120",
    completedHours: "78",
    courseCatalogIntegration: true,
    gradeWeighting: "standard",
    semesterSystem: "semester",
    academicYear: "2024-2025"
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const gpaScaleOptions = [
    { value: "4.0", label: "4.0 Scale (A=4.0)" },
    { value: "5.0", label: "5.0 Scale (A=5.0)" },
    { value: "10.0", label: "10.0 Scale (A=10.0)" },
    { value: "100", label: "100 Point Scale" }
  ];

  const gradeWeightingOptions = [
    { value: "standard", label: "Standard Weighting" },
    { value: "weighted", label: "Weighted (Honors/AP)" },
    { value: "custom", label: "Custom Weighting" }
  ];

  const semesterSystemOptions = [
    { value: "semester", label: "Semester System" },
    { value: "quarter", label: "Quarter System" },
    { value: "trimester", label: "Trimester System" }
  ];

  const academicYearOptions = [
    { value: "2024-2025", label: "2024-2025" },
    { value: "2025-2026", label: "2025-2026" },
    { value: "2026-2027", label: "2026-2027" },
    { value: "2027-2028", label: "2027-2028" }
  ];

  const handleInputChange = (field, value) => {
    setAcademicSettings(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!academicSettings?.currentGPA || isNaN(academicSettings?.currentGPA)) {
      newErrors.currentGPA = 'Please enter a valid GPA';
    }
    
    if (!academicSettings?.targetGPA || isNaN(academicSettings?.targetGPA)) {
      newErrors.targetGPA = 'Please enter a valid target GPA';
    }
    
    if (!academicSettings?.creditHours || isNaN(academicSettings?.creditHours)) {
      newErrors.creditHours = 'Please enter valid credit hours';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    alert('Academic settings updated successfully!');
  };

  const calculateProgress = () => {
    const completed = parseFloat(academicSettings?.completedHours) || 0;
    const total = parseFloat(academicSettings?.creditHours) || 1;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Academic Settings</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your academic preferences and grading system
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={handleSave}
          loading={isSaving}
          iconName="Save"
          iconPosition="left"
        >
          Save Settings
        </Button>
      </div>
      {/* GPA Configuration */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          GPA Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Current GPA"
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={academicSettings?.currentGPA}
              onChange={(e) => handleInputChange('currentGPA', e?.target?.value)}
              error={errors?.currentGPA}
              placeholder="Enter your current GPA"
            />

            <Select
              label="GPA Scale"
              options={gpaScaleOptions}
              value={academicSettings?.gpaScale}
              onChange={(value) => handleInputChange('gpaScale', value)}
              placeholder="Select GPA scale"
            />

            <Input
              label="Target GPA"
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={academicSettings?.targetGPA}
              onChange={(e) => handleInputChange('targetGPA', e?.target?.value)}
              error={errors?.targetGPA}
              placeholder="Enter your target GPA"
              description="Set your academic goal for GPA tracking"
            />
          </div>

          <div className="space-y-4">
            <Select
              label="Grade Weighting System"
              options={gradeWeightingOptions}
              value={academicSettings?.gradeWeighting}
              onChange={(value) => handleInputChange('gradeWeighting', value)}
              placeholder="Select weighting system"
            />

            <Select
              label="Academic System"
              options={semesterSystemOptions}
              value={academicSettings?.semesterSystem}
              onChange={(value) => handleInputChange('semesterSystem', value)}
              placeholder="Select academic system"
            />

            <Select
              label="Academic Year"
              options={academicYearOptions}
              value={academicSettings?.academicYear}
              onChange={(value) => handleInputChange('academicYear', value)}
              placeholder="Select academic year"
            />
          </div>
        </div>
      </div>
      {/* Credit Hours Progress */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="BookOpen" size={20} className="text-secondary" />
          Credit Hours Progress
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Total Credit Hours Required"
              type="number"
              min="0"
              value={academicSettings?.creditHours}
              onChange={(e) => handleInputChange('creditHours', e?.target?.value)}
              error={errors?.creditHours}
              placeholder="Enter total credit hours"
            />

            <Input
              label="Completed Credit Hours"
              type="number"
              min="0"
              value={academicSettings?.completedHours}
              onChange={(e) => handleInputChange('completedHours', e?.target?.value)}
              placeholder="Enter completed credit hours"
            />
          </div>

          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-muted stroke-current"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary stroke-current"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${calculateProgress()}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-foreground">{calculateProgress()}%</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Degree Progress</p>
              <p className="text-xs text-muted-foreground mt-1">
                {academicSettings?.completedHours} of {academicSettings?.creditHours} hours
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Integration Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="Settings" size={20} className="text-accent" />
          Integration Settings
        </h3>
        
        <div className="space-y-4">
          <Checkbox
            label="Course Catalog Integration"
            description="Automatically sync with your institution's course catalog"
            checked={academicSettings?.courseCatalogIntegration}
            onChange={(e) => handleInputChange('courseCatalogIntegration', e?.target?.checked)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Database" size={20} className="text-primary" />
                <span className="font-medium text-foreground">Data Sync</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Last synced: December 9, 2024 at 10:30 AM
              </p>
              <Button variant="outline" size="sm" className="mt-2" iconName="RefreshCw">
                Sync Now
              </Button>
            </div>

            <div className="p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Icon name="Shield" size={20} className="text-success" />
                <span className="font-medium text-foreground">Data Privacy</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your academic data is encrypted and secure
              </p>
              <Button variant="outline" size="sm" className="mt-2" iconName="Eye">
                View Policy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicSettingsTab;