import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

import Icon from '../../../components/AppIcon';

const SecurityTab = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);
  const [errors, setErrors] = useState({});

  const activeSessions = [
    {
      id: 1,
      device: "Chrome on Windows",
      location: "New York, NY",
      ipAddress: "192.168.1.100",
      lastActive: "2024-12-09T10:30:00Z",
      current: true
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "New York, NY",
      ipAddress: "192.168.1.101",
      lastActive: "2024-12-08T15:45:00Z",
      current: false
    },
    {
      id: 3,
      device: "Chrome on MacBook",
      location: "New York, NY",
      ipAddress: "192.168.1.102",
      lastActive: "2024-12-07T09:20:00Z",
      current: false
    }
  ];

  const loginHistory = [
    {
      id: 1,
      timestamp: "2024-12-09T10:30:00Z",
      device: "Chrome on Windows",
      location: "New York, NY",
      status: "success"
    },
    {
      id: 2,
      timestamp: "2024-12-08T15:45:00Z",
      device: "Safari on iPhone",
      location: "New York, NY",
      status: "success"
    },
    {
      id: 3,
      timestamp: "2024-12-07T09:20:00Z",
      device: "Chrome on MacBook",
      location: "New York, NY",
      status: "success"
    },
    {
      id: 4,
      timestamp: "2024-12-06T14:15:00Z",
      device: "Unknown Device",
      location: "Unknown Location",
      status: "failed"
    }
  ];

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
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

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData?.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData?.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData?.newPassword?.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (passwordData?.newPassword !== passwordData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handlePasswordSubmit = async () => {
    if (!validatePasswordForm()) return;
    
    setIsChangingPassword(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    alert('Password changed successfully!');
  };

  const handleEnable2FA = async () => {
    setIsEnabling2FA(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockBackupCodes = [
      "ABC123DEF456",
      "GHI789JKL012",
      "MNO345PQR678",
      "STU901VWX234",
      "YZA567BCD890"
    ];
    
    setTwoFactorEnabled(true);
    setBackupCodes(mockBackupCodes);
    setShowBackupCodes(true);
    setIsEnabling2FA(false);
    
    alert('Two-factor authentication enabled successfully!');
  };

  const handleDisable2FA = async () => {
    if (confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      setTwoFactorEnabled(false);
      setBackupCodes([]);
      setShowBackupCodes(false);
      alert('Two-factor authentication disabled.');
    }
  };

  const handleTerminateSession = async (sessionId) => {
    if (confirm('Are you sure you want to terminate this session?')) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Session terminated successfully.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleString();
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength++;
    if (/[A-Z]/?.test(password)) strength++;
    if (/[a-z]/?.test(password)) strength++;
    if (/[0-9]/?.test(password)) strength++;
    if (/[^A-Za-z0-9]/?.test(password)) strength++;
    
    const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['text-error', 'text-warning', 'text-accent', 'text-secondary', 'text-success'];
    
    return {
      level: levels?.[strength] || 'Very Weak',
      color: colors?.[strength] || 'text-error',
      score: strength
    };
  };

  const passwordStrength = getPasswordStrength(passwordData?.newPassword);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-foreground">Security Settings</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account security and authentication settings
        </p>
      </div>
      {/* Password Change */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="Lock" size={20} className="text-primary" />
          Change Password
        </h3>
        
        <div className="space-y-4 max-w-md">
          <Input
            label="Current Password"
            type="password"
            value={passwordData?.currentPassword}
            onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
            error={errors?.currentPassword}
            placeholder="Enter your current password"
            required
          />

          <Input
            label="New Password"
            type="password"
            value={passwordData?.newPassword}
            onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
            error={errors?.newPassword}
            placeholder="Enter your new password"
            required
          />

          {passwordData?.newPassword && (
            <div className="text-sm">
              <span className="text-muted-foreground">Password strength: </span>
              <span className={passwordStrength?.color}>{passwordStrength?.level}</span>
              <div className="w-full bg-muted rounded-full h-2 mt-1">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    passwordStrength?.score <= 1 ? 'bg-error' :
                    passwordStrength?.score <= 2 ? 'bg-warning' :
                    passwordStrength?.score <= 3 ? 'bg-accent' :
                    passwordStrength?.score <= 4 ? 'bg-secondary' : 'bg-success'
                  }`}
                  style={{ width: `${(passwordStrength?.score / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData?.confirmPassword}
            onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
            error={errors?.confirmPassword}
            placeholder="Confirm your new password"
            required
          />

          <Button
            variant="default"
            onClick={handlePasswordSubmit}
            loading={isChangingPassword}
            iconName="Save"
            iconPosition="left"
          >
            Change Password
          </Button>
        </div>
      </div>
      {/* Two-Factor Authentication */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="Shield" size={20} className="text-secondary" />
          Two-Factor Authentication
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <p className="font-medium text-foreground">
                Two-Factor Authentication {twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </p>
              <p className="text-sm text-muted-foreground">
                {twoFactorEnabled 
                  ? 'Your account is protected with 2FA' :'Add an extra layer of security to your account'
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${twoFactorEnabled ? 'bg-success' : 'bg-muted'}`} />
              {twoFactorEnabled ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisable2FA}
                  iconName="ShieldOff"
                >
                  Disable
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleEnable2FA}
                  loading={isEnabling2FA}
                  iconName="Shield"
                >
                  Enable 2FA
                </Button>
              )}
            </div>
          </div>

          {showBackupCodes && backupCodes?.length > 0 && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                Backup Codes
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-sm">
                {backupCodes?.map((code, index) => (
                  <div key={index} className="p-2 bg-card border border-border rounded">
                    {code}
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setShowBackupCodes(false)}
                iconName="EyeOff"
              >
                Hide Codes
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Active Sessions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="Monitor" size={20} className="text-accent" />
          Active Sessions
        </h3>
        
        <div className="space-y-3">
          {activeSessions?.map((session) => (
            <div key={session?.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="Monitor" size={20} className="text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">
                    {session?.device}
                    {session?.current && (
                      <span className="ml-2 text-xs bg-success text-success-foreground px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session?.location} • {session?.ipAddress}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last active: {formatDate(session?.lastActive)}
                  </p>
                </div>
              </div>
              {!session?.current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTerminateSession(session?.id)}
                  iconName="X"
                >
                  Terminate
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Login History */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <Icon name="History" size={20} className="text-success" />
          Recent Login Activity
        </h3>
        
        <div className="space-y-3">
          {loginHistory?.map((login) => (
            <div key={login?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon 
                  name={login?.status === 'success' ? 'CheckCircle' : 'XCircle'} 
                  size={16} 
                  className={login?.status === 'success' ? 'text-success' : 'text-error'} 
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {login?.device}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {login?.location} • {formatDate(login?.timestamp)}
                  </p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${
                login?.status === 'success' ?'bg-success/10 text-success' :'bg-error/10 text-error'
              }`}>
                {login?.status === 'success' ? 'Success' : 'Failed'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityTab;