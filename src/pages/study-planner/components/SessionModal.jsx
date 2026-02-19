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
  selectedHour,
  currentDate, // Specific week context
  courses = [],
  onCourseCreate,
  onCourseDelete,
  onCourseUpdate
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    topic: '',
    startTime: '',
    duration: 1,
    priority: 'medium',
    notes: '',
    type: 'study'
  });

  const [errors, setErrors] = useState({});
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isManagingSubjects, setIsManagingSubjects] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [manageSearchTerm, setManageSearchTerm] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);

  useEffect(() => {
    if (session) {
      setFormData({
        subject: session?.subject || '',
        topic: session?.topic || '',
        startTime: session?.startTime || '',
        duration: session?.duration || 1,
        priority: session?.priority || 'medium',
        notes: session?.notes || '',
        type: session?.type || 'study'
      });
    } else if (selectedDay && selectedHour !== undefined) {
      setFormData(prev => ({
        ...prev,
        startTime: `${selectedHour?.toString()?.padStart(2, '0')}:00`
      }));
    }
  }, [session, selectedDay, selectedHour]);

  // Use dynamic courses if available, otherwise fallback
  const subjectOptions = courses.length > 0
    ? courses.map(c => ({ value: c.name, label: c.name }))
    : [
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

  const handleCreateSubject = async () => {
    if (!newSubjectName.trim()) return;

    setIsCreatingCourse(true);
    try {
      if (onCourseCreate) {
        await onCourseCreate(newSubjectName);
        setFormData(prev => ({ ...prev, subject: newSubjectName }));
        setIsAddingSubject(false);
        setNewSubjectName('');
      }
    } catch (err) {
      console.error("Failed to create subject", err);
    } finally {
      setIsCreatingCourse(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();

    if (!validateForm()) {
      return;
    }

    const sessionData = {
      ...formData,
      id: session?.id || Date.now(),
      date: (() => {
        if (selectedDay && currentDate) {
          // Calculate date based on selected day of the week
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          const targetDayIndex = days.indexOf(selectedDay);

          if (targetDayIndex !== -1) {
            // 1. Get start of current week (Monday)
            const weekStart = new Date(currentDate);
            const day = weekStart.getDay();
            const diff = (day === 0 ? -6 : 1) - day; // Adjust so Monday is start
            weekStart.setDate(weekStart.getDate() + diff);
            weekStart.setHours(0, 0, 0, 0); // Reset time

            // 2. Add target index days
            const targetDate = new Date(weekStart);
            targetDate.setDate(weekStart.getDate() + targetDayIndex);

            // Keep the time from startTime if possible, or T00:00:00.000Z
            // But here we return ISO string often for just the date part reference
            return targetDate.toISOString();
          }
        }
        return session?.date || new Date().toISOString();
      })(),
      createdAt: session?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(sessionData);
    onClose();
  };

  const handleDelete = () => {
    if (session && onDelete) {
      onDelete(session._id || session.id);
      onClose();
    }
  };

  const handleSubjectDelete = async (courseId) => {
    if (onCourseDelete) {
      if (confirm('Are you sure you want to delete this subject?')) {
        await onCourseDelete(courseId);
      }
    }
  };

  const startEditingSubject = (course) => {
    setEditingSubject({ id: course._id, name: course.name });
  };

  const saveSubjectEdit = async () => {
    if (editingSubject && editingSubject.name.trim() && onCourseUpdate) {
      await onCourseUpdate(editingSubject.id, { name: editingSubject.name });
      setEditingSubject(null);
    }
  };

  const cancelSubjectEdit = () => {
    setEditingSubject(null);
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
          className="bg-card rounded-lg border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">
              {isManagingSubjects ? 'Manage Subjects' : (session ? 'Edit Study Session' : 'New Study Session')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted/50 rounded-lg transition-academic"
            >
              <Icon name="X" size={20} className="text-muted-foreground" />
            </button>
          </div>

          {isManagingSubjects ? (
            <div className="space-y-4">
              <div className="relative">
                <Icon name="Search" size={16} className="absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search subjects..."
                  value={manageSearchTerm}
                  onChange={(e) => setManageSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                {courses
                  .filter(c => c.name.toLowerCase().includes(manageSearchTerm.toLowerCase()))
                  .map(course => (
                    <div key={course._id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border group hover:bg-muted/50 transition-colors">
                      {editingSubject?.id === course._id ? (
                        <div className="flex gap-2 flex-1 mr-2">
                          <Input
                            value={editingSubject.name}
                            onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                            className="h-8 text-sm"
                            autoFocus
                          />
                          <Button size="icon" className="h-8 w-8" onClick={saveSubjectEdit}><Icon name="Check" size={14} /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={cancelSubjectEdit}><Icon name="X" size={14} /></Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${course.color?.split(' ')[0] || 'bg-gray-400'}`}></div>
                            <span className="font-medium text-sm">{course.name}</span>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-primary"
                              onClick={() => startEditingSubject(course)}
                            >
                              <Icon name="Edit2" size={14} />
                            </Button>
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => handleSubjectDelete(course._id)}
                            >
                              <Icon name="Trash" size={14} />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                {courses.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No subjects found
                  </div>
                )}
              </div>
              <Button type="button" variant="outline" className="w-full" onClick={() => setIsManagingSubjects(false)}>
                Done
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  {isAddingSubject ? (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">New Subject</label>
                      <div className="flex gap-2">
                        <Input
                          value={newSubjectName}
                          onChange={(e) => setNewSubjectName(e.target.value)}
                          placeholder="Subject Name"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          size="icon"
                          onClick={handleCreateSubject}
                          disabled={isCreatingCourse}
                        >
                          <Icon name="Check" size={16} />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          onClick={() => setIsAddingSubject(false)}
                        >
                          <Icon name="X" size={16} />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Select
                        label="Subject"
                        options={subjectOptions}
                        value={formData?.subject}
                        onChange={(value) => handleChange('subject', value)}
                        error={errors?.subject}
                        required
                      />
                      <div className="flex flex-col gap-1 mt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingSubject(true)}
                          className="text-xs text-primary hover:underline flex items-center gap-2 px-1 py-1 rounded hover:bg-primary/5 transition-colors w-full"
                        >
                          <Icon name="Plus" size={14} />
                          <span>Add New Subject</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsManagingSubjects(true)}
                          className="text-xs text-muted-foreground hover:text-foreground hover:underline flex items-center gap-2 px-1 py-1 rounded hover:bg-muted/50 transition-colors w-full"
                        >
                          <Icon name="Settings" size={14} />
                          <span>Manage Subjects</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

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

              <Select
                label="Priority"
                options={priorityOptions}
                value={formData?.priority}
                onChange={(value) => handleChange('priority', value)}
              />

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
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SessionModal;