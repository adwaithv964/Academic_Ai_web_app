import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const UserTable = ({
  users = [],
  selectedUsers = [],
  onUserSelect,
  onSelectAll,
  onEditUser,
  onDeleteUser,
  loading = false
}) => {
  const isAllSelected = users?.length > 0 && selectedUsers?.length === users?.length;
  const isIndeterminate = selectedUsers?.length > 0 && selectedUsers?.length < users?.length;

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800 border-green-200',
      inactive: 'bg-orange-100 text-orange-800 border-orange-200',
      suspended: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusStyles?.[status] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const roleStyles = {
      student: 'bg-blue-100 text-blue-800 border-blue-200',
      admin: 'bg-purple-100 text-purple-800 border-purple-200',
      instructor: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${roleStyles?.[role] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
        {role?.charAt(0)?.toUpperCase() + role?.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border border-border">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded w-full"></div>
            {[...Array(5)]?.map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded w-full"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => onSelectAll?.(e?.target?.checked)}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Email</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Registration</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Last Login</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Status</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-foreground">Role</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users?.map((user) => (
              <motion.tr
                key={user?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="hover:bg-muted/20 transition-colors"
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers?.includes(user?.id)}
                    onChange={(e) => onUserSelect?.(user?.id, e?.target?.checked)}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                </td>
                <td className="px-4 py-4">
                  <div>
                    <p className="font-medium text-foreground">{user?.name}</p>
                    {user?.major && (
                      <p className="text-sm text-muted-foreground">{user?.major} • Class of {user?.class}</p>
                    )}
                    {user?.department && (
                      <p className="text-sm text-muted-foreground">{user?.department}</p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-foreground">{user?.email}</td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {new Date(user?.registrationDate)?.toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {user?.lastLogin === 'Never' ? 'Never' : new Date(user?.lastLogin)?.toLocaleDateString()}
                </td>
                <td className="px-4 py-4">{getStatusBadge(user?.status)}</td>
                <td className="px-4 py-4">{getRoleBadge(user?.role)}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Eye"
                      onClick={() => onEditUser?.(user)}
                      className="h-8 w-8 p-0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Edit"
                      onClick={() => onEditUser?.(user)}
                      className="h-8 w-8 p-0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      onClick={() => onDeleteUser?.(user?.id)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    />
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card Layout */}
      <div className="lg:hidden space-y-4 p-4">
        {users?.map((user) => (
          <motion.div
            key={user?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background border border-border rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedUsers?.includes(user?.id)}
                  onChange={(e) => onUserSelect?.(user?.id, e?.target?.checked)}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
                <div>
                  <p className="font-medium text-foreground">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <div className="flex gap-1">
                {getStatusBadge(user?.status)}
                {getRoleBadge(user?.role)}
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {user?.major && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Major:</span>
                  <span className="text-foreground">{user?.major} • {user?.class}</span>
                </div>
              )}
              {user?.department && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Department:</span>
                  <span className="text-foreground">{user?.department}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Registered:</span>
                <span className="text-foreground">{new Date(user?.registrationDate)?.toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Login:</span>
                <span className="text-foreground">
                  {user?.lastLogin === 'Never' ? 'Never' : new Date(user?.lastLogin)?.toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                iconName="Eye"
                onClick={() => onEditUser?.(user)}
              >
                View
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Edit"
                onClick={() => onEditUser?.(user)}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconName="Trash2"
                onClick={() => onDeleteUser?.(user?.id)}
                className="text-red-600 hover:text-red-700"
              >
                Delete
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
      {users?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No users found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or add some users to get started.</p>
        </div>
      )}
    </div>
  );
};

export default UserTable;