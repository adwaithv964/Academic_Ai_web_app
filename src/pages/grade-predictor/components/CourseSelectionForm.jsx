import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CourseSelectionForm = ({ onPredict, isLoading, initialData }) => {
  const defaultSubjects = [
    { value: 'math', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'cs', label: 'Computer Science' },
    { value: 'literature', label: 'Literature' },
    { value: 'history', label: 'History' },
    { value: 'economics', label: 'Economics' }
  ];

  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('grade_predictor_subjects');
    return saved ? JSON.parse(saved) : defaultSubjects;
  });

  const [isManaging, setIsManaging] = useState(false);
  const [newSubject, setNewSubject] = useState('');

  const [formData, setFormData] = useState({
    course: '',
    currentGrade: '',
    context: ''
  });

  useEffect(() => {
    localStorage.setItem('grade_predictor_subjects', JSON.stringify(subjects));
  }, [subjects]);

  React.useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      const val = newSubject.toLowerCase().replace(/\s+/g, '-');
      const newSub = { value: val, label: newSubject.trim() };
      setSubjects(prev => [...prev, newSub]);
      setNewSubject('');
      // Auto-select the new subject
      handleInputChange('course', val);
    }
  };

  const handleDeleteSubject = (value) => {
    setSubjects(prev => prev.filter(s => s.value !== value));
    if (formData.course === value) {
      handleInputChange('course', '');
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (formData?.course && formData?.currentGrade) {
      // Find label for course or use raw value
      const selectedCourse = subjects.find(c => c.value === formData.course);

      onPredict({
        courseName: selectedCourse ? selectedCourse.label : formData.course,
        currentGrade: formData.currentGrade,
        context: formData.context
      });
    }
  };

  const isFormValid = formData.course && formData.currentGrade;

  return (
    <div className="bg-card/50 backdrop-blur-md rounded-xl border border-white/10 p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-primary to-violet-600 rounded-xl shadow-lg">
              <Icon name="Sparkles" size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Forecast</h2>
              <p className="text-sm text-gray-400">Smart prediction engine</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-white"
            onClick={() => setIsManaging(!isManaging)}
            iconName={isManaging ? "ChevronUp" : "Settings"}
          >
            {isManaging ? 'Close' : 'Manage Subjects'}
          </Button>
        </div>

        {isManaging && (
          <div className="mb-6 p-4 bg-black/40 rounded-xl border border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-sm font-medium text-white">Manage Subjects</h3>
            <div className="flex gap-2">
              <Input
                placeholder="New Subject Name..."
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="bg-black/20 border-white/10 h-9 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
              />
              <Button size="sm" onClick={handleAddSubject} iconName="Plus" disabled={!newSubject.trim()}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
              {subjects.map(sub => (
                <div key={sub.value} className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-md border border-white/10 text-xs text-gray-300 group hover:border-white/20">
                  {sub.label}
                  <button
                    onClick={() => handleDeleteSubject(sub.value)}
                    className="ml-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Course Subject"
              placeholder="Select Subject"
              options={subjects}
              value={formData.course}
              onChange={(value) => handleInputChange('course', value)}
              required
              className="bg-black/20 border-white/10 text-white placeholder:text-gray-500"
            />

            <Input
              label="Current Grade (%)"
              type="number"
              placeholder="85"
              value={formData.currentGrade}
              onChange={(e) => handleInputChange('currentGrade', e.target.value)}
              min="0"
              max="100"
              required
              className="bg-black/20 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
              Context & Notes <span className="text-xs text-primary">(Optional)</span>
            </label>
            <textarea
              value={formData.context}
              onChange={(e) => handleInputChange('context', e.target.value)}
              placeholder="e.g. 'I have a big final exam worth 40% coming up and I missed two weeks of class.'"
              className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-white placeholder:text-gray-600 focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all resize-none"
            />
            <p className="text-xs text-gray-500">
              Our AI analyzes this text to adjust the simulation parameters (volatility, remaining weight, trends).
            </p>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            loading={isLoading}
            disabled={!isFormValid}
            className="w-full bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 text-white shadow-lg shadow-primary/25 border-none h-12 text-lg"
            iconName="Stars"
          >
            {isLoading ? 'Running Simulation...' : 'Generate Prediction'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CourseSelectionForm;