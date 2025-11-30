import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const FilterControls = ({
  filters,
  onFilterChange,
  isOpen,
  onToggle,
  resultsCount = 0
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'student', label: 'Student' },
    { value: 'admin', label: 'Admin' },
    { value: 'instructor', label: 'Instructor' }
  ];

  const dateRangeOptions = [
    { value: '', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const handleSearchChange = (e) => {
    onFilterChange?.({ search: e?.target?.value });
  };

  const handleStatusChange = (value) => {
    onFilterChange?.({ status: value });
  };

  const handleRoleChange = (value) => {
    onFilterChange?.({ role: value });
  };

  const handleDateRangeChange = (value) => {
    onFilterChange?.({ dateRange: value });
  };

  const handleClearFilters = () => {
    onFilterChange?.({
      search: '',
      status: 'all',
      role: 'all',
      dateRange: null
    });
  };

  const hasActiveFilters = filters?.search || 
    filters?.status !== 'all' || 
    filters?.role !== 'all' || 
    filters?.dateRange;

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Desktop Filters */}
      <div className="hidden lg:block p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 max-w-md relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              placeholder="Search by name or email..."
              value={filters?.search || ''}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
          
          <Select
            value={filters?.status}
            onChange={handleStatusChange}
            options={statusOptions}
            placeholder="Status"
            className="w-40"
          />
          
          <Select
            value={filters?.role}
            onChange={handleRoleChange}
            options={roleOptions}
            placeholder="Role"
            className="w-40"
          />
          
          <Select
            value={filters?.dateRange || ''}
            onChange={handleDateRangeChange}
            options={dateRangeOptions}
            placeholder="Date Range"
            className="w-40"
          />

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={handleClearFilters}
            >
              Clear
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            Showing {resultsCount} {resultsCount === 1 ? 'user' : 'users'}
            {hasActiveFilters && ' (filtered)'}
          </p>
          
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
            >
              Export CSV
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Upload"
            >
              Import CSV
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile Filters */}
      <div className="lg:hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              placeholder="Search users..."
              value={filters?.search || ''}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border-b border-border space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                value={filters?.status}
                onChange={handleStatusChange}
                options={statusOptions}
                placeholder="Filter by status"
              />
              
              <Select
                value={filters?.role}
                onChange={handleRoleChange}
                options={roleOptions}
                placeholder="Filter by role"
              />
            </div>

            <Select
              value={filters?.dateRange || ''}
              onChange={handleDateRangeChange}
              options={dateRangeOptions}
              placeholder="Filter by date range"
            />

            <div className="flex items-center justify-between pt-4">
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={handleClearFilters}
                >
                  Clear Filters
                </Button>
              )}
              
              <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                >
                  Export
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Upload"
                >
                  Import
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="p-4 flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            {resultsCount} {resultsCount === 1 ? 'user' : 'users'}
            {hasActiveFilters && ' (filtered)'}
          </p>
          
          <button
            onClick={() => onToggle?.(!isOpen)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Icon name="Filter" size={16} />
            <span>{isOpen ? 'Hide' : 'Show'} Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-primary rounded-full"></span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;