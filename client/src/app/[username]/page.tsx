'use client';

import { useParams, useRouter, notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  isFollowing?: boolean;
  isOwner?: boolean;
}

/**
 * Dynamic profile page component - shows any user's profile
 * Route: /[username]
 * @returns {JSX.Element} Profile page content
 */
export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const username = params.username as string;

  useEffect(() => {
    if (!username) return;

    // Simulate fetching profile data
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Mock profile data - replace with actual API call
        const mockProfile: ProfileData = {
          username: username,
          displayName: username.charAt(0).toUpperCase() + username.slice(1),
          bio: `Welcome to ${username}'s profile`,
          followers: Math.floor(Math.random() * 1000),
          following: Math.floor(Math.random() * 500),
          posts: Math.floor(Math.random() * 100),
          isOwner: session?.user?.username === username,
          isFollowing: Math.random() > 0.5,
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setProfileData(mockProfile);
      } catch (err) {
        setError('Failed to load profile');
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [username, session]);

  if (loading) {
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

  if (error || !profileData) {
    notFound();
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-placeholder">
              {profileData.displayName.charAt(0)}
            </div>
          </div>

          <div className="profile-info">
            <h1 className="profile-name">{profileData.displayName}</h1>
            <p className="profile-username">@{profileData.username}</p>
            <p className="profile-bio">{profileData.bio}</p>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{profileData.posts}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{profileData.followers}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{profileData.following}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            {profileData.isOwner ? (
              <button
                className="btn-edit"
                onClick={() => router.push(`/${username}/edit`)}
              >
                Edit Profile
              </button>
            ) : (
              <button
                className={`btn-follow ${profileData.isFollowing ? 'following' : ''}`}
              >
                {profileData.isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="profile-content">
          <div className="profile-tabs">
            <button className="tab-item active">Posts</button>
            <button className="tab-item">Media</button>
            <button className="tab-item">Likes</button>
          </div>

          <div className="profile-posts">
            <p className="page-description">
              {profileData.username}&apos;s posts will appear here...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
