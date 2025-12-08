'use client';

/**
 * Admin dashboard page component
 * @returns {JSX.Element} The admin dashboard
 */
export default function AdminDashboard() {
  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Overview of your platform</p>
      </div>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-value">1,234</p>
            <p className="stat-change">+12% from last month</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <div className="stat-info">
            <h3>Total Posts</h3>
            <p className="stat-value">5,678</p>
            <p className="stat-change">+8% from last month</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div className="stat-info">
            <h3>Total Comments</h3>
            <p className="stat-value">12,345</p>
            <p className="stat-change">+15% from last month</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon">
            <svg
              width="24"
              height="24"
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
          </div>
          <div className="stat-info">
            <h3>Reports</h3>
            <p className="stat-value">23</p>
            <p className="stat-change stat-change-warning">Needs attention</p>
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h2>Recent Activity</h2>
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>john_doe</td>
                <td>Created a new post</td>
                <td>2 minutes ago</td>
                <td>
                  <span className="status-badge status-success">Active</span>
                </td>
              </tr>
              <tr>
                <td>jane_smith</td>
                <td>Commented on a post</td>
                <td>5 minutes ago</td>
                <td>
                  <span className="status-badge status-success">Active</span>
                </td>
              </tr>
              <tr>
                <td>mike_johnson</td>
                <td>Uploaded media</td>
                <td>10 minutes ago</td>
                <td>
                  <span className="status-badge status-success">Active</span>
                </td>
              </tr>
              <tr>
                <td>sarah_williams</td>
                <td>Reported a post</td>
                <td>15 minutes ago</td>
                <td>
                  <span className="status-badge status-warning">Pending</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
