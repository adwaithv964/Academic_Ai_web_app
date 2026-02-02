import React, { useState } from 'react';
import axios from 'axios';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const AcademicSettingsTab = () => {
  const defaultSettings = {
    currentGPA: "8.5",
    gpaScale: "10.0",
    targetGPA: "9.0",
    creditHours: "120",
    completedHours: "78",
    courseCatalogIntegration: true,
    gradeWeighting: "standard",
    semesterSystem: "semester",
    academicYear: "2024-2025"
  };

  const [academicSettings, setAcademicSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Fetch settings on load
  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get('/api/user');
        if (res.data && res.data.academicSettings) {
          // Merge defaults with fetched to ensure all fields exist
          setAcademicSettings({ ...defaultSettings, ...res.data.academicSettings });
        }
      } catch (err) {
        console.error("Failed to fetch academic settings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const gpaScaleOptions = [
    { value: "10.0", label: "10.0 Scale (A=10.0)" }
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

    try {
      await axios.post('/api/user', { academicSettings });
      alert('Academic settings updated successfully!');
    } catch (err) {
      console.error("Failed to save settings", err);
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
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

    </div>
  );
};

export default AcademicSettingsTab;