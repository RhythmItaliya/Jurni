'use client';

import { useParams } from 'next/navigation';
import {
  ProfileEmpty,
  ProfileHeader,
  ProfileTabs,
  ProfileNotFound,
  ProfileTabContent,
} from '@/components/profile';
import React from 'react';
import { useGetPublicProfile } from '@/hooks';
import {
  useGetUserPosts,
  useGetUserSavedPosts,
  useGetUserLikedPosts,
} from '@/hooks/usePosts';
import { Spinner } from '@/components/ui';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/store/hooks';
import { openSidebar } from '@/store/slices/sidebarSlice';

/**
 * Public profile page component - shows any user's public profile
 * Route: /j/[username]
 * @returns {JSX.Element} Public profile page content
 */
export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = React.useState('posts');

  const {
    data: profile,
    isLoading,
    error,
  } = useGetPublicProfile(username, !!username);

  // Fetch user posts when profile is loaded - use _id for MongoDB queries
  const { data: userPostsData, isLoading: userPostsLoading } = useGetUserPosts(
    profile?._id || '',
    {}
  );

  // Fetch user saved posts
  const { data: savedPostsData, isLoading: savedPostsLoading } =
    useGetUserSavedPosts(profile?._id || '', {});

  // Fetch user liked posts
  const { data: likedPostsData, isLoading: likedPostsLoading } =
    useGetUserLikedPosts(profile?._id || '', {});

  const isOwnProfile = session?.user?.uuid === profile?.uuid;

  // Get current tab data
  const getCurrentTabData = () => {
    switch (activeTab) {
      case 'posts':
        return {
          posts: userPostsData?.posts || [],
          isLoading: userPostsLoading,
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
          onFollowersClick={() =>
            dispatch(
              openSidebar({
                contentType: 'followers',
                userId: profile.uuid,
              })
            )
          }
          onFollowingClick={() =>
            dispatch(
              openSidebar({
                contentType: 'following',
                userId: profile.uuid,
              })
            )
          }
        />
      </div>

      {/* Tabs */}
      <div style={{ marginTop: '2rem' }}>
        <ProfileTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          totalPosts={profile.totalPosts}
          totalSavedPosts={profile.totalSavedPosts}
          totalLikedPosts={profile.totalLikedPosts}
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
          <ProfileEmpty type={activeTab} isPublic={true} />
        )}
      </div>
    </div>
  );
}
