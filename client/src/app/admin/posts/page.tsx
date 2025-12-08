'use client';

/**
 * Admin posts management page
 * @returns {JSX.Element} The posts management page
 */
export default function AdminPosts() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Posts Management</h1>
        <p>Manage all posts on the platform</p>
      </div>

      <div className="admin-filters">
        <input
          type="text"
          placeholder="Search posts..."
          className="admin-search"
        />
        <select className="admin-select">
          <option value="all">All Posts</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="reported">Reported</option>
        </select>
      </div>

      <div className="admin-section">
        <div className="admin-grid">
          <div className="admin-post-card">
            <div className="post-card-header">
              <div className="user-cell">
                <div className="user-avatar">JD</div>
                <div>
                  <p className="user-name">john_doe</p>
                  <p className="post-time">2 hours ago</p>
                </div>
              </div>
              <div className="action-buttons">
                <button className="admin-btn-icon" title="View">
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
            <div className="post-card-content">
              <p>
                Check out this amazing view from my hiking trip! The mountains
                were breathtaking.
              </p>
            </div>
            <div className="post-card-stats">
              <span>❤️ 145 likes</span>
              <span>💬 23 comments</span>
              <span className="status-badge status-success">Published</span>
            </div>
          </div>

          <div className="admin-post-card">
            <div className="post-card-header">
              <div className="user-cell">
                <div className="user-avatar">JS</div>
                <div>
                  <p className="user-name">jane_smith</p>
                  <p className="post-time">5 hours ago</p>
                </div>
              </div>
              <div className="action-buttons">
                <button className="admin-btn-icon" title="View">
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
            <div className="post-card-content">
              <p>
                Sharing my thoughts on the latest tech trends. What do you all
                think about AI?
              </p>
            </div>
            <div className="post-card-stats">
              <span>89 likes</span>
              <span>34 comments</span>
              <span className="status-badge status-success">Published</span>
            </div>
          </div>

          <div className="admin-post-card">
            <div className="post-card-header">
              <div className="user-cell">
                <div className="user-avatar">MJ</div>
                <div>
                  <p className="user-name">mike_johnson</p>
                  <p className="post-time">1 day ago</p>
                </div>
              </div>
              <div className="action-buttons">
                <button className="admin-btn-icon" title="View">
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
            <div className="post-card-content">
              <p>This content has been flagged for review.</p>
            </div>
            <div className="post-card-stats">
              <span>❤️ 12 likes</span>
              <span>💬 5 comments</span>
              <span className="status-badge status-danger">Reported</span>
            </div>
          </div>
        </div>

        <div className="admin-pagination">
          <button className="admin-btn admin-btn-secondary">Previous</button>
          <span className="pagination-info">Page 1 of 25</span>
          <button className="admin-btn admin-btn-secondary">Next</button>
        </div>
      </div>
    </div>
  );
}
