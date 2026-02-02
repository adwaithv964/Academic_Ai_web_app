import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import { useClock } from '../../../contexts/ClockContext';

import { user as userApi } from '../../../services/api';

const PreferencesTab = () => {
  const defaultPreferences = {
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
    timezone: "Asia/Kolkata",
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
  };

  const [preferences, setPreferences] = useState(defaultPreferences);

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const userData = await userApi.get();
        if (userData && userData.preferences) {
          // Merge backend preferences into state
          setPreferences(prev => ({
            ...prev,
            ...(userData.preferences.notifications || {}),
            ...(userData.preferences.display || {}),
            ...(userData.preferences.privacy || {})
          }));
        }
      } catch (error) {
        console.error("Failed to load preferences:", error);
      }
    };
    fetchPreferences();
  }, []);

  const { currentTime } = useClock();

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: preferences.timezone
  }).format(currentTime);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: preferences.timeFormat === '12',
    timeZone: preferences.timezone
  }).format(currentTime);

  const [isSaving, setIsSaving] = useState(false);

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "zh", label: "中文" }
  ];

  const timezoneOptions = [
    { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
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
    { value: "progress", label: "Progress Tracker" },
    { value: "study-planner", label: "Study Planner" },
    { value: "todo-list", label: "To-Do List" }
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
    try {
      // Construct the nested object matching User schema
      const payload = {
        preferences: {
          notifications: {
            deadlineReminders: preferences.deadlineReminders,
            gradeUpdates: preferences.gradeUpdates,
            peerHelpResponses: preferences.peerHelpResponses,
            studySessionReminders: preferences.studySessionReminders,
            weeklyProgressReports: preferences.weeklyProgressReports,
            emailNotifications: preferences.emailNotifications,
            pushNotifications: preferences.pushNotifications,
            smsNotifications: preferences.smsNotifications
          },
          display: {
            language: preferences.language,
            timezone: preferences.timezone,
            dateFormat: preferences.dateFormat,
            timeFormat: preferences.timeFormat,
            defaultView: preferences.defaultView,
            showQuickStats: preferences.showQuickStats,
            showUpcomingDeadlines: preferences.showUpcomingDeadlines,
            showRecentGrades: preferences.showRecentGrades,
            compactMode: preferences.compactMode
          },
          privacy: {
            profileVisibility: preferences.profileVisibility,
            progressSharing: preferences.progressSharing,
            studyGroupVisibility: preferences.studyGroupVisibility,
            allowPeerMessages: preferences.allowPeerMessages
          }
        }
      };

      await userApi.update(payload);
      alert('Preferences updated successfully!');
    } catch (error) {
      console.error("Failed to save preferences:", error);
      alert("Failed to save preferences. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = () => {
    setPreferences(defaultPreferences);
    alert('Preferences reset to defaults (not saved yet).');
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


        </div>
      </div>
      {/* Display Preferences */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="Monitor" size={20} className="text-secondary" />
          Display Preferences
        </h3>

        <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-foreground">System Time</h4>
            <p className="text-xs text-muted-foreground">Current time used for all calculations</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded border border-border">
              <Icon name="Calendar" size={16} className="text-primary" />
              <span className="font-mono text-sm font-medium text-foreground">
                {formattedDate}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-background rounded border border-border">
              <Icon name="Clock" size={16} className="text-primary" />
              <span className="font-mono text-sm font-medium text-foreground">
                {formattedTime}
              </span>
            </div>
          </div>
        </div>

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


    </div>
  );
};

export default PreferencesTab;