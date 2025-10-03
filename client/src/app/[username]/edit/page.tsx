'use client';

import { useParams, useRouter, notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

interface EditProfileData {
  displayName: string;
  bio: string;
  location: string;
  website: string;
}

/**
 * Edit profile page component - allows users to edit their own profile
 * Route: /[username]/edit
 * @returns {JSX.Element} Edit profile page content
 */
export default function EditProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<EditProfileData>({
    displayName: '',
    bio: '',
    location: '',
    website: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const username = params.username as string;

  // Check if user can edit this profile (must be their own)
  const canEdit = session?.user?.username === username;

  useEffect(() => {
    if (status === 'loading') return;

    if (!canEdit) {
      notFound();
      return;
    }

    // Load current profile data
    const loadProfileData = async () => {
      try {
        setLoading(true);

        // Mock loading profile data - replace with actual API call
        const mockData: EditProfileData = {
          displayName: session?.user?.username || '',
          bio: 'Your bio goes here...',
          location: '',
          website: '',
        };

        await new Promise(resolve => setTimeout(resolve, 500));
        setProfileData(mockData);
      } catch (error) {
        console.error('Failed to load profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [session, canEdit, status]);

  const handleInputChange = (field: keyof EditProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Mock save API call - replace with actual API call
      console.log('Saving profile data:', profileData);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect back to profile
      router.push(`/${username}`);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="edit-profile-page">
        <div className="container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (!canEdit) {
    notFound();
  }

  return (
    <div className="edit-profile-page">
      <div className="container">
        <div className="edit-header">
          <h1>Edit Profile</h1>
          <div className="header-actions">
            <button
              className="btn-cancel"
              onClick={() => router.push(`/${username}`)}
            >
              Cancel
            </button>
            <button className="btn-save" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        <div className="edit-form">
          <div className="form-section">
            <h3>Profile Information</h3>

            <div className="form-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                id="displayName"
                type="text"
                value={profileData.displayName}
                onChange={e => handleInputChange('displayName', e.target.value)}
                placeholder="Your display name"
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={profileData.bio}
                onChange={e => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                maxLength={160}
                rows={3}
              />
              <small className="char-count">{profileData.bio.length}/160</small>
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                value={profileData.location}
                onChange={e => handleInputChange('location', e.target.value)}
                placeholder="Your location"
                maxLength={30}
              />
            </div>

            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                type="url"
                value={profileData.website}
                onChange={e => handleInputChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Avatar</h3>
            <div className="avatar-upload">
              <div className="current-avatar">
                <div className="avatar-placeholder">
                  {profileData.displayName.charAt(0) || 'U'}
                </div>
              </div>
              <button className="btn-upload">Upload Photo</button>
              <p className="upload-note">JPG, PNG, or GIF. Max size 5MB.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
