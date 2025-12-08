'use client';

/**
 * Admin comments management page
 * @returns {JSX.Element} The comments management page
 */
export default function AdminComments() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Comments Management</h1>
        <p>Manage all comments on the platform</p>
      </div>

      <div className="admin-filters">
        <input
          type="text"
          placeholder="Search comments..."
          className="admin-search"
        />
        <select className="admin-select">
          <option value="all">All Comments</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="reported">Reported</option>
        </select>
      </div>

      <div className="admin-section">
        <div className="admin-comments-list">
          <div className="admin-comment-card">
            <div className="comment-header">
              <div className="user-cell">
                <div className="user-avatar">SW</div>
                <div>
                  <p className="user-name">sarah_williams</p>
                  <p className="comment-time">10 minutes ago</p>
                </div>
              </div>
              <span className="status-badge status-success">Approved</span>
            </div>
            <div className="comment-content">
              <p>This is a great post! Really enjoyed reading it.</p>
            </div>
            <div className="comment-footer">
              <span className="comment-meta">
                On post: "My hiking adventure"
              </span>
              <div className="action-buttons">
                <button className="admin-btn-icon" title="View Post">
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
                <button className="admin-btn-icon" title="Edit">
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
                <button className="admin-btn-icon" title="Delete">
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
          </div>

          <div className="admin-comment-card">
            <div className="comment-header">
              <div className="user-cell">
                <div className="user-avatar">TK</div>
                <div>
                  <p className="user-name">tom_king</p>
                  <p className="comment-time">1 hour ago</p>
                </div>
              </div>
              <span className="status-badge status-warning">Pending</span>
            </div>
            <div className="comment-content">
              <p>I disagree with this point. Here's why...</p>
            </div>
            <div className="comment-footer">
              <span className="comment-meta">On post: "Tech trends 2024"</span>
              <div className="action-buttons">
                <button className="admin-btn-icon" title="Approve">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <button className="admin-btn-icon" title="View Post">
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
                <button className="admin-btn-icon" title="Delete">
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
          </div>

          <div className="admin-comment-card flagged">
            <div className="comment-header">
              <div className="user-cell">
                <div className="user-avatar">AB</div>
                <div>
                  <p className="user-name">alex_brown</p>
                  <p className="comment-time">3 hours ago</p>
                </div>
              </div>
              <span className="status-badge status-danger">Reported</span>
            </div>
            <div className="comment-content">
              <p>This comment has been flagged for inappropriate content.</p>
            </div>
            <div className="comment-footer">
              <span className="comment-meta">
                On post: "Community guidelines" • Reported by 3 users
              </span>
              <div className="action-buttons">
                <button className="admin-btn-icon" title="View Reports">
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
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </button>
                <button className="admin-btn-icon" title="View Post">
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
                <button className="admin-btn-icon" title="Delete">
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
          </div>
        </div>

        <div className="admin-pagination">
          <button className="admin-btn admin-btn-secondary">Previous</button>
          <span className="pagination-info">Page 1 of 50</span>
          <button className="admin-btn admin-btn-secondary">Next</button>
        </div>
      </div>
    </div>
  );
}
