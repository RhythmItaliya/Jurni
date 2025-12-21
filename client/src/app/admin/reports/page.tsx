'use client';

import { useState } from 'react';
import { Modal, Spinner } from '@/components/ui';
import {
  useAdminGetAllReports,
  useAdminUpdateReportStatus,
  useAdminDeleteReport,
  Report,
} from '@/hooks/useAdminReports';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ReportsManagement() {
  const [page, setPage] = useState(1);
  const [selectedType, setSelectedType] = useState<'all' | 'post' | 'user'>(
    'all'
  );
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);

  const limit = 20;
  const type = selectedType === 'all' ? undefined : selectedType;

  const { data: reportsData, isLoading } = useAdminGetAllReports(
    page,
    limit,
    type,
    selectedStatus
  );
  const updateReportStatus = useAdminUpdateReportStatus();
  const deleteReport = useAdminDeleteReport();

  const handleTypeChange = (newType: 'all' | 'post' | 'user') => {
    setSelectedType(newType);
    setPage(1);
  };

  const handleStatusChange = (newStatus: string) => {
    setSelectedStatus(newStatus);
    setPage(1);
  };

  const handleViewDetails = (report: Report) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (
    uuid: string,
    status: 'pending' | 'resolved' | 'dismissed'
  ) => {
    updateReportStatus.mutate({ uuid, status });
  };

  const handleDeleteClick = (report: Report) => {
    setReportToDelete(report);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (reportToDelete) {
      deleteReport.mutate(reportToDelete.uuid);
      setShowDeleteModal(false);
      setReportToDelete(null);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-warning';
      case 'resolved':
        return 'status-success';
      case 'dismissed':
        return 'status-danger';
      default:
        return '';
    }
  };

  const getTypeBadgeClass = (type: string) => {
    return type === 'user' ? 'status-danger' : 'status-info';
  };

  if (isLoading) {
    return (
      <div className="admin-page">
        <div className="admin-page-header">
          <h1>Reports Management</h1>
          <p>Review and manage user and post reports</p>
        </div>
        <div className="admin-section">
          <div className="admin-loading">
            <Spinner size="xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Reports Management</h1>
        <p>Review and manage user and post reports</p>
      </div>

      <div className="admin-filters">
        <select
          className="admin-select"
          value={selectedType}
          onChange={e =>
            handleTypeChange(e.target.value as 'all' | 'post' | 'user')
          }
        >
          <option value="all">All Reports</option>
          <option value="user">User Reports</option>
          <option value="post">Post Reports</option>
        </select>

        <select
          className="admin-select"
          value={selectedStatus}
          onChange={e => handleStatusChange(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      <div className="admin-section">
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Reported By</th>
                <th>Reported Item</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reportsData?.reports?.map((report: Report) => (
                <tr key={report.uuid}>
                  <td>
                    <span
                      className={`status-badge ${getTypeBadgeClass(report.reportType)}`}
                    >
                      {report.reportType}
                    </span>
                  </td>
                  <td>
                    <div className="user-cell">
                      {report.reporterId?.avatar ? (
                        <img
                          src={report.reporterId.avatar}
                          alt={report.reporterId.username}
                          className="user-avatar"
                        />
                      ) : (
                        <div className="user-avatar">
                          {report.reporterId?.username?.[0]?.toUpperCase() ||
                            '?'}
                        </div>
                      )}
                      <div>
                        <p className="user-name">
                          {report.reporterId?.username || 'Unknown'}
                        </p>
                        <p className="user-email">
                          {report.reporterId?.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {report.reportType === 'user' && report.reportedUser && (
                      <div className="user-cell">
                        {report.reportedUser.avatar ? (
                          <img
                            src={report.reportedUser.avatar}
                            alt={report.reportedUser.username}
                            className="user-avatar"
                          />
                        ) : (
                          <div className="user-avatar">
                            {report.reportedUser.username[0].toUpperCase()}
                          </div>
                        )}
                        <span className="user-name">
                          {report.reportedUser.username}
                        </span>
                      </div>
                    )}
                    {report.reportType === 'post' && report.reportedPost && (
                      <div className="user-cell">
                        {report.reportedPost.mediaUrl?.[0] && (
                          <img
                            src={report.reportedPost.mediaUrl[0]}
                            alt="Post"
                            className="user-avatar"
                            style={{ borderRadius: '4px' }}
                          />
                        )}
                        <span className="user-name">
                          Post by {report.reportedPost.userId.username}
                        </span>
                      </div>
                    )}
                  </td>
                  <td>{report.reason}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusBadgeClass(report.status)}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td>{new Date(report.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="admin-btn-icon"
                        onClick={() => handleViewDetails(report)}
                        title="View Details"
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
                      {report.status === 'pending' && (
                        <button
                          className="admin-btn-icon"
                          onClick={() =>
                            handleUpdateStatus(report.uuid, 'resolved')
                          }
                          title="Resolve"
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                      )}
                      <button
                        className="admin-btn-icon"
                        onClick={() => handleDeleteClick(report)}
                        title="Delete"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reportsData && reportsData.pagination.totalPages > 1 && (
          <div className="admin-pagination">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="admin-btn-secondary"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <span className="admin-pagination-info">
              Page {page} of {reportsData.pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= reportsData.pagination.totalPages}
              className="admin-btn-secondary"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal && !!selectedReport}
        onClose={() => setShowDetailsModal(false)}
        title="Report Details"
      >
        {selectedReport && (
          <div className="modal-content">
            <div className="form-group">
              <label>Report Type</label>
              <span
                className={`status-badge ${getTypeBadgeClass(selectedReport.reportType)}`}
              >
                {selectedReport.reportType}
              </span>
            </div>

            <div className="form-group">
              <label>Reported By</label>
              <div className="user-cell">
                {selectedReport.reporterId?.avatar ? (
                  <img
                    src={selectedReport.reporterId.avatar}
                    alt={selectedReport.reporterId.username}
                    className="user-avatar"
                  />
                ) : (
                  <div className="user-avatar">
                    {selectedReport.reporterId?.username?.[0]?.toUpperCase() ||
                      '?'}
                  </div>
                )}
                <div>
                  <p className="user-name">
                    {selectedReport.reporterId?.username || 'Unknown'}
                  </p>
                  <p className="user-email">
                    {selectedReport.reporterId?.email || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {selectedReport.reportType === 'user' &&
              selectedReport.reportedUser && (
                <div className="form-group">
                  <label>Reported User</label>
                  <div className="user-cell">
                    {selectedReport.reportedUser.avatar ? (
                      <img
                        src={selectedReport.reportedUser.avatar}
                        alt={selectedReport.reportedUser.username}
                        className="user-avatar"
                      />
                    ) : (
                      <div className="user-avatar">
                        {selectedReport.reportedUser.username[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="user-name">
                        {selectedReport.reportedUser.username}
                      </p>
                      <p className="user-email">
                        {selectedReport.reportedUser.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {selectedReport.reportType === 'post' &&
              selectedReport.reportedPost && (
                <div className="form-group">
                  <label>Reported Post</label>
                  <div>
                    {selectedReport.reportedPost.mediaUrl?.[0] && (
                      <img
                        src={selectedReport.reportedPost.mediaUrl[0]}
                        alt="Post"
                        style={{
                          maxWidth: '200px',
                          borderRadius: '8px',
                          marginBottom: '8px',
                        }}
                      />
                    )}
                    <p className="user-name">
                      By: {selectedReport.reportedPost.userId.username}
                    </p>
                    {selectedReport.reportedPost.caption && (
                      <p>{selectedReport.reportedPost.caption}</p>
                    )}
                  </div>
                </div>
              )}

            <div className="form-group">
              <label>Reason</label>
              <p>{selectedReport.reason}</p>
            </div>

            {selectedReport.description && (
              <div className="form-group">
                <label>Description</label>
                <p>{selectedReport.description}</p>
              </div>
            )}

            <div className="form-group">
              <label>Status</label>
              <span
                className={`status-badge ${getStatusBadgeClass(selectedReport.status)}`}
              >
                {selectedReport.status}
              </span>
            </div>

            <div className="form-group">
              <label>Created At</label>
              <p>{new Date(selectedReport.createdAt).toLocaleString()}</p>
            </div>

            {selectedReport.reviewedBy && (
              <div className="form-group">
                <label>Reviewed By</label>
                <p>{selectedReport.reviewedBy.username}</p>
                {selectedReport.reviewedAt && (
                  <p className="user-email">
                    {new Date(selectedReport.reviewedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            <div className="modal-actions">
              {selectedReport.status === 'pending' && (
                <>
                  <button
                    className="admin-btn admin-btn-success"
                    onClick={() => {
                      if (selectedReport) {
                        handleUpdateStatus(selectedReport.uuid, 'resolved');
                        setShowDetailsModal(false);
                      }
                    }}
                  >
                    Resolve
                  </button>
                  <button
                    className="admin-btn admin-btn-danger"
                    onClick={() => {
                      if (selectedReport) {
                        handleUpdateStatus(selectedReport.uuid, 'dismissed');
                        setShowDetailsModal(false);
                      }
                    }}
                  >
                    Dismiss
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal && !!reportToDelete}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Report"
      >
        {reportToDelete && (
          <div className="modal-content">
            <p>
              Are you sure you want to delete this {reportToDelete.reportType}{' '}
              report? This action cannot be undone.
            </p>
            <div className="modal-actions">
              <button
                className="admin-btn admin-btn-danger"
                onClick={handleConfirmDelete}
                disabled={deleteReport.isPending}
              >
                {deleteReport.isPending ? (
                  <>
                    <Spinner size="sm" />
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
