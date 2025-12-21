'use client';

import { useState } from 'react';
import { useAdminGetRecentActivity } from '@/hooks';
import { useGetDashboardStats } from '@/hooks/useAdmin';
import {
  Users,
  FileText,
  MessageCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button, Spinner } from '@/components/ui';

/**
 * Admin dashboard page component
 * @returns {JSX.Element} The admin dashboard
 */
export default function AdminDashboard() {
  const [activityFilter, setActivityFilter] = useState<
    'all' | 'users' | 'posts'
  >('all');
  const [activityPage, setActivityPage] = useState(1);
  const activityLimit = 5;

  const { data: activities = [], isLoading: activitiesLoading } =
    useAdminGetRecentActivity({
      limit: activityLimit * activityPage,
      type: activityFilter,
    });

  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();

  // Get activities for current page
  const startIndex = (activityPage - 1) * activityLimit;
  const currentActivities = activities.slice(
    startIndex,
    startIndex + activityLimit
  );
  const hasMore = activities.length > activityPage * activityLimit;

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return past.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Overview of your platform</p>
      </div>
      <div className="admin-section">
        <h2>Platform Statistics</h2>
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p className="stat-value">
                {statsLoading
                  ? '...'
                  : stats?.totalUsers?.toLocaleString() || '0'}
              </p>
              <p className="stat-change">Active users on platform</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">
              <FileText size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Posts</h3>
              <p className="stat-value">
                {statsLoading
                  ? '...'
                  : stats?.totalPosts?.toLocaleString() || '0'}
              </p>
              <p className="stat-change">Posts created by users</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">
              <MessageCircle size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Comments</h3>
              <p className="stat-value">
                {statsLoading
                  ? '...'
                  : stats?.totalComments?.toLocaleString() || '0'}
              </p>
              <p className="stat-change">Comments on posts</p>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-icon">
              <AlertTriangle size={24} />
            </div>
            <div className="stat-info">
              <h3>Total Reports</h3>
              <p className="stat-value">
                {statsLoading
                  ? '...'
                  : stats?.totalReports?.toLocaleString() || '0'}
              </p>
              <p className="stat-change stat-change-warning">
                {stats?.totalReports > 0 ? 'Needs attention' : 'All clear'}
              </p>
            </div>
          </div>
        </div>
      </div>{' '}
      <div className="admin-section">
        <div className="section-header-with-filter">
          <h2>Recent Activity</h2>
          <select
            className="admin-select admin-select-small"
            value={activityFilter}
            onChange={e => {
              setActivityFilter(e.target.value as 'all' | 'users' | 'posts');
              setActivityPage(1); // Reset to page 1 when filter changes
            }}
          >
            <option value="all">All Activity</option>
            <option value="users">User Registrations</option>
            <option value="posts">Post Creations</option>
          </select>
        </div>

        {activitiesLoading ? (
          <div className="admin-loading">
            <Spinner size="xl" />
          </div>
        ) : currentActivities.length > 0 ? (
          <>
            <div className="admin-grid">
              {currentActivities.map((activity, index) => (
                <div
                  key={`${activity.type}-${activity.timestamp}-${index}`}
                  className="admin-post-card"
                >
                  <div className="post-card-header">
                    <div className="user-cell">
                      {activity.user?.avatarImage?.publicUrl ? (
                        <img
                          src={activity.user.avatarImage.publicUrl}
                          alt={activity.user.username}
                          className="user-avatar-img"
                        />
                      ) : (
                        <div className="user-avatar">
                          {activity.user?.username?.charAt(0).toUpperCase() ||
                            'U'}
                        </div>
                      )}
                      <div>
                        <p className="user-name">
                          {activity.user?.username || 'Unknown User'}
                        </p>
                        <p className="post-time">
                          {getTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="post-card-content">
                    {activity.action === 'created_account' ? (
                      <p>Created a new account</p>
                    ) : (
                      <p>
                        Created post: <strong>{activity.post?.title}</strong>
                      </p>
                    )}
                  </div>
                  <div className="post-card-stats">
                    <span
                      className={`status-badge ${activity.action === 'created_account' ? 'status-success' : 'status-info'}`}
                    >
                      {activity.action === 'created_account'
                        ? 'User Registration'
                        : 'Post Created'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="admin-pagination">
              <Button
                variant="secondary"
                onClick={() => setActivityPage(p => Math.max(1, p - 1))}
                disabled={activityPage === 1}
                icon={<ChevronLeft size={16} />}
                iconPosition="left"
              >
                Previous
              </Button>

              <span className="pagination-info">Page {activityPage}</span>

              <Button
                variant="secondary"
                onClick={() => setActivityPage(p => p + 1)}
                disabled={!hasMore}
                icon={<ChevronRight size={16} />}
                iconPosition="right"
              >
                Next
              </Button>
            </div>
          </>
        ) : (
          <p className="no-activity">No recent activity found.</p>
        )}
      </div>
    </div>
  );
}
