/**
 * Follow Types
 * Type definitions for follow-related data
 */

/**
 * Follow user info interface
 * Basic user information for followers/following lists
 */
export interface FollowUser {
  uuid: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarImage?: string;
  isFollowing?: boolean;
}

/**
 * Follow status interface
 * Contains follow relationship status and counts
 */
export interface FollowStatus {
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}

/**
 * Follow counts interface
 * Simple counts for followers and following
 */
export interface FollowCounts {
  followersCount: number;
  followingCount: number;
}
