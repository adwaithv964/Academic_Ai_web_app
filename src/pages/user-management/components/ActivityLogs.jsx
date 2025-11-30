import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityLogs = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');

  const mockActivities = [
    {
      id: 1,
      type: 'user_created',
      user: 'Alice Johnson',
      action: 'Created new user account',
      details: 'Student • Computer Science',
      timestamp: new Date(Date.now() - 30 * 60000),
      actor: 'Dr. John Wilson'
    },
    {
      id: 2,
      type: 'user_login',
      user: 'Bob Smith',
      action: 'User logged in',
      details: 'IP: 192.168.1.100',
      timestamp: new Date(Date.now() - 45 * 60000),
      actor: 'Bob Smith'
    },
    {
      id: 3,
      type: 'user_updated',
      user: 'Carol Davis',
      action: 'Updated user profile',
      details: 'Changed major from Physics to Chemistry',
      timestamp: new Date(Date.now() - 90 * 60000),
      actor: 'Dr. John Wilson'
    },
    {
      id: 4,
      type: 'user_suspended',
      user: 'David Lee',
      action: 'User account suspended',
      details: 'Reason: Academic misconduct',
      timestamp: new Date(Date.now() - 120 * 60000),
      actor: 'Dr. John Wilson'
    },
    {
      id: 5,
      type: 'bulk_action',
      user: 'Multiple Users',
      action: 'Bulk activation performed',
      details: '5 users activated',
      timestamp: new Date(Date.now() - 180 * 60000),
      actor: 'Dr. John Wilson'
    },
    {
      id: 6,
      type: 'data_export',
      user: 'System',
      action: 'User data exported',
      details: 'CSV export • 25 records',
      timestamp: new Date(Date.now() - 240 * 60000),
      actor: 'Dr. John Wilson'
    },
    {
      id: 7,
      type: 'user_deleted',
      user: 'Test User',
      action: 'User account deleted',
      details: 'Inactive test account cleanup',
      timestamp: new Date(Date.now() - 300 * 60000),
      actor: 'Dr. John Wilson'
    }
  ];

  const getActivityIcon = (type) => {
    const iconMap = {
      user_created: { name: 'UserPlus', color: 'text-green-600' },
      user_login: { name: 'LogIn', color: 'text-blue-600' },
      user_updated: { name: 'Edit', color: 'text-orange-600' },
      user_suspended: { name: 'Ban', color: 'text-red-600' },
      user_deleted: { name: 'Trash2', color: 'text-red-600' },
      bulk_action: { name: 'Users', color: 'text-purple-600' },
      data_export: { name: 'Download', color: 'text-indigo-600' }
    };

    return iconMap?.[type] || { name: 'Activity', color: 'text-gray-600' };
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const timeframeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  return (
    <div className="bg-card rounded-lg border border-border h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground">Activity Logs</h3>
          <Button
            variant="ghost"
            size="sm"
            iconName="RotateCcw"
            onClick={() => window.location?.reload()}
            className="h-8 w-8 p-0"
          />
        </div>
        
        {/* Timeframe Selector */}
        <div className="flex items-center gap-1">
          {timeframeOptions?.map((option) => (
            <button
              key={option?.value}
              onClick={() => setSelectedTimeframe(option?.value)}
              className={`px-3 py-1 text-xs rounded-md transition-academic ${
                selectedTimeframe === option?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {option?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Activity List */}
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        <div className="p-4 space-y-4">
          {mockActivities?.map((activity, index) => (
            <motion.div
              key={activity?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
            >
              {/* Activity Icon */}
              <div className={`flex-shrink-0 p-1.5 rounded-full bg-muted/30 ${getActivityIcon(activity?.type)?.color}`}>
                <Icon 
                  name={getActivityIcon(activity?.type)?.name} 
                  size={12}
                />
              </div>

              {/* Activity Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground truncate">
                      {activity?.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      User: {activity?.user}
                    </p>
                    {activity?.details && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity?.details}
                      </p>
                    )}
                  </div>
                  
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTimeAgo(activity?.timestamp)}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-muted-foreground">
                    by {activity?.actor}
                  </p>
                  
                  {/* Quick Action Button */}
                  {activity?.type === 'user_login' && (
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="MapPin"
                      className="h-6 px-2 text-xs"
                    >
                      View Location
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            iconName="MoreHorizontal"
            fullWidth
            className="text-muted-foreground"
          >
            Load More Activities
          </Button>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-foreground">24</p>
            <p className="text-xs text-muted-foreground">Actions Today</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">156</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;