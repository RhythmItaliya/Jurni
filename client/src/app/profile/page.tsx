'use client';
import { ProfileEmpty, ProfileHeader, ProfileTabs } from '@/components/profile';
import { Spinner } from '@/components/ui/Spinner';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useGetMyProfile } from '@/hooks/useProfile';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('videos');
  const { data: profile, isLoading } = useGetMyProfile();

  const handleEdit = () => {
    router.push('/profile/edit');
  };

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
          username={profile?.username || ''}
          bio={profile?.bio || ''}
          onEdit={handleEdit}
          coverImage={
            profile?.coverImage?.publicUrl ||
            'https://placehold.co/1200x300/2d5016/ffffff/png?text=Cover+Image'
          }
          avatarImage={
            profile?.avatarImage?.publicUrl ||
            'https://placehold.co/400x400/4a7c59/ffffff/png?text=Avatar'
          }
          location={profile?.location}
          isPrivate={profile?.isPrivate}
          email={profile?.email}
          isEmailVerified={!!profile?.otpVerifiedAt}
          firstName={profile?.firstName}
          lastName={profile?.lastName}
          createdAt={profile?.createdAt}
        />
      </div>

      {/* Tabs */}
      <div style={{ marginTop: '2rem' }}>
        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: '2rem' }}>
        <ProfileEmpty type={activeTab} isPublic={false} />
      </div>
    </div>
  );
}
