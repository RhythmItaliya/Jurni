'use client';

import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { useGetPublicProfile } from '@/hooks/useProfile';
import { ProfileNotFound } from '@/components/profile/ProfileNotFound';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { Spinner } from '@/components/ui';

/**
 * Profile page component
 * Route: /profile/[username]
 * Displays a user's public profile
 * @returns {JSX.Element} Profile page content
 */
export default function ProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [activeTab, setActiveTab] = useState('posts');

  const { data: profile, isLoading, error } = useGetPublicProfile(username);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error || !profile) {
    return <ProfileNotFound username={username} />;
  }

  return (
    <div className="profile-page">
      <ProfileHeader
        key={profile.uuid}
        username={profile.username}
        bio={profile.bio || undefined}
        coverImage={profile.coverImage?.publicUrl}
        avatarImage={profile.avatarImage?.publicUrl}
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
        isOwnProfile={false}
      />
      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalPosts={profile.totalPosts}
        totalSavedPosts={profile.totalSavedPosts}
        totalLikedPosts={profile.totalLikedPosts}
      />
    </div>
  );
}
