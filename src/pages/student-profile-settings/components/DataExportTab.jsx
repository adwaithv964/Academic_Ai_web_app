import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const DataExportTab = () => {
  const [exportSettings, setExportSettings] = useState({
    includeGrades: true,
    includeProgress: true,
    includeStudySessions: true,
    includePeerHelp: false,
    includeSettings: false,
    includeLoginHistory: false,
    format: 'json',
    dateRange: 'all'
  });

  const [isExporting, setIsExporting] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  const formatOptions = [
    { value: 'json', label: 'JSON Format' },
    { value: 'csv', label: 'CSV Format' },
    { value: 'pdf', label: 'PDF Report' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'current-year', label: 'Current Academic Year' },
    { value: 'last-semester', label: 'Last Semester' },
    { value: 'last-30-days', label: 'Last 30 Days' }
  ];

  const dataCategories = [
    {
      key: 'includeGrades',
      label: 'Academic Grades',
      description: 'All your grades, GPA calculations, and academic performance data',
      icon: 'TrendingUp',
      size: '2.3 MB'
    },
    {
      key: 'includeProgress',
      label: 'Progress Tracking',
      description: 'Historical progress data, charts, and analytics',
      icon: 'BarChart3',
      size: '1.8 MB'
    },
    {
      key: 'includeStudySessions',
      label: 'Study Sessions',
      description: 'Study planner data, session logs, and scheduling information',
      icon: 'Calendar',
      size: '0.9 MB'
    },
    {
      key: 'includePeerHelp',
      label: 'Peer Help Activity',
      description: 'Forum posts, questions, answers, and peer interactions',
      icon: 'MessageSquare',
      size: '0.5 MB'
    },
    {
      key: 'includeSettings',
      label: 'Account Settings',
      description: 'Profile settings, preferences, and configuration data',
      icon: 'Settings',
      size: '0.1 MB'
    },
    {
      key: 'includeLoginHistory',
      label: 'Login History',
      description: 'Account access logs and security information',
      icon: 'History',
      size: '0.2 MB'
    }
  ];

  const handleExportSettingChange = (key, value) => {
    setExportSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const calculateTotalSize = () => {
    let totalSize = 0;
    dataCategories?.forEach(category => {
      if (exportSettings?.[category?.key]) {
        totalSize += parseFloat(category?.size);
      }
    });
    return totalSize?.toFixed(1);
  };

  const handleExportData = async () => {
    const selectedCategories = dataCategories?.filter(cat => exportSettings?.[cat?.key]);

    if (selectedCategories?.length === 0) {
      alert('Please select at least one data category to export.');
      return;
    }

    setIsExporting(true);

    // Gather data from localStorage
    const exportData = {};

    if (exportSettings.includeSettings) {
      exportData.profile = JSON.parse(localStorage.getItem('studentProfile') || 'null');
      exportData.academicSettings = JSON.parse(localStorage.getItem('academicSettings') || 'null');
      exportData.preferences = JSON.parse(localStorage.getItem('userPreferences') || 'null');
    }

    if (exportSettings.includeGrades) {
      // In a real app, this would fetch grades. For now, we'll include a placeholder or any stored grade data
      exportData.grades = JSON.parse(localStorage.getItem('grades') || '[]');
    }

    if (exportSettings.includeStudySessions) {
      exportData.tasks = JSON.parse(localStorage.getItem('todoTasks') || '[]');
    }

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create downloadable file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `academic_data_export_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    setIsExporting(false);

    alert(`Data export completed! Your JSON file has been downloaded.`);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmationText !== 'DELETE MY ACCOUNT') {
      alert('Please type "DELETE MY ACCOUNT" to confirm account deletion.');
      return;
    }

    setIsDeletingAccount(true);

    // Simulate account deletion process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Clear all app data
    localStorage.clear();

    setIsDeletingAccount(false);
    alert('Your account and all associated data have been deleted.');

    // Redirect to home/login
    window.location.href = '/';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">Data Export & Account</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Export your data or manage your account deletion
        </p>
      </div>
      {/* Data Export Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="Download" size={20} className="text-primary" />
          Export Your Data
        </h3>

        <p className="text-sm text-muted-foreground mb-6">
          Download a copy of your academic data. This includes all the information associated with your account.
        </p>

        {/* Export Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Select
              label="Export Format"
              options={formatOptions}
              value={exportSettings?.format}
              onChange={(value) => handleExportSettingChange('format', value)}
              placeholder="Select format"
            />
          </div>
          <div>
            <Select
              label="Date Range"
              options={dateRangeOptions}
              value={exportSettings?.dateRange}
              onChange={(value) => handleExportSettingChange('dateRange', value)}
              placeholder="Select date range"
            />
          </div>
        </div>

        {/* Data Categories */}
        <div className="space-y-4 mb-6">
          <h4 className="font-medium text-foreground">Select Data to Export</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dataCategories?.map((category) => (
              <div key={category?.key} className="p-4 border border-border rounded-lg">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={exportSettings?.[category?.key]}
                    onChange={(e) => handleExportSettingChange(category?.key, e?.target?.checked)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon name={category?.icon} size={16} className="text-muted-foreground" />
                      <span className="font-medium text-foreground">{category?.label}</span>
                      <span className="text-xs text-muted-foreground">({category?.size})</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{category?.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Export Summary */}
        <div className="p-4 bg-muted/30 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Export Summary</p>
              <p className="text-sm text-muted-foreground">
                {dataCategories?.filter(cat => exportSettings?.[cat?.key])?.length} categories selected
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium text-foreground">Estimated Size</p>
              <p className="text-sm text-muted-foreground">{calculateTotalSize()} MB</p>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <Button
          variant="default"
          onClick={handleExportData}
          loading={isExporting}
          iconName="Download"
          iconPosition="left"
          disabled={dataCategories?.filter(cat => exportSettings?.[cat?.key])?.length === 0}
        >
          {isExporting ? 'Preparing Export...' : 'Export Data'}
        </Button>
      </div>
      {/* Account Deletion Section */}
      <div className="bg-card border border-error/20 rounded-lg p-6">
        <h3 className="text-lg font-medium text-error mb-4 flex items-center gap-2">
          <Icon name="AlertTriangle" size={20} className="text-error" />
          Delete Account
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-error/5 border border-error/20 rounded-lg">
            <h4 className="font-medium text-error mb-2">Warning: This action cannot be undone</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• All your academic data will be permanently deleted</li>
              <li>• Your grades, progress tracking, and study sessions will be lost</li>
              <li>• You will lose access to all peer help forum content</li>
              <li>• This action cannot be reversed</li>
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Before deleting your account, we recommend exporting your data using the export feature above.
              Account deletion may take up to 30 days to complete.
            </p>

            {!showDeleteConfirmation ? (
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirmation(true)}
                iconName="Trash2"
                iconPosition="left"
              >
                Delete My Account
              </Button>
            ) : (
              <div className="space-y-4 p-4 border border-error/20 rounded-lg">
                <p className="font-medium text-foreground">
                  Type "DELETE MY ACCOUNT" to confirm account deletion:
                </p>
                <input
                  type="text"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e?.target?.value)}
                  placeholder="Type DELETE MY ACCOUNT"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-error/20"
                />
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    loading={isDeletingAccount}
                    disabled={deleteConfirmationText !== 'DELETE MY ACCOUNT'}
                    iconName="Trash2"
                    iconPosition="left"
                  >
                    {isDeletingAccount ? 'Deleting Account...' : 'Confirm Deletion'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDeleteConfirmation(false);
                      setDeleteConfirmationText('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Data Retention Policy */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="Info" size={20} className="text-secondary" />
          Data Retention Policy
        </h3>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Academic Data:</strong> Grades and progress data are retained for 7 years after graduation or account deletion for academic record purposes.
          </p>
          <p>
            <strong className="text-foreground">Personal Information:</strong> Profile data is deleted within 30 days of account deletion request.
          </p>
          <p>
            <strong className="text-foreground">Usage Analytics:</strong> Anonymized usage data may be retained for service improvement purposes.
          </p>
          <p>
            <strong className="text-foreground">Legal Requirements:</strong> Some data may be retained longer if required by law or for legal proceedings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataExportTab;