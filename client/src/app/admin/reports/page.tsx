'use client';

import { useState } from 'react';
import { Modal, Spinner, Button } from '@/components/ui';
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
                      {report.reporterId?.avatarImage ? (
                        <img
                          src={report.reporterId.avatarImage.publicUrl}
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
                        {report.reportedUser.avatarImage ? (
                          <img
                            src={report.reportedUser.avatarImage.publicUrl}
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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(report)}
                      >
                        View
                      </Button>
                      {report.status === 'pending' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(report.uuid, 'resolved')
                          }
                        >
                          Resolve
                        </Button>
                      )}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(report)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reportsData && reportsData.pagination.totalPages > 1 && (
          <div className="admin-pagination">
            <Button
              variant="secondary"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft size={20} />
              Previous
            </Button>
            <span className="admin-pagination-info">
              Page {page} of {reportsData.pagination.totalPages}
            </span>
            <Button
              variant="secondary"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= reportsData.pagination.totalPages}
            >
              Next
              <ChevronRight size={20} />
            </Button>
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
                {selectedReport.reporterId?.avatarImage ? (
                  <img
                    src={selectedReport.reporterId.avatarImage.publicUrl}
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
                    {selectedReport.reportedUser.avatarImage ? (
                      <img
                        src={selectedReport.reportedUser.avatarImage.publicUrl}
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
                  <Button
                    variant="success"
                    onClick={() => {
                      if (selectedReport) {
                        handleUpdateStatus(selectedReport.uuid, 'resolved');
                        setShowDetailsModal(false);
                      }
                    }}
                  >
                    Resolve
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => {
                      if (selectedReport) {
                        handleUpdateStatus(selectedReport.uuid, 'dismissed');
                        setShowDetailsModal(false);
                      }
                    }}
                  >
                    Dismiss
                  </Button>
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
              <Button
                variant="danger"
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
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
