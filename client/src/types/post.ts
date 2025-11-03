import { ApiResponse } from './auth';

/**
 * Post author information
 * @interface PostAuthor
 */
export interface PostAuthor {
  _id: string;
  username: string;
  fullName?: string;
  avatar?: string;
}

/**
 * Post media item (matches server Media model)
 * @interface PostMedia
 */
export interface PostMedia {
  _id: string;
  userId: string;
  postId?: string;
  key: string;
  url: string;
  publicUrl: string;
  bucket: string;
  mediaType: 'image' | 'video' | 'audio' | 'other';
  thumbnailUrl?: string;
  size?: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

/**
 * Post location information
 * @interface PostLocation
 */
export interface PostLocation {
  name: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

/**
 * Post data structure (matches server schema with populated media)
 * @interface PostData
 */
export interface PostData {
  _id: string;
  id?: string;
  userId: {
    _id: string;
    username: string;
    avatarUrl?: string;
  };
  title: string;
  description?: string;
  hashtags?: string[];
  location?: PostLocation;
  visibility: 'public' | 'friends' | 'followers' | 'private';
  allowComments: boolean;
  allowLikes: boolean;
  allowShares: boolean;
  status: 'active' | 'deleted' | 'archived' | 'draft';
  media?: PostMedia[];
  commentsCount?: number;
  likesCount?: number;
  savesCount?: number;
  isSavedByUser?: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

/**
 * Create post DTO (matches simplified server CreatePostDto)
 * @interface CreatePostData
 */
export interface CreatePostData {
  title: string; // Required by server
  description?: string;
  hashtags?: string[];
  visibility?: 'public' | 'friends' | 'followers' | 'private';
  allowComments?: boolean;
  allowLikes?: boolean;
  allowShares?: boolean;
  location?: PostLocation;
}

/**
 * Upload response
 * @interface UploadResponse
 */
export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    key: string;
    url: string;
    publicUrl: string;
    mediaType: 'image' | 'video' | 'audio';
    size?: number;
    contentType?: string;
  };
  error?: string;
}

/**
 * Posts list response data (matches actual API response)
 */
export interface PostsListResponseData {
  data: PostData[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Post API response types
 */
export type PostsListResponse = ApiResponse<PostsListResponseData>;
export type PostDetailResponse = ApiResponse<PostData>;
export type PostCreateResponse = ApiResponse<PostData>;
export type PostUpdateResponse = ApiResponse<PostData>;
export type PostDeleteResponse = ApiResponse<void>;

/**
 * Props for the PostCard component
 * @interface PostCardProps
 * @property {PostData} post - The post data to display
 * @property {boolean} [isFirstItem] - Whether this is the first item in the list
 * @property {boolean} [isLastItem] - Whether this is the last item in the list
 * @property {(postId: string) => void} [onLike] - Optional like handler
 * @property {(postId: string) => void} [onComment] - Optional comment handler
 * @property {(postId: string) => void} [onShare] - Optional share handler
 * @property {(postId: string) => void} [onBookmark] - Optional bookmark handler
 */
export interface PostCardProps {
  post: PostData;
  isFirstItem?: boolean;
  isLastItem?: boolean;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
}
