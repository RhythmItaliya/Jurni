'use client';
import {
  ProfileEmpty,
  ProfileHeader,
  ProfileTabs,
  ProfileTabContent,
} from '@/components/profile';
import { Spinner } from '@/components/ui/Spinner';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useGetMyProfile } from '@/hooks/useProfile';
import {
  useGetMyPosts,
  useGetMySavedPosts,
  useGetMyLikedPosts,
} from '@/hooks/usePosts';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('posts');
  const { data: profile, isLoading: profileLoading } = useGetMyProfile();

  // Conditionally fetch data based on active tab
  const { data: myPostsData, isLoading: myPostsLoading } = useGetMyPosts({
    enabled: activeTab === 'posts',
  });

  const { data: savedPostsData, isLoading: savedPostsLoading } =
    useGetMySavedPosts({ enabled: activeTab === 'saved' });

  const { data: likedPostsData, isLoading: likedPostsLoading } =
    useGetMyLikedPosts({ enabled: activeTab === 'liked' });

  const handleEdit = () => {
    router.push('/profile/edit');
  };

  // Determine loading state and posts based on active tab
  const getCurrentTabData = () => {
    switch (activeTab) {
      case 'posts':
        return {
          posts: myPostsData?.posts || [],
          isLoading: myPostsLoading,
        };
      case 'saved':
        return {
          posts: savedPostsData?.posts || [],
          isLoading: savedPostsLoading,
        };
      case 'liked':
        return {
          posts: likedPostsData?.posts || [],
          isLoading: likedPostsLoading,
        };
      default:
        return {
          posts: [],
          isLoading: false,
        };
    }
  };

  const { posts: currentPosts, isLoading: currentLoading } =
    getCurrentTabData();

  if (profileLoading) {
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
          key={profile?.uuid}
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
          totalPosts={profile?.totalPosts}
          totalLikes={profile?.totalLikes}
          totalSaves={profile?.totalSaves}
          totalSavedPosts={profile?.totalSavedPosts}
          totalLikedPosts={profile?.totalLikedPosts}
          followersCount={profile?.followersCount}
          followingCount={profile?.followingCount}
          isOwnProfile={true}
        />
      </div>

      {/* Tabs */}
      <div style={{ marginTop: '2rem' }}>
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          totalPosts={profile?.totalPosts}
          totalSavedPosts={profile?.totalSavedPosts}
          totalLikedPosts={profile?.totalLikedPosts}
        />
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: '2rem' }}>
        {currentLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '40vh',
            }}
          >
            <Spinner size="lg" />
          </div>
        ) : currentPosts.length > 0 ? (
          <ProfileTabContent
            posts={currentPosts}
            isLoading={currentLoading}
            type={activeTab as 'posts' | 'saved' | 'liked'}
          />
        ) : (
          <ProfileEmpty type={activeTab} isPublic={false} />
        )}
      </div>
    </div>
  );
}
