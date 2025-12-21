'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal } from '@/components/ui';
import {
  useGetAdmins,
  useAdminRegister,
  useUpdateAdmin,
  useDeleteAdmin,
  useAdminSession,
  Admin,
} from '@/hooks/useAdmin';
import Loading from '@/app/loading';

export default function AdminManagement() {
  const { data: currentAdmin, isLoading: isLoadingSession } = useAdminSession();
  const isSuperAdmin = currentAdmin?.role === 'super_admin';

  // Only fetch admins if user is super admin and session is loaded
  const { data: admins, isLoading } = useGetAdmins(
    !!currentAdmin && isSuperAdmin
  );
  const registerAdmin = useAdminRegister();
  const updateAdmin = useUpdateAdmin();
  const deleteAdmin = useDeleteAdmin();

  // Count super admins to determine if actions should be shown
  const superAdminCount =
    admins?.filter((admin: Admin) => admin.role === 'super_admin').length || 0;

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin' as 'super_admin' | 'admin',
  });

  const handleCreate = () => {
    registerAdmin.mutate(formData, {
      onSuccess: () => {
        setShowCreateModal(false);
        setFormData({ username: '', email: '', password: '', role: 'admin' });
      },
    });
  };

  const handleEdit = (admin: Admin) => {
    setSelectedAdmin(admin);
    setFormData({
      ...formData,
      role: admin.role as 'super_admin' | 'admin',
    });
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (selectedAdmin) {
      updateAdmin.mutate(
        {
          uuid: selectedAdmin.uuid,
          data: {
            role: formData.role,
          },
        },
        {
          onSuccess: () => {
            setShowEditModal(false);
            setSelectedAdmin(null);
            setFormData({
              username: '',
              email: '',
              password: '',
              role: 'admin',
            });
          },
        }
      );
    }
  };

  const handleDelete = (uuid: string, role: string, admin: Admin) => {
    if (role === 'super_admin') {
      alert('Super admin accounts cannot be deleted');
      return;
    }
    setAdminToDelete(admin);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (adminToDelete) {
      deleteAdmin.mutate(adminToDelete.uuid);
      setShowDeleteModal(false);
      setAdminToDelete(null);
    }
  };

  // Show loading while checking session
  if (isLoadingSession) {
    return (
      <div className="admin-loading-container">
        <Loading />
      </div>
    );
  }

  // Show access denied for non-super admins
  if (!isSuperAdmin) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Access Denied</h1>
          <p>Only super administrators can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Admin Management</h1>
          <p>Manage administrator accounts and permissions</p>
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Admin
        </button>
      </div>

      {isLoading ? (
        <div className="admin-loading-container">
          <Loading />
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins?.map((admin: Admin) => (
                <motion.tr
                  key={admin.uuid}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {admin.username[0].toUpperCase()}
                      </div>
                      <span className="user-name">{admin.username}</span>
                    </div>
                  </td>
                  <td>{admin.email}</td>
                  <td>
                    <span
                      className={`status-badge status-${admin.role === 'super_admin' ? 'danger' : admin.role === 'admin' ? 'info' : 'success'}`}
                    >
                      {admin.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      {(admin.role !== 'super_admin' ||
                        superAdminCount > 1) && (
                        <>
                          <button
                            className="admin-btn-icon"
                            onClick={() => handleEdit(admin)}
                            title="Edit"
                            disabled={currentAdmin?.uuid === admin.uuid}
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            className="admin-btn-icon"
                            onClick={() =>
                              handleDelete(admin.uuid, admin.role, admin)
                            }
                            title="Delete"
                            disabled={currentAdmin?.uuid === admin.uuid}
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
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        title="Create New Admin"
        onClose={() => setShowCreateModal(false)}
        size="medium"
        actions={
          <div className="modal-footer">
            <button
              className="admin-btn admin-btn-secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </button>
            <button
              className="admin-btn admin-btn-primary"
              onClick={handleCreate}
              disabled={registerAdmin.isPending}
            >
              {registerAdmin.isPending ? 'Creating...' : 'Create Admin'}
            </button>
          </div>
        }
      >
        <div className="modal-body">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              className="admin-input"
              value={formData.username}
              onChange={e =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter username"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="admin-input"
              value={formData.email}
              onChange={e =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="admin-input"
              value={formData.password}
              onChange={e =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter password"
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              className="admin-select"
              value={formData.role}
              onChange={e =>
                setFormData({
                  ...formData,
                  role: e.target.value as 'super_admin' | 'admin',
                })
              }
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal && !!selectedAdmin}
        title={`Edit Admin: ${selectedAdmin?.username || ''}`}
        onClose={() => setShowEditModal(false)}
        size="medium"
        actions={
          <div className="modal-footer">
            <button
              className="admin-btn admin-btn-secondary"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </button>
            <button
              className="admin-btn admin-btn-primary"
              onClick={handleUpdate}
              disabled={updateAdmin.isPending}
            >
              {updateAdmin.isPending ? 'Updating...' : 'Update Admin'}
            </button>
          </div>
        }
      >
        <div className="modal-body">
          <div className="form-group">
            <label>Role</label>
            <select
              className="admin-select"
              value={formData.role}
              onChange={e =>
                setFormData({
                  ...formData,
                  role: e.target.value as 'super_admin' | 'admin',
                })
              }
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal && !!adminToDelete}
        title="Confirm Delete"
        onClose={() => setShowDeleteModal(false)}
        size="small"
        actions={
          <div className="modal-footer">
            <button
              className="admin-btn admin-btn-secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              className="admin-btn admin-btn-danger"
              onClick={handleConfirmDelete}
              disabled={deleteAdmin.isPending}
            >
              {deleteAdmin.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        }
      >
        {adminToDelete && (
          <p>
            Are you sure you want to delete admin{' '}
            <strong>{adminToDelete.username}</strong>? This action cannot be
            undone.
          </p>
        )}
      </Modal>
    </div>
  );
}
