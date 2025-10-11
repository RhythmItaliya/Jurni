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
 * Post media item
 * @interface PostMedia
 */
export interface PostMedia {
  url: string;
  type: 'image' | 'video' | 'audio';
  alt?: string;
  caption?: string;
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
 * Post metrics
 * @interface PostMetrics
 */
export interface PostMetrics {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  views: number;
  engagement: number;
}

/**
 * Post data structure (matches server schema)
 * @interface PostData
 */
export interface PostData {
  _id: string;
  userId: PostAuthor;
  title?: string;
  description?: string;
  media?: PostMedia[];
  location?: PostLocation;
  hashtags?: string[];
  mentions?: string[];
  visibility: 'public' | 'friends' | 'followers' | 'private';
  allowComments: boolean;
  allowLikes: boolean;
  allowShares: boolean;
  status: 'draft' | 'active' | 'archived' | 'deleted';
  scheduledAt?: string;
  originalPostId?: string;
  metrics: PostMetrics;
  likedBy: string[];
  savedBy: string[];
  sharedBy: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Create post DTO
 * @interface CreatePostData
 */
export interface CreatePostData {
  title?: string;
  description?: string;
  media?: PostMedia[];
  location?: PostLocation;
  hashtags?: string[];
  mentions?: string[];
  visibility?: 'public' | 'friends' | 'followers' | 'private';
  allowComments?: boolean;
  allowLikes?: boolean;
  allowShares?: boolean;
  scheduledAt?: string;
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
 * Post API response
 * @interface PostApiResponse
 */
export interface PostApiResponse {
  success: boolean;
  message: string;
  data?: PostData | PostData[] | {
    posts: PostData[];
    total: number;
    page: number;
    totalPages: number;
  };
  error?: string;
}

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
