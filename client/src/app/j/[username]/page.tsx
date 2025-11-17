'use client';

import { useParams } from 'next/navigation';
import {
  ProfileEmpty,
  ProfileHeader,
  ProfileTabs,
  ProfileNotFound,
} from '@/components/profile';
import React from 'react';
import { useGetPublicProfile } from '@/hooks';
import { Spinner } from '@/components/ui';

/**
 * Public profile page component - shows any user's public profile
 * Route: /j/[username]
 * @returns {JSX.Element} Public profile page content
 */
export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [activeTab, setActiveTab] = React.useState('videos');

  const {
    data: profile,
    isLoading,
    error,
  } = useGetPublicProfile(username, !!username);

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Spinner size="xl" />
      </div>
    );
  }

  if (error || !profile) {
    return <ProfileNotFound username={username} />;
  }

  return (
    <div
      className="profile-page"
      style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem 0' }}
    >
      <div
        style={{
          background: 'var(--bg-primary)',
          borderRadius: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          padding: '2rem',
        }}
      >
        <ProfileHeader
          username={profile.username}
          bio={profile.bio ?? undefined}
          coverImage={
            profile.coverImage?.publicUrl ||
            'https://placehold.co/1200x300/2d5016/ffffff/png?text=Cover+Image'
          }
          avatarImage={
            profile.avatarImage?.publicUrl ||
            'https://placehold.co/400x400/4a7c59/ffffff/png?text=Avatar'
          }
          location={profile.location}
          isPrivate={profile.isPrivate}
          email={profile.email}
          isEmailVerified={!!profile.otpVerifiedAt}
          firstName={profile.firstName}
          lastName={profile.lastName}
          createdAt={profile.createdAt}
        />
      </div>

      {/* Tabs */}
      <div style={{ marginTop: '2rem' }}>
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: '2rem' }}>
        <ProfileEmpty type={activeTab} isPublic={true} />
      </div>
    </div>
  );
}
