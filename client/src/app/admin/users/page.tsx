'use client';

import { useState } from 'react';
import { Modal, Spinner } from '@/components/ui';
import {
  useAdminGetAllUsers,
  useAdminUpdateUser,
  useAdminDeleteUser,
  type AdminUser,
} from '@/hooks/useAdminUsers';

/**
 * Admin users management page
 * @returns {JSX.Element} The users management page
 */
export default function AdminUsers() {
  const { data: users = [], isLoading, error } = useAdminGetAllUsers();
  const updateUserMutation = useAdminUpdateUser();
  const deleteUserMutation = useAdminDeleteUser();

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
                    <button
                      className="admin-btn-icon"
                      title="View"
                      onClick={() => {
                        console.log('View button clicked for user:', user);
                        setSelectedUser(user);
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      className="admin-btn-icon"
                      title="Deactivate"
                      onClick={() => handleDeleteClick(user)}
                      disabled={updateUserMutation.isPending}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
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
            <button className="admin-btn admin-btn-secondary">Previous</button>
            <span className="pagination-info">
              Page 1 of {Math.ceil(filteredUsers.length / 9)}
            </span>
            <button className="admin-btn admin-btn-secondary">Next</button>
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
            <button
              className="admin-btn admin-btn-secondary"
              onClick={() => setUserToDelete(null)}
            >
              Cancel
            </button>
            <button
              className="admin-btn admin-btn-danger"
              onClick={handleConfirmDelete}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? 'Deactivating...' : 'Deactivate'}
            </button>
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
            <button
              className="admin-btn admin-btn-secondary"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
            {selectedUser && !selectedUser.isSuspended && (
              <button
                className="admin-btn admin-btn-warning"
                onClick={() => {
                  handleSuspendUser(selectedUser);
                }}
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? 'Processing...' : 'Suspend'}
              </button>
            )}
            {selectedUser && selectedUser.isSuspended && (
              <button
                className="admin-btn admin-btn-success"
                onClick={() => {
                  handleSuspendUser(selectedUser);
                }}
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? 'Processing...' : 'Unsuspend'}
              </button>
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
