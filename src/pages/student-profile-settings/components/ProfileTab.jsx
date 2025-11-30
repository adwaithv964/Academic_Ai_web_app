import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ProfileTab = () => {
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@university.edu",
    studentId: "STU2024001",
    institution: "University of Technology",
    major: "Computer Science",
    graduationYear: "2026",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "2002-03-15",
    address: "123 Campus Drive, University City, UC 12345"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const institutionOptions = [
    { value: "university-of-technology", label: "University of Technology" },
    { value: "state-university", label: "State University" },
    { value: "community-college", label: "Community College" },
    { value: "technical-institute", label: "Technical Institute" }
  ];

  const majorOptions = [
    { value: "computer-science", label: "Computer Science" },
    { value: "engineering", label: "Engineering" },
    { value: "mathematics", label: "Mathematics" },
    { value: "physics", label: "Physics" },
    { value: "chemistry", label: "Chemistry" },
    { value: "biology", label: "Biology" },
    { value: "business", label: "Business Administration" },
    { value: "psychology", label: "Psychology" }
  ];

  const graduationYearOptions = [
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
    { value: "2027", label: "2027" },
    { value: "2028", label: "2028" }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData?.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!profileData?.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!profileData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(profileData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!profileData?.studentId?.trim()) {
      newErrors.studentId = 'Student ID is required';
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
    setIsEditing(false);
    
    // Show success message (in real app, use toast notification)
    alert('Profile updated successfully!');
  };

  const handleCancel = () => {
    // Reset form data to original values
    setProfileData({
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@university.edu",
      studentId: "STU2024001",
      institution: "University of Technology",
      major: "Computer Science",
      graduationYear: "2026",
      phone: "+1 (555) 123-4567",
      dateOfBirth: "2002-03-15",
      address: "123 Campus Drive, University City, UC 12345"
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your personal details and academic information
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                loading={isSaving}
                iconName="Save"
                iconPosition="left"
              >
                Save Changes
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              iconName="Edit"
              iconPosition="left"
            >
              Edit Profile
            </Button>
          )}
        </div>
      </div>
      {/* Profile Form */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground mb-4">Basic Information</h3>
            
            <Input
              label="First Name"
              type="text"
              value={profileData?.firstName}
              onChange={(e) => handleInputChange('firstName', e?.target?.value)}
              disabled={!isEditing}
              required
              error={errors?.firstName}
              placeholder="Enter your first name"
            />

            <Input
              label="Last Name"
              type="text"
              value={profileData?.lastName}
              onChange={(e) => handleInputChange('lastName', e?.target?.value)}
              disabled={!isEditing}
              required
              error={errors?.lastName}
              placeholder="Enter your last name"
            />

            <Input
              label="Email Address"
              type="email"
              value={profileData?.email}
              onChange={(e) => handleInputChange('email', e?.target?.value)}
              disabled={!isEditing}
              required
              error={errors?.email}
              placeholder="Enter your email address"
            />

            <Input
              label="Phone Number"
              type="tel"
              value={profileData?.phone}
              onChange={(e) => handleInputChange('phone', e?.target?.value)}
              disabled={!isEditing}
              placeholder="Enter your phone number"
            />

            <Input
              label="Date of Birth"
              type="date"
              value={profileData?.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e?.target?.value)}
              disabled={!isEditing}
            />
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground mb-4">Academic Information</h3>
            
            <Input
              label="Student ID"
              type="text"
              value={profileData?.studentId}
              onChange={(e) => handleInputChange('studentId', e?.target?.value)}
              disabled={!isEditing}
              required
              error={errors?.studentId}
              placeholder="Enter your student ID"
            />

            <Select
              label="Institution"
              options={institutionOptions}
              value={profileData?.institution}
              onChange={(value) => handleInputChange('institution', value)}
              disabled={!isEditing}
              placeholder="Select your institution"
            />

            <Select
              label="Major"
              options={majorOptions}
              value={profileData?.major}
              onChange={(value) => handleInputChange('major', value)}
              disabled={!isEditing}
              placeholder="Select your major"
              searchable
            />

            <Select
              label="Expected Graduation Year"
              options={graduationYearOptions}
              value={profileData?.graduationYear}
              onChange={(value) => handleInputChange('graduationYear', value)}
              disabled={!isEditing}
              placeholder="Select graduation year"
            />

            <Input
              label="Address"
              type="text"
              value={profileData?.address}
              onChange={(e) => handleInputChange('address', e?.target?.value)}
              disabled={!isEditing}
              placeholder="Enter your address"
            />
          </div>
        </div>
      </div>
      {/* Profile Stats */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Profile Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Icon name="Calendar" size={24} className="text-primary mx-auto mb-2" />
            <p className="text-2xl font-semibold text-foreground">2.5</p>
            <p className="text-sm text-muted-foreground">Years Enrolled</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Icon name="BookOpen" size={24} className="text-secondary mx-auto mb-2" />
            <p className="text-2xl font-semibold text-foreground">24</p>
            <p className="text-sm text-muted-foreground">Courses Completed</p>
          </div>
          <div className="text-center p-4 bg-muted/30 rounded-lg">
            <Icon name="Award" size={24} className="text-accent mx-auto mb-2" />
            <p className="text-2xl font-semibold text-foreground">3.7</p>
            <p className="text-sm text-muted-foreground">Current GPA</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;