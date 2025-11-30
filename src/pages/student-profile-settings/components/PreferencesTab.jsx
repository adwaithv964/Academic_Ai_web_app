import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const PreferencesTab = () => {
  const [preferences, setPreferences] = useState({
    // Notification preferences
    deadlineReminders: true,
    gradeUpdates: true,
    peerHelpResponses: true,
    studySessionReminders: true,
    weeklyProgressReports: false,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    
    // Display preferences
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12",
    
    // Dashboard preferences
    defaultView: "overview",
    showQuickStats: true,
    showUpcomingDeadlines: true,
    showRecentGrades: true,
    compactMode: false,
    
    // Privacy preferences
    profileVisibility: "friends",
    progressSharing: true,
    studyGroupVisibility: true,
    allowPeerMessages: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "zh", label: "中文" }
  ];

  const timezoneOptions = [
    { value: "America/New_York", label: "Eastern Time (ET)" },
    { value: "America/Chicago", label: "Central Time (CT)" },
    { value: "America/Denver", label: "Mountain Time (MT)" },
    { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
    { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
    { value: "Europe/Paris", label: "Central European Time (CET)" }
  ];

  const dateFormatOptions = [
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY (12/09/2024)" },
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY (09/12/2024)" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD (2024-12-09)" }
  ];

  const timeFormatOptions = [
    { value: "12", label: "12-hour (2:30 PM)" },
    { value: "24", label: "24-hour (14:30)" }
  ];

  const defaultViewOptions = [
    { value: "overview", label: "Overview Dashboard" },
    { value: "grades", label: "Grades View" },
    { value: "calendar", label: "Calendar View" },
    { value: "progress", label: "Progress Tracker" }
  ];

  const profileVisibilityOptions = [
    { value: "public", label: "Public - Everyone can see" },
    { value: "friends", label: "Friends Only" },
    { value: "private", label: "Private - Only me" }
  ];

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    alert('Preferences updated successfully!');
  };

  const resetToDefaults = () => {
    setPreferences({
      deadlineReminders: true,
      gradeUpdates: true,
      peerHelpResponses: true,
      studySessionReminders: true,
      weeklyProgressReports: false,
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      language: "en",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12",
      defaultView: "overview",
      showQuickStats: true,
      showUpcomingDeadlines: true,
      showRecentGrades: true,
      compactMode: false,
      profileVisibility: "friends",
      progressSharing: true,
      studyGroupVisibility: true,
      allowPeerMessages: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Preferences</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Customize your experience and notification settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            iconName="RotateCcw"
            iconPosition="left"
          >
            Reset to Defaults
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            loading={isSaving}
            iconName="Save"
            iconPosition="left"
          >
            Save Preferences
          </Button>
        </div>
      </div>
      {/* Notification Preferences */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="Bell" size={20} className="text-primary" />
          Notification Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Academic Notifications</h4>
            
            <Checkbox
              label="Deadline Reminders"
              description="Get notified about upcoming assignment deadlines"
              checked={preferences?.deadlineReminders}
              onChange={(e) => handlePreferenceChange('deadlineReminders', e?.target?.checked)}
            />

            <Checkbox
              label="Grade Updates"
              description="Receive notifications when new grades are posted"
              checked={preferences?.gradeUpdates}
              onChange={(e) => handlePreferenceChange('gradeUpdates', e?.target?.checked)}
            />

            <Checkbox
              label="Study Session Reminders"
              description="Get reminded about scheduled study sessions"
              checked={preferences?.studySessionReminders}
              onChange={(e) => handlePreferenceChange('studySessionReminders', e?.target?.checked)}
            />

            <Checkbox
              label="Weekly Progress Reports"
              description="Receive weekly summaries of your academic progress"
              checked={preferences?.weeklyProgressReports}
              onChange={(e) => handlePreferenceChange('weeklyProgressReports', e?.target?.checked)}
            />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Delivery Methods</h4>
            
            <Checkbox
              label="Email Notifications"
              description="Receive notifications via email"
              checked={preferences?.emailNotifications}
              onChange={(e) => handlePreferenceChange('emailNotifications', e?.target?.checked)}
            />

            <Checkbox
              label="Push Notifications"
              description="Get browser push notifications"
              checked={preferences?.pushNotifications}
              onChange={(e) => handlePreferenceChange('pushNotifications', e?.target?.checked)}
            />

            <Checkbox
              label="SMS Notifications"
              description="Receive important alerts via text message"
              checked={preferences?.smsNotifications}
              onChange={(e) => handlePreferenceChange('smsNotifications', e?.target?.checked)}
            />

            <Checkbox
              label="Peer Help Responses"
              description="Get notified when someone responds to your questions"
              checked={preferences?.peerHelpResponses}
              onChange={(e) => handlePreferenceChange('peerHelpResponses', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Display Preferences */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="Monitor" size={20} className="text-secondary" />
          Display Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Select
              label="Language"
              options={languageOptions}
              value={preferences?.language}
              onChange={(value) => handlePreferenceChange('language', value)}
              placeholder="Select language"
            />

            <Select
              label="Timezone"
              options={timezoneOptions}
              value={preferences?.timezone}
              onChange={(value) => handlePreferenceChange('timezone', value)}
              placeholder="Select timezone"
              searchable
            />

            <Select
              label="Date Format"
              options={dateFormatOptions}
              value={preferences?.dateFormat}
              onChange={(value) => handlePreferenceChange('dateFormat', value)}
              placeholder="Select date format"
            />
          </div>

          <div className="space-y-4">
            <Select
              label="Time Format"
              options={timeFormatOptions}
              value={preferences?.timeFormat}
              onChange={(value) => handlePreferenceChange('timeFormat', value)}
              placeholder="Select time format"
            />

            <Select
              label="Default Dashboard View"
              options={defaultViewOptions}
              value={preferences?.defaultView}
              onChange={(value) => handlePreferenceChange('defaultView', value)}
              placeholder="Select default view"
            />

            <Checkbox
              label="Compact Mode"
              description="Use a more compact layout to show more information"
              checked={preferences?.compactMode}
              onChange={(e) => handlePreferenceChange('compactMode', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Dashboard Preferences */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="LayoutDashboard" size={20} className="text-accent" />
          Dashboard Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Checkbox
              label="Show Quick Stats"
              description="Display GPA and progress statistics on dashboard"
              checked={preferences?.showQuickStats}
              onChange={(e) => handlePreferenceChange('showQuickStats', e?.target?.checked)}
            />

            <Checkbox
              label="Show Upcoming Deadlines"
              description="Display upcoming assignment deadlines"
              checked={preferences?.showUpcomingDeadlines}
              onChange={(e) => handlePreferenceChange('showUpcomingDeadlines', e?.target?.checked)}
            />
          </div>

          <div className="space-y-4">
            <Checkbox
              label="Show Recent Grades"
              description="Display recently updated grades on dashboard"
              checked={preferences?.showRecentGrades}
              onChange={(e) => handlePreferenceChange('showRecentGrades', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Privacy Preferences */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="Shield" size={20} className="text-success" />
          Privacy Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Select
              label="Profile Visibility"
              options={profileVisibilityOptions}
              value={preferences?.profileVisibility}
              onChange={(value) => handlePreferenceChange('profileVisibility', value)}
              placeholder="Select visibility level"
            />

            <Checkbox
              label="Progress Sharing"
              description="Allow classmates to see your academic progress"
              checked={preferences?.progressSharing}
              onChange={(e) => handlePreferenceChange('progressSharing', e?.target?.checked)}
            />
          </div>

          <div className="space-y-4">
            <Checkbox
              label="Study Group Visibility"
              description="Show your participation in study groups"
              checked={preferences?.studyGroupVisibility}
              onChange={(e) => handlePreferenceChange('studyGroupVisibility', e?.target?.checked)}
            />

            <Checkbox
              label="Allow Peer Messages"
              description="Let other students send you direct messages"
              checked={preferences?.allowPeerMessages}
              onChange={(e) => handlePreferenceChange('allowPeerMessages', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesTab;