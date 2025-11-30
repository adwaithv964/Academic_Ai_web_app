import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const UserModal = ({ mode, user, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'student',
    status: 'active',
    major: '',
    class: '',
    department: '',
    level: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Initialize form data
  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'student',
        status: user?.status || 'active',
        major: user?.major || '',
        class: user?.class || '',
        department: user?.department || '',
        level: user?.level || ''
      });
    }
  }, [mode, user]);

  const roleOptions = [
    { value: 'student', label: 'Student' },
    { value: 'admin', label: 'Admin' },
    { value: 'instructor', label: 'Instructor' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const classOptions = [
    { value: '2025', label: 'Class of 2025' },
    { value: '2026', label: 'Class of 2026' },
    { value: '2027', label: 'Class of 2027' },
    { value: '2028', label: 'Class of 2028' }
  ];

  const majorOptions = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Biology', label: 'Biology' },
    { value: 'Chemistry', label: 'Chemistry' },
    { value: 'Engineering', label: 'Engineering' }
  ];

  const departmentOptions = [
    { value: 'Computer Science', label: 'Computer Science' },
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Physics', label: 'Physics' },
    { value: 'Biology', label: 'Biology' },
    { value: 'Administration', label: 'Administration' }
  ];

  const levelOptions = [
    { value: 'Professor', label: 'Professor' },
    { value: 'Associate Professor', label: 'Associate Professor' },
    { value: 'Assistant Professor', label: 'Assistant Professor' },
    { value: 'Lecturer', label: 'Lecturer' },
    { value: 'Administrator', label: 'Administrator' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.role) {
      newErrors.role = 'Role is required';
    }

    // Role-specific validation
    if (formData?.role === 'student') {
      if (!formData?.major?.trim()) {
        newErrors.major = 'Major is required for students';
      }
      if (!formData?.class?.trim()) {
        newErrors.class = 'Class is required for students';
      }
    }

    if (formData?.role === 'admin' || formData?.role === 'instructor') {
      if (!formData?.department?.trim()) {
        newErrors.department = 'Department is required for admin/instructor';
      }
      if (!formData?.level?.trim()) {
        newErrors.level = 'Level is required for admin/instructor';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSubmit?.(formData);
    } catch (error) {
      console.error('Failed to save user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose?.();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {mode === 'create' ? 'Add New User' : 'Edit User'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/50 rounded-lg transition-academic"
          >
            <Icon name="X" size={20} className="text-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                required
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                error={errors?.name}
                placeholder="Enter full name"
              />
              
              <Input
                label="Email Address"
                type="email"
                required
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                error={errors?.email}
                placeholder="Enter email address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Role"
                required
                value={formData?.role}
                onChange={(value) => handleInputChange('role', value)}
                options={roleOptions}
                error={errors?.role}
              />
              
              <Select
                label="Status"
                value={formData?.status}
                onChange={(value) => handleInputChange('status', value)}
                options={statusOptions}
              />
            </div>

            {/* Role-specific fields */}
            {formData?.role === 'student' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">Student Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Major"
                    required
                    value={formData?.major}
                    onChange={(value) => handleInputChange('major', value)}
                    options={majorOptions}
                    error={errors?.major}
                    searchable
                  />
                  
                  <Select
                    label="Class"
                    required
                    value={formData?.class}
                    onChange={(value) => handleInputChange('class', value)}
                    options={classOptions}
                    error={errors?.class}
                  />
                </div>
              </div>
            )}

            {(formData?.role === 'admin' || formData?.role === 'instructor') && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground">
                  {formData?.role === 'admin' ? 'Administrator' : 'Instructor'} Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Department"
                    required
                    value={formData?.department}
                    onChange={(value) => handleInputChange('department', value)}
                    options={departmentOptions}
                    error={errors?.department}
                    searchable
                  />
                  
                  <Select
                    label="Level"
                    required
                    value={formData?.level}
                    onChange={(value) => handleInputChange('level', value)}
                    options={levelOptions}
                    error={errors?.level}
                  />
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={loading}
            iconName="Save"
          >
            {mode === 'create' ? 'Create User' : 'Update User'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default UserModal;