'use client';

import { useParams } from 'next/navigation';
import { useGetPublicProfile } from '@/hooks';

/**
 * Dynamic profile page component - shows any user's profile
 * Route: /[username]
 * @returns {JSX.Element} Profile page content
 */
export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const {
    data: profile,
    isLoading,
    error,
  } = useGetPublicProfile(username, !!username);

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="profile-loading">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="error-message">
            <h2>User not found</h2>
            <p>The user @{username} could not be found.</p>
            {error && (
              <div
                className="error-details"
                style={{
                  marginTop: '20px',
                  padding: '10px',
                  background: '#ffebee',
                  borderRadius: '5px',
                }}
              >
                <h3>Error Details:</h3>
                <pre style={{ fontSize: '12px', color: '#c62828' }}>
                  {JSON.stringify(error, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {profile.firstName && profile.lastName
                ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`
                : profile.username.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="profile-info">
            <h1 className="profile-name">
              {profile.firstName && profile.lastName
                ? `${profile.firstName} ${profile.lastName}`
                : profile.username}
            </h1>
            <p className="profile-username">@{profile.username}</p>
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Following</span>
              </div>
            </div>

            {/* Debug Info */}
            <div
              className="debug-info"
              style={{
                marginTop: '20px',
                padding: '10px',
                background: '#f5f5f5',
                borderRadius: '5px',
              }}
            >
              <h3>Debug Information:</h3>
              <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                {JSON.stringify(profile, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
