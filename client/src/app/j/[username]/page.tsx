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
import { useSession } from 'next-auth/react';

/**
 * Public profile page component - shows any user's public profile
 * Route: /j/[username]
 * @returns {JSX.Element} Public profile page content
 */
export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = React.useState('videos');

  const {
    data: profile,
    isLoading,
    error,
  } = useGetPublicProfile(username, !!username);

  const isOwnProfile = session?.user?.uuid === profile?.uuid;

  if (isLoading) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 50,
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
          key={profile.uuid}
          userId={profile.uuid}
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
          totalPosts={profile.totalPosts}
          totalLikes={profile.totalLikes}
          totalSaves={profile.totalSaves}
          totalSavedPosts={profile.totalSavedPosts}
          totalLikedPosts={profile.totalLikedPosts}
          followersCount={profile.followersCount}
          followingCount={profile.followingCount}
          isOwnProfile={isOwnProfile}
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
