/**
 * Profile and Follow Hooks
 * Export all profile and follow-related hooks for easy import
 */

export {
  useGetMyProfile,
  useGetPublicProfile,
  useUpdateProfile,
  useUpdateProfileWithFiles,
  profileKeys,
} from './useProfile';

export {
  useFollowUser,
  useUnfollowUser,
  useGetFollowers,
  useGetFollowing,
  useFollowStatus,
  followKeys,
} from './useFollow';

/**
 * Admin Hooks
 * Export all admin-related hooks for easy import
 */
export {
  useAdminLogin,
  useAdminLogout,
  useAdminRegister,
  useGetAdmins,
  useGetAdmin,
  useUpdateAdmin,
  useChangeAdminPassword,
  useDeleteAdmin,
  useAdminSession,
  useIsAdminAuthenticated,
  adminKeys,
} from './useAdmin';

/**
 * Admin Users Hooks
 * Export all admin users management hooks for easy import
 */
export {
  useAdminGetAllUsers,
  useAdminGetUserByUuid,
  useAdminUpdateUser,
  useAdminDeleteUser,
  adminUsersKeys,
} from './useAdminUsers';

/**
 * Admin Comments Hooks
 */
export {
  useAdminGetAllComments,
  useAdminGetCommentsStats,
  useAdminDeleteComment,
  type AdminComment,
  type AdminCommentsResponse,
  type AdminCommentsStats,
} from './useAdminComments';

/**
 * Admin Activity Hooks
 * Export all admin activity hooks for easy import
 */
export {
  useAdminGetRecentActivity,
  type ActivityItem,
  type ActivityUser,
} from './useAdminActivity';

/**
 * Reports Hooks
 * Export all report-related hooks for easy import
 */
export { useReportPost, useReportUser } from './useReport';

/**
 * Search Hooks
 * Export all search-related hooks for easy import
 */
export {
  useSearchUsers,
  useSearchPosts,
  useSearchHashtags,
  useSearch,
  searchKeys,
} from './useSearch';

/**
 * Suggestions Hooks
 * Export all suggestions-related hooks for easy import
 */
export {
  useSuggestions,
  useTrendingHashtags,
  suggestionsKeys,
  type SuggestedUser,
  type TrendingHashtag,
} from './useSuggestions';
