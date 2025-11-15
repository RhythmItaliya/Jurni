'use client';
import { ProfileEmpty, ProfileHeader, ProfileTabs } from '@/components/profile';
import React from 'react';

/**
 * Profile page component - shows user profile
 * Authentication and layout are handled by ClientLayout
 * @returns {JSX.Element} Profile page content
 */
export default function ProfilePage() {
  // Example user data (replace with actual user data from context/auth)
  const [activeTab, setActiveTab] = React.useState('videos');
  const username = 'rhythm__22';
  const bio = '';
  const handleEdit = () => {
    // TODO: Open edit profile modal
    alert('Edit profile clicked');
  };

  return (
    <div
      className="profile-page"
      style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 0' }}
    >
      {/* Profile Header */}
      <div
        style={{
          background: 'var(--bg-primary)',
          borderRadius: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          padding: '2rem',
        }}
      >
        <ProfileHeader username={username} bio={bio} onEdit={handleEdit} />
      </div>

      {/* Tabs */}
      <div style={{ marginTop: '2rem' }}>
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: '2rem' }}>
        <ProfileEmpty type={activeTab} />
      </div>
    </div>
  );
}
