import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ selectedCount, onBulkAction, selectedUsers }) => {
  const [selectedAction, setSelectedAction] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const actionOptions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'activate', label: 'Activate Users', icon: 'CheckCircle', color: 'text-green-600' },
    { value: 'deactivate', label: 'Deactivate Users', icon: 'XCircle', color: 'text-orange-600' },
    { value: 'suspend', label: 'Suspend Users', icon: 'Ban', color: 'text-red-600' },
    { value: 'role-student', label: 'Change Role to Student', icon: 'User', color: 'text-blue-600' },
    { value: 'role-instructor', label: 'Change Role to Instructor', icon: 'BookOpen', color: 'text-purple-600' },
    { value: 'export', label: 'Export Selected', icon: 'Download', color: 'text-gray-600' },
    { value: 'delete', label: 'Delete Users', icon: 'Trash2', color: 'text-red-600' }
  ];

  const handleActionSubmit = () => {
    if (!selectedAction) return;

    // For dangerous actions, show confirmation
    if (['delete', 'suspend']?.includes(selectedAction)) {
      setIsConfirmModalOpen(true);
      return;
    }

    executeAction();
  };

  const executeAction = () => {
    switch (selectedAction) {
      case 'activate': onBulkAction?.('activate', selectedUsers);
        break;
      case 'deactivate': onBulkAction?.('deactivate', selectedUsers);
        break;
      case 'suspend': onBulkAction?.('suspend', selectedUsers);
        break;
      case 'role-student': onBulkAction?.('role-change', selectedUsers, 'student');
        break;
      case 'role-instructor': onBulkAction?.('role-change', selectedUsers, 'instructor');
        break;
      case 'export':
        onBulkAction?.('export', selectedUsers);
        break;
      case 'delete':
        onBulkAction?.('delete', selectedUsers);
        break;
      default:
        break;
    }

    setSelectedAction('');
    setIsConfirmModalOpen(false);
  };

  const getActionDetails = () => {
    const action = actionOptions?.find(opt => opt?.value === selectedAction);
    return action || {};
  };

  const confirmationMessages = {
    delete: `Are you sure you want to permanently delete ${selectedCount} user${selectedCount !== 1 ? 's' : ''}? This action cannot be undone.`,
    suspend: `Are you sure you want to suspend ${selectedCount} user${selectedCount !== 1 ? 's' : ''}? They will lose access to the system.`
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-primary/5 border border-primary/20 rounded-lg p-4"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Icon name="CheckSquare" size={20} className="text-primary" />
              <span className="font-medium text-foreground">
                {selectedCount} user{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>

            <div className="hidden sm:block h-4 w-px bg-border"></div>

            <div className="flex items-center gap-3">
              <Select
                value={selectedAction}
                onChange={setSelectedAction}
                options={actionOptions}
                placeholder="Choose action..."
                className="min-w-48"
              />

              <Button
                variant="default"
                size="sm"
                onClick={handleActionSubmit}
                disabled={!selectedAction}
                iconName="ArrowRight"
              >
                Apply
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Action Buttons */}
            <div className="hidden lg:flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                iconName="CheckCircle"
                onClick={() => onBulkAction?.('activate', selectedUsers)}
                className="text-green-600 hover:bg-green-50"
                title="Activate selected users"
              />
              
              <Button
                variant="ghost"
                size="sm"
                iconName="XCircle"
                onClick={() => onBulkAction?.('deactivate', selectedUsers)}
                className="text-orange-600 hover:bg-orange-50"
                title="Deactivate selected users"
              />
              
              <Button
                variant="ghost"
                size="sm"
                iconName="Download"
                onClick={() => onBulkAction?.('export', selectedUsers)}
                className="text-blue-600 hover:bg-blue-50"
                title="Export selected users"
              />
            </div>

            <div className="h-4 w-px bg-border"></div>

            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={() => onBulkAction?.('clear-selection', [])}
              className="text-muted-foreground hover:text-foreground"
              title="Clear selection"
            />
          </div>
        </div>

        {/* Mobile Quick Actions */}
        <div className="lg:hidden mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="xs"
              iconName="CheckCircle"
              onClick={() => onBulkAction?.('activate', selectedUsers)}
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              Activate
            </Button>
            
            <Button
              variant="outline"
              size="xs"
              iconName="XCircle"
              onClick={() => onBulkAction?.('deactivate', selectedUsers)}
              className="text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              Deactivate
            </Button>
            
            <Button
              variant="outline"
              size="xs"
              iconName="Download"
              onClick={() => onBulkAction?.('export', selectedUsers)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Export
            </Button>
          </div>
        </div>
      </motion.div>
      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-lg shadow-lg w-full max-w-md"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <Icon name="AlertTriangle" size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Confirm Action
                </h3>
              </div>

              <p className="text-muted-foreground mb-6">
                {confirmationMessages?.[selectedAction]}
              </p>

              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsConfirmModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={executeAction}
                  iconName={getActionDetails()?.icon}
                >
                  {selectedAction === 'delete' ? 'Delete' : 'Suspend'}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default BulkActionsBar;