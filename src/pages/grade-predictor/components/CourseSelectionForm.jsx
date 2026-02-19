import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CourseSelectionForm = ({ onPredict, isLoading, initialData }) => {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('grade_predictor_subjects');
    return saved ? JSON.parse(saved) : [];
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
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm relative overflow-hidden">
      {/* Decorative background glow - simplified for theme compatibility */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Icon name="Sparkles" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">AI Forecast</h2>
              <p className="text-sm text-muted-foreground">Smart prediction engine</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            onClick={() => setIsManaging(!isManaging)}
            iconName={isManaging ? "ChevronUp" : "Settings"}
          >
            {isManaging ? 'Close' : 'Manage Subjects'}
          </Button>
        </div>

        {isManaging && (
          <div className="mb-6 p-4 bg-muted/50 rounded-xl border border-border space-y-4 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-sm font-medium text-foreground">Manage Subjects</h3>
            <div className="flex gap-2">
              <Input
                placeholder="New Subject Name..."
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="bg-background border-border h-9 text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
              />
              <Button size="sm" onClick={handleAddSubject} iconName="Plus" disabled={!newSubject.trim()}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar">
              {subjects.map(sub => (
                <div key={sub.value} className="flex items-center gap-1 px-2 py-1 bg-background rounded-md border border-border text-xs text-foreground group hover:border-primary/50 transition-colors">
                  {sub.label}
                  <button
                    onClick={() => handleDeleteSubject(sub.value)}
                    className="ml-1 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
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
              className="bg-background border-border text-foreground"
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
              className="bg-background border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              Context & Notes <span className="text-xs text-primary">(Optional)</span>
            </label>
            <textarea
              value={formData.context}
              onChange={(e) => handleInputChange('context', e.target.value)}
              placeholder="e.g. 'I have a big final exam worth 40% coming up...'"
              className="w-full h-32 bg-background border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Our AI analyzes this text to adjust the simulation parameters.
            </p>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            loading={isLoading}
            disabled={!isFormValid}
            className="w-full shadow-lg shadow-primary/20 h-12 text-lg"
            iconName="Stars"
          >
            {isLoading ? 'Running Simulation...' : 'Generate AI Prediction'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CourseSelectionForm;