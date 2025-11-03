import { ApiResponse } from './auth';

/**
 * SavePost data structure (matches server SavePost model)
 * @interface SavePostData
 */
export interface SavePostData {
  _id: string;
  userId: {
    _id: string;
    username: string;
  };
  postId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create savepost data interface
 * @interface CreateSavePostData
 */
export interface CreateSavePostData {
  postId: string;
}

/**
 * Unsave data interface (same structure as create)
 * @interface UnsavePostData
 */
export type UnsavePostData = CreateSavePostData;

/**
 * SavePost statistics interface
 * @interface SavePostStats
 */
export interface SavePostStats {
  totalSaves: number;
  isSavedByUser: boolean;
}

/**
 * SavePosts list response data
 * @interface SavePostsListResponseData
 */
export interface SavePostsListResponseData {
  saves: SavePostData[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * API Response types for saveposts
 */
export type SavePostResponse = ApiResponse<SavePostData>;
export type SavePostStatsResponse = ApiResponse<{ stats: SavePostStats }>;
export type SavePostsListResponse = ApiResponse<SavePostsListResponseData>;
