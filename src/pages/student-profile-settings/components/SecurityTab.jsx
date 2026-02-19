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


  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [errors, setErrors] = useState({});



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

    
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsChangingPassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    alert('Password changed successfully!');
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
                  className={`h-2 rounded-full transition-all ${passwordStrength?.score <= 1 ? 'bg-error' :
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


    </div>
  );
};

export default SecurityTab;