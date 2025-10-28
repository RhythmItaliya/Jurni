import { ApiResponse } from './auth';

/**
 * Comment data structure (matches server Comment model)
 * @interface CommentData
 */
export interface CommentData {
  _id: string;
  userId: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
  postId: string;
  content: string;
  parentId?: string;
  status: 'active' | 'deleted';
  likesCount: number;
  repliesCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create comment data interface
 * @interface CreateCommentData
 */
export interface CreateCommentData {
  content: string;
  parentId?: string;
}

/**
 * Update comment data interface
 * @interface UpdateCommentData
 */
export interface UpdateCommentData {
  content: string;
}

/**
 * Comments list response data
 * @interface CommentsListResponseData
 */
export interface CommentsListResponseData {
  comments: CommentData[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Comment API response types
 */
export type CommentResponse = ApiResponse<CommentData>;
export type CommentsListResponse = ApiResponse<CommentData[]>;
export type CommentCreateResponse = ApiResponse<CommentData>;
export type CommentUpdateResponse = ApiResponse<CommentData>;
export type CommentDeleteResponse = ApiResponse<void>;
