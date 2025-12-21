'use client';

import { useState } from 'react';
import { Button, Modal, Spinner } from '@/components/ui';
import {
  useAdminGetAllUsers,
  useAdminUpdateUser,
  type AdminUser,
} from '@/hooks/useAdminUsers';

/**
 * Admin users management page
 * @returns {JSX.Element} The users management page
 */
export default function AdminUsers() {
  const { data: users = [], isLoading, error } = useAdminGetAllUsers();
  const updateUserMutation = useAdminUpdateUser();
  // const deleteUserMutation = useAdminDeleteUser();

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [filterType, setFilterType] = useState<
    'all' | 'active' | 'inactive' | 'suspended'
  >('all');

  // Filter users based on selected filter
  const filteredUsers = users.filter(user => {
    switch (filterType) {
      case 'active':
        return user.isActive && !user.isSuspended;
      case 'inactive':
        return !user.isActive;
      case 'suspended':
        return user.isSuspended;
      case 'all':
      default:
        return true;
    }
  });

  const handleSuspendUser = (user: AdminUser) => {
    updateUserMutation.mutate(
      {
        uuid: user.uuid,
        data: {
          isSuspended: !user.isSuspended,
          isActive: user.isSuspended ? true : false,
        },
      },
      {
        onSuccess: () => {
          setSelectedUser(null);
        },
      }
    );
  };

  const handleDeleteClick = (user: AdminUser) => {
    setUserToDelete(user);
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      updateUserMutation.mutate(
        {
          uuid: userToDelete.uuid,
          data: { isActive: false },
        },
        {
          onSuccess: () => {
            setUserToDelete(null);
          },
        }
      );
    }
  };

  if (isLoading) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Users Management</h1>
          <p>Manage all users on the platform</p>
        </div>
        <div className="admin-section">
          <div className="admin-loading">
            <Spinner size="xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Users Management</h1>
          <p>Manage all users on the platform</p>
        </div>
        <div className="admin-section">
          <p className="error-message">
            Failed to load users. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Users Management</h1>
        <p>Manage all users on the platform</p>
      </div>

      <div className="admin-filters">
        <input
          type="text"
          placeholder="Search users..."
          className="admin-search"
        />
        <select
          className="admin-select"
          value={filterType}
          onChange={e =>
            setFilterType(
              e.target.value as 'all' | 'active' | 'inactive' | 'suspended'
            )
          }
        >
          <option value="all">All Users</option>
          <option value="active">Active Users</option>
          <option value="inactive">Inactive Users</option>
          <option value="suspended">Suspended Users</option>
        </select>
      </div>

      <div className="admin-section">
        <div className="admin-grid">
          {filteredUsers && filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <div key={user.uuid} className="admin-post-card">
                <div className="post-card-header">
                  <div className="user-cell">
                    {user.avatarImage?.publicUrl ? (
                      <img
                        src={user.avatarImage.publicUrl}
                        alt={user.username}
                        className="user-avatar-img"
                      />
                    ) : (
                      <div className="user-avatar">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="user-name">{user.username}</p>
                      <p className="post-time">
                        Joined{' '}
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        console.log('View button clicked for user:', user);
                        setSelectedUser(user);
                      }}
                    >
                      View
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(user)}
                      disabled={updateUserMutation.isPending}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="post-card-content">
                  <p>{user.email}</p>
                </div>
                <div className="post-card-stats">
                  <span
                    className={`status-badge ${user.isActive ? 'status-success' : 'status-danger'}`}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                  {user.isSuspended && (
                    <span className="status-badge status-warning">
                      Suspended
                    </span>
                  )}
                  <span className="post-time">
                    Updated{' '}
                    {new Date(user.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-users">No users found for this filter</p>
          )}
        </div>

        {filteredUsers && filteredUsers.length > 0 && (
          <div className="admin-pagination">
            <Button variant="secondary">Previous</Button>
            <span className="pagination-info">
              Page 1 of {Math.ceil(filteredUsers.length / 9)}
            </span>
            <Button variant="secondary">Next</Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!userToDelete}
        title="Deactivate User"
        onClose={() => setUserToDelete(null)}
        size="small"
        actions={
          <div className="modal-footer">
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? (
                <Spinner size="sm" />
              ) : (
                'Deactivate'
              )}
            </Button>
          </div>
        }
      >
        {userToDelete && (
          <p>
            Are you sure you want to deactivate user{' '}
            <strong>{userToDelete.username}</strong>? They will no longer be
            able to access their account.
          </p>
        )}
      </Modal>

      {/* User Details Modal */}
      <Modal
        isOpen={!!selectedUser && !userToDelete}
        title="User Details"
        onClose={() => setSelectedUser(null)}
        size="medium"
        actions={
          <div className="modal-footer">
            <Button variant="secondary" onClick={() => setSelectedUser(null)}>
              Close
            </Button>
            {selectedUser && !selectedUser.isSuspended && (
              <Button
                variant="warning"
                onClick={() => {
                  handleSuspendUser(selectedUser);
                }}
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? (
                  <Spinner size="sm" />
                ) : (
                  'Suspend'
                )}
              </Button>
            )}
            {selectedUser && selectedUser.isSuspended && (
              <Button
                variant="success"
                onClick={() => {
                  handleSuspendUser(selectedUser);
                }}
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? (
                  <Spinner size="sm" />
                ) : (
                  'Unsuspend'
                )}
              </Button>
            )}
          </div>
        }
      >
        {selectedUser && (
          <div className="modal-body">
            <div className="detail-row">
              <span className="detail-label">Username:</span>
              <span className="detail-value">{selectedUser.username}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{selectedUser.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value">
                {selectedUser.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Suspended:</span>
              <span className="detail-value">
                {selectedUser.isSuspended ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Joined:</span>
              <span className="detail-value">
                {new Date(selectedUser.createdAt).toLocaleDateString('en-US')}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
