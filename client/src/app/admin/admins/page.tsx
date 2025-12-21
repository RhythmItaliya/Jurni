'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Modal, Spinner, Button } from '@/components/ui';
import {
  useGetAdmins,
  useAdminRegister,
  useUpdateAdmin,
  useDeleteAdmin,
  useAdminSession,
  Admin,
} from '@/hooks/useAdmin';

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
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Admin Management</h1>
          <p>Manage administrator accounts and permissions</p>
        </div>
        <div className="admin-section">
          <div className="admin-loading">
            <Spinner size="xl" />
          </div>
        </div>
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
        <div className="admin-section">
          <p className="error-message">
            You don&apos;t have permission to access this page.
          </p>
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
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          icon={
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
          }
        >
          Add Admin
        </Button>
      </div>

      {isLoading ? (
        <div className="admin-section">
          <div className="admin-loading">
            <Spinner size="xl" />
          </div>
        </div>
      ) : (
        <div className="admin-section">
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(admin)}
                              disabled={currentAdmin?.uuid === admin.uuid}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                handleDelete(admin.uuid, admin.role, admin)
                              }
                              disabled={currentAdmin?.uuid === admin.uuid}
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
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
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={registerAdmin.isPending}
            >
              {registerAdmin.isPending ? 'Creating...' : 'Create Admin'}
            </Button>
          </div>
        }
      >
        <div className="modal-body">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
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
            <Button
              variant="primary"
              onClick={handleUpdate}
              disabled={updateAdmin.isPending}
            >
              {updateAdmin.isPending ? 'Updating...' : 'Update Admin'}
            </Button>
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
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={deleteAdmin.isPending}
            >
              {deleteAdmin.isPending ? <Spinner size="sm" /> : 'Delete'}
            </Button>
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
