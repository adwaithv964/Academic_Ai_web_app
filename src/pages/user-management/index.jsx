import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import UserTable from './components/UserTable';
import FilterControls from './components/FilterControls';
import UserModal from './components/UserModal';
import BulkActionsBar from './components/BulkActionsBar';
import ActivityLogs from './components/ActivityLogs';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    role: 'all',
    dateRange: null
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActivityLogs, setShowActivityLogs] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Mock users data
  const mockUsers = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@university.edu',
      registrationDate: '2024-01-15',
      lastLogin: '2024-09-08',
      status: 'active',
      role: 'student',
      gpa: 3.8,
      class: '2026',
      major: 'Computer Science'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob.smith@university.edu',
      registrationDate: '2024-02-20',
      lastLogin: '2024-09-07',
      status: 'active',
      role: 'student',
      gpa: 3.5,
      class: '2025',
      major: 'Mathematics'
    },
    {
      id: 3,
      name: 'Carol Davis',
      email: 'carol.davis@university.edu',
      registrationDate: '2024-01-10',
      lastLogin: '2024-08-30',
      status: 'inactive',
      role: 'student',
      gpa: 3.2,
      class: '2027',
      major: 'Physics'
    },
    {
      id: 4,
      name: 'Dr. John Wilson',
      email: 'john.wilson@university.edu',
      registrationDate: '2023-08-01',
      lastLogin: '2024-09-09',
      status: 'active',
      role: 'admin',
      department: 'Computer Science',
      level: 'Professor'
    },
    {
      id: 5,
      name: 'Emma Brown',
      email: 'emma.brown@university.edu',
      registrationDate: '2024-03-12',
      lastLogin: '2024-09-05',
      status: 'suspended',
      role: 'student',
      gpa: 2.8,
      class: '2026',
      major: 'Biology'
    }
  ];

  // Initialize users data
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        setLoading(false);
      }, 1000);
    };

    loadUsers();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...users];

    // Search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(user => 
        user?.name?.toLowerCase()?.includes(searchTerm) ||
        user?.email?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(user => user?.status === filters?.status);
    }

    // Role filter
    if (filters?.role !== 'all') {
      filtered = filtered?.filter(user => user?.role === filters?.role);
    }

    setFilteredUsers(filtered);
  }, [users, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleUserSelect = (userId, isSelected) => {
    setSelectedUsers(prev => 
      isSelected 
        ? [...prev, userId]
        : prev?.filter(id => id !== userId)
    );
  };

  const handleSelectAll = (isSelected) => {
    setSelectedUsers(isSelected ? filteredUsers?.map(user => user?.id) : []);
  };

  const handleCreateUser = () => {
    setModalMode('create');
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev?.filter(user => user?.id !== userId));
      setSelectedUsers(prev => prev?.filter(id => id !== userId));
    }
  };

  const handleModalSubmit = (userData) => {
    if (modalMode === 'create') {
      const newUser = {
        ...userData,
        id: Math.max(...users?.map(u => u?.id)) + 1,
        registrationDate: new Date()?.toISOString()?.split('T')?.[0],
        lastLogin: 'Never'
      };
      setUsers(prev => [...prev, newUser]);
    } else {
      setUsers(prev => prev?.map(user => 
        user?.id === selectedUser?.id ? { ...user, ...userData } : user
      ));
    }
    setIsModalOpen(false);
  };

  const handleBulkAction = (action, userIds) => {
    switch (action) {
      case 'activate':
        setUsers(prev => prev?.map(user => 
          userIds?.includes(user?.id) ? { ...user, status: 'active' } : user
        ));
        break;
      case 'deactivate':
        setUsers(prev => prev?.map(user => 
          userIds?.includes(user?.id) ? { ...user, status: 'inactive' } : user
        ));
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${userIds?.length} users?`)) {
          setUsers(prev => prev?.filter(user => !userIds?.includes(user?.id)));
        }
        break;
      default:
        break;
    }
    setSelectedUsers([]);
  };

  const stats = {
    total: users?.length,
    active: users?.filter(u => u?.status === 'active')?.length,
    inactive: users?.filter(u => u?.status === 'inactive')?.length,
    suspended: users?.filter(u => u?.status === 'suspended')?.length
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold text-foreground">User Management</h1>
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <span>Total: {stats?.total}</span>
                <span>•</span>
                <span className="text-green-600">Active: {stats?.active}</span>
                <span>•</span>
                <span className="text-orange-600">Inactive: {stats?.inactive}</span>
                <span>•</span>
                <span className="text-red-600">Suspended: {stats?.suspended}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="lg:hidden p-2 hover:bg-muted/50 rounded-lg transition-academic"
              >
                <Icon name="Filter" size={20} className="text-foreground" />
              </button>

              {/* Activity Logs Toggle */}
              <button
                onClick={() => setShowActivityLogs(!showActivityLogs)}
                className="hidden md:flex items-center gap-2 px-3 py-2 text-sm bg-muted/30 hover:bg-muted/50 rounded-lg transition-academic"
              >
                <Icon name="Activity" size={16} />
                Activity Logs
              </button>

              {/* Add User Button */}
              <button
                onClick={handleCreateUser}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-academic"
              >
                <Icon name="Plus" size={16} />
                <span className="hidden sm:inline">Add User</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {/* Mobile Stats Cards */}
        <div className="md:hidden grid grid-cols-2 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-2xl font-semibold text-foreground">{stats?.total}</p>
          </div>
          <div className="bg-card p-4 rounded-lg border">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-semibold text-green-600">{stats?.active}</p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Filter Controls */}
            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
              isOpen={isMobileFiltersOpen}
              onToggle={setIsMobileFiltersOpen}
              resultsCount={filteredUsers?.length}
            />

            {/* Bulk Actions Bar */}
            {selectedUsers?.length > 0 && (
              <BulkActionsBar
                selectedCount={selectedUsers?.length}
                onBulkAction={handleBulkAction}
                selectedUsers={selectedUsers}
              />
            )}

            {/* Users Table */}
            <UserTable
              users={filteredUsers}
              selectedUsers={selectedUsers}
              onUserSelect={handleUserSelect}
              onSelectAll={handleSelectAll}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              loading={loading}
            />
          </div>

          {/* Activity Logs Sidebar */}
          {showActivityLogs && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="hidden lg:block w-80"
            >
              <ActivityLogs />
            </motion.div>
          )}
        </div>
      </div>
      {/* User Modal */}
      {isModalOpen && (
        <UserModal
          mode={modalMode}
          user={selectedUser}
          onSubmit={handleModalSubmit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UserManagement;