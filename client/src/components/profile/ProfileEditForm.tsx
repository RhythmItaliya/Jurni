'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  MapPin,
  FileText,
  Camera,
  Upload,
  Lock,
  Mail,
} from 'lucide-react';
import { Button, Input, Card, Select } from '@/components/ui';
import { useReduxToast } from '@/hooks/useReduxToast';
import { useGetMyProfile } from '@/hooks/useProfile';
import {
  getCurrentLocation,
  formatLocation,
  type LocationData,
} from '@/lib/locationUtils';
import { Spinner } from '@/components/ui/Spinner';

interface ProfileEditFormProps {
  onSave: (data: ProfileEditData) => void;
  isLoading?: boolean;
}

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

export default function ProfileEditForm({
  onSave,
  isLoading = false,
}: ProfileEditFormProps) {
  const { showError } = useReduxToast();
  const { data: profileData, isLoading: isLoadingProfile } = useGetMyProfile();

  const [formData, setFormData] = useState<ProfileEditData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    bio: '',
    location: undefined,
    isPrivate: false,
  });

  const [isSendingOTP, setIsSendingOTP] = useState(false);

  const [coverPreview, setCoverPreview] = useState<string>(
    'https://placehold.co/1200x300/2d5016/ffffff/png?text=Cover+Image'
  );
  const [avatarPreview, setAvatarPreview] = useState<string>(
    'https://placehold.co/400x400/4a7c59/ffffff/png?text=Avatar'
  );

  // Populate form with existing profile data
  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName ?? '',
        lastName: profileData.lastName ?? '',
        username: profileData.username,
        email: profileData.email,
        bio: profileData.bio ?? '',
        location: profileData.location ?? undefined,
        isPrivate: profileData.isPrivate,
      });

      // Set cover image preview
      if (profileData.coverImage?.publicUrl) {
        setCoverPreview(profileData.coverImage.publicUrl);
      }

      // Set avatar preview
      if (profileData.avatarImage?.publicUrl) {
        setAvatarPreview(profileData.avatarImage.publicUrl);
      }
    }
  }, [profileData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatarImage: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value === 'true' }));
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      alert('Please enter an email address');
      return;
    }

    setIsSendingOTP(true);
    try {
      // TODO: Implement API call to send OTP
      console.log('Sending OTP to:', formData.email);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('OTP sent to your email!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleGetLocation = () => {
    getCurrentLocation({
      onSuccess: locationData => {
        setFormData(prev => ({ ...prev, location: locationData }));
      },
      onError: (error, details) => {
        showError(error, details || '');
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Show loading state while fetching profile
  if (isLoadingProfile) {
    return (
      <div className="profile-edit-container">
        <motion.div
          className="edit-card-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <Card className="profile-edit-card">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <Spinner size="xl" />
              <p style={{ color: 'var(--text-secondary)' }}>
                Loading profile...
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <form className="profile-edit-container" onSubmit={handleSubmit}>
      <motion.div
        className="edit-card-wrapper"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <Card className="profile-edit-card">
          {/* Cover Image Section */}
          {/* Cover Image Section */}
          <motion.div
            className="edit-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="section-label">
              <Camera size={18} />
              <span>Cover Image</span>
            </div>
            <div className="cover-upload-area">
              <div
                className="cover-preview"
                style={{ backgroundImage: `url(${coverPreview})` }}
              >
                <label className="upload-overlay" htmlFor="cover-upload">
                  <div className="upload-icon">
                    <Upload size={28} />
                  </div>
                  <span className="upload-text">Click to upload cover</span>
                  <span className="upload-hint">1200 x 300px recommended</span>
                </label>
              </div>
              <input
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                style={{ display: 'none' }}
                disabled={isLoading}
              />
            </div>
          </motion.div>

          {/* Avatar Image Section */}
          <motion.div
            className="edit-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="section-label">
              <User size={18} />
              <span>Profile Picture</span>
            </div>
            <div className="avatar-upload-area">
              <div
                className="avatar-preview"
                style={{ backgroundImage: `url(${avatarPreview})` }}
              >
                <label
                  className="avatar-upload-overlay"
                  htmlFor="avatar-upload"
                >
                  <div className="upload-icon">
                    <Upload size={28} />
                  </div>
                  <span className="upload-text">Click to upload avatar</span>
                  <span className="upload-hint">400 x 400px recommended</span>
                </label>
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
                disabled={isLoading}
              />
            </div>
          </motion.div>

          {/* First Name Section */}
          <motion.div
            className="edit-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="section-label">
              <User size={18} />
              <span>First Name</span>
            </div>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              disabled={isLoading}
            />
          </motion.div>

          {/* Last Name Section */}
          <motion.div
            className="edit-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <div className="section-label">
              <User size={18} />
              <span>Last Name</span>
            </div>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              disabled={isLoading}
            />
          </motion.div>

          {/* Username Section */}
          <motion.div
            className="edit-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="section-label">
              <User size={18} />
              <span>Username</span>
            </div>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              disabled={true}
            />
          </motion.div>

          {/* Email Section */}
          <motion.div
            className="edit-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <div className="section-label">
              <Mail size={18} />
              <span>Email Address</span>
            </div>
            <div
              className="email-input-wrapper"
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1 }}>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="button"
                variant="primary"
                onClick={handleSendOTP}
                disabled={isSendingOTP || !formData.email || isLoading}
              >
                {isSendingOTP ? 'Sending...' : 'Send OTP'}
              </Button>
            </div>
          </motion.div>

          {/* Bio Section */}
          <motion.div
            className="edit-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="section-label">
              <FileText size={18} />
              <span>Bio</span>
            </div>
            <div className="textarea-wrapper">
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us about yourself..."
                className="bio-textarea"
                rows={4}
                maxLength={200}
                disabled={isLoading}
              />
              <span className="char-count">
                {formData.bio?.length || 0}/200
              </span>
            </div>
          </motion.div>

          {/* Location Section */}
          <motion.div
            className="edit-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="section-label">
              <MapPin size={18} />
              <span>Location</span>
            </div>
            <div className="location-selector">
              <motion.button
                type="button"
                className="location-button"
                onClick={handleGetLocation}
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    fill="currentColor"
                  />
                </svg>
                <p>Tap to add your location</p>
              </motion.button>
              {formData.location && (
                <motion.div
                  className="selected-location"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="location-name">
                    {formatLocation(formData.location)}
                  </span>
                  <button
                    type="button"
                    className="remove-location"
                    onClick={() =>
                      setFormData(prev => ({ ...prev, location: undefined }))
                    }
                    disabled={isLoading}
                  >
                    ×
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Privacy Section */}
          <motion.div
            className="edit-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <div className="section-label">
              <Lock size={18} />
              <span>Profile Privacy</span>
            </div>
            <Select
              id="isPrivate"
              name="isPrivate"
              value={formData.isPrivate ? 'true' : 'false'}
              onChange={handleSelectChange}
              disabled={isLoading}
              options={[
                {
                  value: 'false',
                  label: 'Public - Anyone can view your profile',
                },
                {
                  value: 'true',
                  label: 'Private - Only you can view your profile',
                },
              ]}
            />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="edit-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span style={{ marginLeft: '0.5rem' }}>Saving...</span>
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </form>
  );
}
