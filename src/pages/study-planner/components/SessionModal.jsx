import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const SessionModal = ({ 
  isOpen, 
  onClose, 
  session, 
  onSave, 
  onDelete,
  selectedDay,
  selectedHour 
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    startTime: '',
    duration: 1,
    priority: 'medium',
    notes: '',
    location: '',
    type: 'study'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (session) {
      setFormData({
        subject: session?.subject || '',
        topic: session?.topic || '',
        startTime: session?.startTime || '',
        duration: session?.duration || 1,
        priority: session?.priority || 'medium',
        notes: session?.notes || '',
        location: session?.location || '',
        type: session?.type || 'study'
      });
    } else if (selectedDay && selectedHour !== undefined) {
      setFormData(prev => ({
        ...prev,
        startTime: `${selectedHour?.toString()?.padStart(2, '0')}:00`
      }));
    }
  }, [session, selectedDay, selectedHour]);

  const subjectOptions = [
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Biology', label: 'Biology' },
    { value: 'English', label: 'English' },
    { value: 'History', label: 'History' },
    { value: 'Computer Science', label: 'Computer Science' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' }
  ];

  const typeOptions = [
    { value: 'study', label: 'Study Session' },
    { value: 'review', label: 'Review Session' },
    { value: 'exam', label: 'Exam Preparation' },
    { value: 'assignment', label: 'Assignment Work' },
    { value: 'project', label: 'Project Work' }
  ];

  const durationOptions = [
    { value: 0.5, label: '30 minutes' },
    { value: 1, label: '1 hour' },
    { value: 1.5, label: '1.5 hours' },
    { value: 2, label: '2 hours' },
    { value: 2.5, label: '2.5 hours' },
    { value: 3, label: '3 hours' },
    { value: 4, label: '4 hours' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.subject?.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData?.topic?.trim()) {
      newErrors.topic = 'Topic is required';
    }
    
    if (!formData?.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const sessionData = {
      ...formData,
      id: session?.id || Date.now(),
      date: selectedDay ? new Date()?.toISOString() : session?.date,
      createdAt: session?.createdAt || new Date()?.toISOString(),
      updatedAt: new Date()?.toISOString()
    };

    onSave(sessionData);
    onClose();
  };

  const handleDelete = () => {
    if (session && onDelete) {
      onDelete(session?.id);
      onClose();
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-300 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-card rounded-lg border border-border w-full max-w-md max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">
              {session ? 'Edit Study Session' : 'New Study Session'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted/50 rounded-lg transition-academic"
            >
              <Icon name="X" size={20} className="text-muted-foreground" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Subject"
                options={subjectOptions}
                value={formData?.subject}
                onChange={(value) => handleChange('subject', value)}
                error={errors?.subject}
                required
              />
              
              <Select
                label="Session Type"
                options={typeOptions}
                value={formData?.type}
                onChange={(value) => handleChange('type', value)}
              />
            </div>

            <Input
              label="Topic"
              type="text"
              value={formData?.topic}
              onChange={(e) => handleChange('topic', e?.target?.value)}
              placeholder="What will you study?"
              error={errors?.topic}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Start Time"
                type="time"
                value={formData?.startTime}
                onChange={(e) => handleChange('startTime', e?.target?.value)}
                error={errors?.startTime}
                required
              />
              
              <Select
                label="Duration"
                options={durationOptions}
                value={formData?.duration}
                onChange={(value) => handleChange('duration', value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Priority"
                options={priorityOptions}
                value={formData?.priority}
                onChange={(value) => handleChange('priority', value)}
              />
              
              <Input
                label="Location"
                type="text"
                value={formData?.location}
                onChange={(e) => handleChange('location', e?.target?.value)}
                placeholder="Library, Room 101, etc."
              />
            </div>

            <Input
              label="Notes"
              type="text"
              value={formData?.notes}
              onChange={(e) => handleChange('notes', e?.target?.value)}
              placeholder="Additional notes or reminders..."
              description="Optional study notes or reminders"
            />

            {/* Actions */}
            <div className="flex items-center justify-between pt-4">
              <div>
                {session && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    iconName="Trash2"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  iconName="Save"
                >
                  {session ? 'Update' : 'Create'} Session
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SessionModal;