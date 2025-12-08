'use client';

/**
 * Admin reports page
 * @returns {JSX.Element} The reports page
 */
export default function AdminReports() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Reports</h1>
        <p>Review reported content and user reports</p>
      </div>

      <div className="admin-filters">
        <input
          type="text"
          placeholder="Search reports..."
          className="admin-search"
        />
        <select className="admin-select">
          <option value="all">All Reports</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
        <select className="admin-select">
          <option value="all">All Types</option>
          <option value="post">Post</option>
          <option value="comment">Comment</option>
          <option value="user">User</option>
        </select>
      </div>

      <div className="admin-section">
        <div className="admin-reports-list">
          <div className="admin-report-card">
            <div className="report-header">
              <span className="report-type">Post Report</span>
              <span className="status-badge status-warning">Pending</span>
            </div>
            <div className="report-content">
              <div className="report-info">
                <p className="report-reason">
                  <strong>Reason:</strong> Spam content
                </p>
                <p className="report-reporter">
                  <strong>Reported by:</strong> user123, user456, user789 (3
                  reports)
                </p>
                <p className="report-time">
                  <strong>First reported:</strong> 1 hour ago
                </p>
              </div>
              <div className="report-details">
                <p className="report-target">
                  <strong>Reported content:</strong>
                </p>
                <div className="reported-content-preview">
                  <p>This is spam advertising content...</p>
                  <p className="content-author">By: spammer_account</p>
                </div>
              </div>
            </div>
            <div className="report-actions">
              <button className="admin-btn admin-btn-primary">
                View Full Content
              </button>
              <button className="admin-btn admin-btn-danger">
                Remove Content
              </button>
              <button className="admin-btn admin-btn-secondary">
                Dismiss Report
              </button>
            </div>
          </div>

          <div className="admin-report-card">
            <div className="report-header">
              <span className="report-type">Comment Report</span>
              <span className="status-badge status-warning">Pending</span>
            </div>
            <div className="report-content">
              <div className="report-info">
                <p className="report-reason">
                  <strong>Reason:</strong> Harassment
                </p>
                <p className="report-reporter">
                  <strong>Reported by:</strong> concerned_user (1 report)
                </p>
                <p className="report-time">
                  <strong>First reported:</strong> 3 hours ago
                </p>
              </div>
              <div className="report-details">
                <p className="report-target">
                  <strong>Reported content:</strong>
                </p>
                <div className="reported-content-preview">
                  <p>Inappropriate comment targeting another user...</p>
                  <p className="content-author">By: toxic_user</p>
                </div>
              </div>
            </div>
            <div className="report-actions">
              <button className="admin-btn admin-btn-primary">
                View Full Content
              </button>
              <button className="admin-btn admin-btn-danger">
                Remove Comment
              </button>
              <button className="admin-btn admin-btn-secondary">
                Dismiss Report
              </button>
            </div>
          </div>

          <div className="admin-report-card">
            <div className="report-header">
              <span className="report-type">User Report</span>
              <span className="status-badge status-danger">High Priority</span>
            </div>
            <div className="report-content">
              <div className="report-info">
                <p className="report-reason">
                  <strong>Reason:</strong> Impersonation
                </p>
                <p className="report-reporter">
                  <strong>Reported by:</strong> verified_user, mod_team (2
                  reports)
                </p>
                <p className="report-time">
                  <strong>First reported:</strong> 5 hours ago
                </p>
              </div>
              <div className="report-details">
                <p className="report-target">
                  <strong>Reported user:</strong>
                </p>
                <div className="reported-content-preview">
                  <div className="user-cell">
                    <div className="user-avatar">FU</div>
                    <span>fake_account</span>
                  </div>
                  <p>User is impersonating another verified account</p>
                </div>
              </div>
            </div>
            <div className="report-actions">
              <button className="admin-btn admin-btn-primary">
                View Profile
              </button>
              <button className="admin-btn admin-btn-danger">
                Suspend User
              </button>
              <button className="admin-btn admin-btn-secondary">
                Dismiss Report
              </button>
            </div>
          </div>

          <div className="admin-report-card resolved">
            <div className="report-header">
              <span className="report-type">Post Report</span>
              <span className="status-badge status-success">Resolved</span>
            </div>
            <div className="report-content">
              <div className="report-info">
                <p className="report-reason">
                  <strong>Reason:</strong> Misinformation
                </p>
                <p className="report-reporter">
                  <strong>Reported by:</strong> fact_checker (1 report)
                </p>
                <p className="report-time">
                  <strong>Resolved:</strong> 1 day ago
                </p>
              </div>
              <div className="report-resolution">
                <p>
                  <strong>Action taken:</strong> Content removed and user warned
                </p>
                <p>
                  <strong>Resolved by:</strong> admin_moderator
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-pagination">
          <button className="admin-btn admin-btn-secondary">Previous</button>
          <span className="pagination-info">Page 1 of 5</span>
          <button className="admin-btn admin-btn-secondary">Next</button>
        </div>
      </div>
    </div>
  );
}
