/**
 * Post author information
 * @interface PostAuthor
 * @property {string} username - Author's username
 * @property {string} [avatarUrl] - Optional URL to author's avatar
 */
export interface PostAuthor {
  username: string;
  avatarUrl?: string;
}

/**
 * Post media item
 * @interface PostMedia
 * @property {string} id - Unique identifier for the media
 * @property {'image' | 'video'} type - Type of media (image or video)
 * @property {string} url - URL to the media content
 * @property {string} [alt] - Optional alt text for accessibility
 */
export interface PostMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  alt?: string;
}

/**
 * Post data structure
 * @interface PostData
 * @property {string} id - Unique identifier for the post
 * @property {PostAuthor} author - Author information
 * @property {string} createdAt - Post creation timestamp
 * @property {string} [text] - Optional post text content
 * @property {PostMedia[]} [media] - Optional array of media items
 * @property {number} [likeCount] - Optional number of likes
 * @property {number} [commentCount] - Optional number of comments
 * @property {boolean} [isLiked] - Optional flag indicating if the current user liked the post
 */
export interface PostData {
  id: string;
  author: PostAuthor;
  createdAt: string;
  text?: string;
  media?: PostMedia[];
  location?: string;
  likeCount?: number;
  commentCount?: number;
  isLiked?: boolean;
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
