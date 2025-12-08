/**
 * Profile Types
 * Type definitions for user profile data
 */

import { LocationData } from './location';

/**
 * Media object interface
 * Matches the Media model structure from the backend
 */
export interface MediaObject {
  key: string;
  url: string;
  publicUrl: string;
  bucket: string;
  size?: number;
  contentType?: string;
  mediaId?: string;
  mediaType?: string;
  thumbnailUrl?: string;
}

/**
 * Profile update data interface
 * Used for updating user profile information
 */
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  coverImage?: MediaObject;
  location?: LocationData;
  isPrivate?: boolean;
}

/**
 * Public profile response interface
 * Data returned when fetching a user's public profile
 */
export interface PublicProfile {
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  coverImage?: MediaObject;
  location?: LocationData;
  isPrivate: boolean;
  avatarImage?: MediaObject;
}

/**
 * Profile response interface
 * Complete profile data with timestamps
 */
export interface ProfileData extends PublicProfile {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Complete profile response interface for editing
 * Includes ALL fields from both User and Profile tables
 */
export interface CompleteProfile {
  // User table fields
  uuid: string;
  username: string;
  email: string;
  avatarImage: MediaObject | null;
  isActive: boolean;
  otpVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;

  // Profile table fields
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  coverImage: MediaObject | null;
  location: LocationData | null;
  isPrivate: boolean;

  // Statistics
  totalPosts: number;
  totalLikes: number;
  totalSaves: number;
  totalSavedPosts: number;
  totalLikedPosts: number;
  followersCount: number;
  followingCount: number;
}
