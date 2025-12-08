'use client';
import React from 'react';
import { ProfileEditForm } from '@/components/profile';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUpdateProfileWithFiles } from '@/hooks/useProfile';
import { UpdateProfileData } from '@/types/profile';
import { LocationData } from '@/types/location';

interface ProfileEditData {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  bio?: string;
  location?: LocationData;
  isPrivate?: boolean;
  coverImage?: File | null;
  avatarImage?: File | null;
}

/**
 * Profile Edit page - allows users to edit their profile
 * @returns {JSX.Element} Profile edit page
 */
export default function ProfileEditPage() {
  const router = useRouter();
  const { mutate: updateProfile, isPending } = useUpdateProfileWithFiles();

  const handleBack = () => {
    router.push('/profile');
  };

  const handleSave = (data: ProfileEditData) => {
    // Extract profile data and files
    const { coverImage, avatarImage, ...profileData } = data;

    const updateData: UpdateProfileData = {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      bio: profileData.bio,
      location: profileData.location,
      isPrivate: profileData.isPrivate,
    };

    // Call the API with profile data and files
    updateProfile(
      {
        profileData: updateData,
        coverImage: coverImage,
        avatarImage: avatarImage,
      },
      {
        onSuccess: () => {
          router.push('/profile');
        },
      }
    );
  };

  return (
    <div className="profile-edit-page">
      <div className="edit-page-container">
        {/* Header with Back Button and Title */}
        <motion.div
          className="edit-page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button onClick={handleBack} className="back-button">
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          <h1 className="edit-page-title">Edit Profile</h1>
        </motion.div>

        {/* Edit Form */}
        <ProfileEditForm onSave={handleSave} isLoading={isPending} />
      </div>
    </div>
  );
}
