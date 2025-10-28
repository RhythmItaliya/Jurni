import { ApiResponse } from './auth';

/**
 * Like data structure (matches server Like model)
 * @interface LikeData
 */
export interface LikeData {
  _id: string;
  userId: {
    _id: string;
    username: string;
  };
  targetType: 'post' | 'comment';
  targetId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create like data interface
 * @interface CreateLikeData
 */
export interface CreateLikeData {
  targetType: 'post' | 'comment';
  targetId: string;
}

/**
 * Unlike data interface (same structure as create)
 * @interface UnlikeData
 */
export type UnlikeData = CreateLikeData;

/**
 * Like statistics interface
 * @interface LikeStats
 */
export interface LikeStats {
  totalLikes: number;
  isLikedByUser: boolean;
}

/**
 * Likes list response data
 * @interface LikesListResponseData
 */
export interface LikesListResponseData {
  likes: LikeData[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Like API response types
 */
export type LikeResponse = ApiResponse<LikeData>;
export type LikeStatsResponse = ApiResponse<LikeStats>;
export type LikesListResponse = ApiResponse<LikesListResponseData>;
