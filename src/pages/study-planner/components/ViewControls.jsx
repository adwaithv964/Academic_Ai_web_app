import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ViewControls = ({ 
  currentView, 
  onViewChange, 
  currentDate, 
  onDateChange, 
  onTodayClick 
}) => {
  const views = [
    { key: 'daily', label: 'Day', icon: 'Calendar' },
    { key: 'weekly', label: 'Week', icon: 'CalendarDays' },
    { key: 'monthly', label: 'Month', icon: 'CalendarRange' }
  ];

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    
    if (currentView === 'daily') {
      newDate?.setDate(newDate?.getDate() + (direction === 'next' ? 1 : -1));
    } else if (currentView === 'weekly') {
      newDate?.setDate(newDate?.getDate() + (direction === 'next' ? 7 : -7));
    } else if (currentView === 'monthly') {
      newDate?.setMonth(newDate?.getMonth() + (direction === 'next' ? 1 : -1));
    }
    
    onDateChange(newDate);
  };

  const formatDateDisplay = () => {
    const options = {
      daily: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
      weekly: { year: 'numeric', month: 'long', day: 'numeric' },
      monthly: { year: 'numeric', month: 'long' }
    };
    
    if (currentView === 'weekly') {
      const startOfWeek = new Date(currentDate);
      const dayOfWeek = startOfWeek?.getDay();
      const diff = startOfWeek?.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startOfWeek?.setDate(diff);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek?.setDate(startOfWeek?.getDate() + 6);
      
      return `${startOfWeek?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    
    return currentDate?.toLocaleDateString('en-US', options?.[currentView]);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card border border-border rounded-lg">
      {/* View Toggle */}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
        {views?.map((view) => (
          <button
            key={view?.key}
            onClick={() => onViewChange(view?.key)}
            className={`
              relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-academic
              ${currentView === view?.key 
                ? 'text-primary bg-card shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
              }
            `}
          >
            <Icon name={view?.icon} size={16} />
            <span className="hidden sm:inline">{view?.label}</span>
            {currentView === view?.key && (
              <motion.div
                layoutId="activeView"
                className="absolute inset-0 bg-card rounded-md shadow-sm border border-border"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>
      {/* Date Navigation */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          iconName="ChevronLeft"
          onClick={() => navigateDate('prev')}
          className="h-9 w-9 p-0"
        />
        
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground min-w-0">
            {formatDateDisplay()}
          </h2>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onTodayClick}
            className="hidden sm:flex"
          >
            Today
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          iconName="ChevronRight"
          onClick={() => navigateDate('next')}
          className="h-9 w-9 p-0"
        />
      </div>
      {/* Quick Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          iconName="Download"
          className="hidden md:flex"
        >
          Export
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          iconName="Settings"
          className="h-9 w-9 p-0"
        />
      </div>
    </div>
  );
};

export default ViewControls;