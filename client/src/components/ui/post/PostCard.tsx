'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import type { Swiper as SwiperType } from 'swiper';
import { Card, CardBody } from '../Card';
import { CardHeader } from '../Card';
import { CardFooter } from '../Card';
import { IconButton } from '../IconButton';
import { Spinner } from '../Spinner';
import Avatar from '@/components/ui/Avatar';
import { useSession } from 'next-auth/react';
import {
  useFollowStatus,
  useFollowUser,
  useUnfollowUser,
} from '@/hooks/useFollow';
import { UserPlus, UserCheck, MoreVertical, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PostCardProps } from '@/types/post';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade, Mousewheel, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/mousewheel';
import 'swiper/css/keyboard';
import '@/styles/components/post/swiper.scss';
import PostActions from './PostActions';
import PostHeaderActions from './PostHeaderActions';
import { useLikeStats, useLikeTarget, useUnlikeTarget } from '@/hooks/useLikes';
import {
  useSavePostStats,
  useSavePost,
  useUnsavePost,
} from '@/hooks/useSavePosts';
import { useReduxToast } from '@/hooks/useReduxToast';
import ReportModal from '../ReportModal';

/**
 * PostCard component
 * @param {object} props - Component props
 * @param {import('@/types/post').Post} props.post - Post data (media, author, etc.)
 * @param {boolean} props.isFirstItem - Whether this post is the first in the list
 * @param {boolean} props.isLastItem - Whether this post is the last in the list
 * @returns {JSX.Element}
 */
export default function PostCard({
  post,
  onComment,
}: Pick<PostCardProps, 'post' | 'onComment'>) {
  const postId = React.useId();
  const router = useRouter();
  const swiperRef = React.useRef<SwiperType | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [playingIndex, setPlayingIndex] = React.useState<number | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] =
    React.useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = React.useState(false);

  // Like functionality with local state for real-time updates
  const { data: likeStats } = useLikeStats('post', post._id);
  const [localLikeStats, setLocalLikeStats] = React.useState({
    totalLikes: post.likesCount ?? 0,
    isLikedByUser: likeStats?.isLikedByUser ?? false,
  });

  // Update local state when server data changes
  React.useEffect(() => {
    setLocalLikeStats(prev => ({
      totalLikes: post.likesCount ?? 0,
      isLikedByUser: likeStats?.isLikedByUser ?? prev.isLikedByUser,
    }));
  }, [post.likesCount, likeStats?.isLikedByUser]);

  const likeMutation = useLikeTarget();
  const unlikeMutation = useUnlikeTarget();

  // Follow functionality
  const { data: session, status: sessionStatus } = useSession();
  const { showWarning } = useReduxToast();
  const { data: followStatus } = useFollowStatus(
    post.userId?.uuid,
    !!post.userId?.uuid && sessionStatus === 'authenticated'
  );
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  const isOwnPost = session?.user?.uuid === post.userId?.uuid;

  const handleLike = React.useCallback(() => {
    if (sessionStatus === 'unauthenticated') {
      showWarning('Login Required', 'You need to be logged in to like posts.');
      return;
    }

    const wasLiked = localLikeStats.isLikedByUser;
    const newLikeCount = wasLiked
      ? localLikeStats.totalLikes - 1
      : localLikeStats.totalLikes + 1;

    // Optimistic update
    setLocalLikeStats({
      totalLikes: newLikeCount,
      isLikedByUser: !wasLiked,
    });

    // Perform the actual mutation
    const mutation = wasLiked ? unlikeMutation : likeMutation;
    mutation.mutate(
      { targetType: 'post', targetId: post._id },
      {
        onError: () => {
          // Revert optimistic update on error
          setLocalLikeStats({
            totalLikes: localLikeStats.totalLikes,
            isLikedByUser: wasLiked,
          });
        },
      }
    );
  }, [
    localLikeStats,
    likeMutation,
    unlikeMutation,
    post._id,
    sessionStatus,
    showWarning,
  ]);

  // Save functionality with local state for real-time updates
  const { data: saveStats } = useSavePostStats(post._id);
  const [localSaveStats, setLocalSaveStats] = React.useState({
    totalSaves: 0,
    isSavedByUser: false,
  });

  // Update local state when server data changes
  React.useEffect(() => {
    setLocalSaveStats({
      totalSaves: saveStats?.totalSaves ?? 0,
      isSavedByUser: saveStats?.isSavedByUser ?? false,
    });
  }, [saveStats?.isSavedByUser, saveStats?.totalSaves]);

  const saveMutation = useSavePost();
  const unsaveMutation = useUnsavePost();

  const handleSave = React.useCallback(() => {
    if (sessionStatus === 'unauthenticated') {
      showWarning('Login Required', 'You need to be logged in to save posts.');
      return;
    }

    const wasSaved = localSaveStats.isSavedByUser;
    const newSaveCount = wasSaved
      ? localSaveStats.totalSaves - 1
      : localSaveStats.totalSaves + 1;

    // Optimistic update
    setLocalSaveStats({
      totalSaves: newSaveCount,
      isSavedByUser: !wasSaved,
    });

    // Perform the actual mutation
    const mutation = wasSaved ? unsaveMutation : saveMutation;
    mutation.mutate(
      { postId: post._id },
      {
        onError: () => {
          // Revert optimistic update on error
          setLocalSaveStats({
            totalSaves: localSaveStats.totalSaves,
            isSavedByUser: wasSaved,
          });
        },
      }
    );
  }, [
    localSaveStats,
    saveMutation,
    unsaveMutation,
    post._id,
    sessionStatus,
    showWarning,
  ]);
  const media = post.media || [];
  const hasMultipleMedia = media.length > 1;

  const handlePrevious = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handleHashtagClick = (hashtag: string) => {
    router.push(`/p/h/${hashtag}`);
  };

  const playVideoAtIndex = (index: number) => {
    const slideEl = swiperRef.current?.slides[index];
    if (!slideEl) return;
    const v = slideEl.querySelector('video') as HTMLVideoElement | null;
    if (!v) return;

    swiperRef.current?.slides.forEach((s, idx) => {
      const other = s.querySelector('video') as HTMLVideoElement | null;
      if (other && idx !== index) {
        other.pause();
        try {
          other.currentTime = 0;
        } catch {
          /* ignore */
        }
      }
    });

    v.muted = false;
    v.play()
      .then(() => {
        setPlayingIndex(index);
        setIsLoading(false);
      })
      .catch(err => {
        console.warn('Video playback failed on user-initiated play:', err);
        setPlayingIndex(null);
      });
  };

  return (
    <div className="post-container">
      <Card className="post-card">
        <CardHeader>
          <div className="post-header">
            <div className="author">
              <Avatar
                src={post?.userId?.avatarImage?.publicUrl || undefined}
                alt={post?.userId?.username}
                size="md"
                className="author-avatar"
              />

              <div className="author-meta">
                <div className="author-username">
                  {post?.userId?.username || 'Unknown'}
                </div>
              </div>
              {!isOwnPost && sessionStatus === 'authenticated' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`author-follow-btn ${followStatus?.isFollowing ? 'following' : ''}`}
                  onClick={() => {
                    if (followStatus?.isFollowing) {
                      unfollowUser.mutate(post.userId.uuid);
                    } else {
                      followUser.mutate(post.userId.uuid);
                    }
                  }}
                  disabled={followUser.isPending || unfollowUser.isPending}
                  icon={
                    followStatus?.isFollowing ? (
                      <UserCheck size={14} />
                    ) : (
                      <UserPlus size={14} />
                    )
                  }
                  iconPosition="left"
                >
                  {followStatus?.isFollowing ? 'Following' : 'Follow'}
                </Button>
              )}
            </div>

            <div className="post-header-right">
              <PostHeaderActions
                isOwnPost={isOwnPost}
                onReport={() => {
                  setIsReportModalOpen(true);
                }}
                onDelete={() => {
                  console.log('Delete post:', post._id);
                  // TODO: Implement delete functionality
                }}
                onShare={() => {
                  console.log('Share post:', post._id);
                  // TODO: Implement share functionality
                }}
              />
              <div className="author-location">
                <IconButton
                  variant="ghost"
                  size="sm"
                  className="location-icon-btn"
                  icon={<MapPin size={16} />}
                  aria-label="Post location"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardBody className="post-card-body">
          <div className="post-body">
            <div className="post-media">
              {isLoading && (
                <div className="media-loading">
                  <Spinner size="lg" />
                </div>
              )}
              <Swiper
                modules={[Navigation, EffectFade, Mousewheel, Keyboard]}
                navigation={false}
                effect="fade"
                speed={300}
                loop={false}
                className={`post-swiper post-${postId}`}
                grabCursor={true}
                mousewheel={{
                  forceToAxis: true,
                  sensitivity: 1,
                }}
                keyboard={{ enabled: true }}
                slidesPerView={1}
                touchEventsTarget={'container'}
                passiveListeners={false}
                allowTouchMove={true}
                touchRatio={1}
                threshold={3}
                touchAngle={30}
                preventClicks={true}
                preventClicksPropagation={false}
                touchStartPreventDefault={false}
                onSwiper={swiper => {
                  swiperRef.current = swiper;
                  const activeSlide = swiper.slides[swiper.activeIndex];
                  const videoElement = activeSlide?.querySelector('video');
                  if (videoElement) {
                    videoElement.muted = true;
                    videoElement.play().catch(() => {
                      console.warn('Autoplay prevented on initial slide.');
                    });
                  }
                }}
                onSlideChange={swiper =>
                  setCurrentMediaIndex(swiper.activeIndex)
                }
                onSlideChangeTransitionEnd={swiper => {
                  swiper.slides.forEach((slideEl, idx) => {
                    const v = slideEl.querySelector(
                      'video'
                    ) as HTMLVideoElement | null;
                    if (v) {
                      if (idx === swiper.activeIndex) {
                        v.muted = true;
                        v.play().catch(() => {});
                      } else {
                        v.pause();
                        try {
                          v.currentTime = 0;
                        } catch {}
                      }
                    }
                  });
                }}
              >
                {media.map((item, idx) => (
                  <SwiperSlide key={item._id}>
                    {item.mediaType === 'video' ? (
                      <div className="video-wrapper">
                        <video
                          className="post-video"
                          src={item.publicUrl}
                          playsInline
                          loop
                          muted={playingIndex === idx ? false : true}
                          onLoadStart={() => setIsLoading(true)}
                          onLoadedData={() => setIsLoading(false)}
                          onError={() => setIsLoading(false)}
                          poster={
                            ((item as typeof item & { poster?: string })
                              .poster ||
                              media.find(m => m.mediaType === 'image')
                                ?.publicUrl) ??
                            undefined
                          }
                          draggable={false}
                        />
                        {playingIndex !== idx && (
                          <button
                            className="video-play-overlay"
                            aria-label="Play video"
                            onClick={() => playVideoAtIndex(idx)}
                          >
                            <svg
                              width="48"
                              height="48"
                              viewBox="0 0 48 48"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <use href="/icons.svg#icon-play" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="post-image"
                        src={item.publicUrl}
                        alt={`Post media ${idx + 1}`}
                        loading="lazy"
                        onLoadStart={() => setIsLoading(true)}
                        onLoad={() => setIsLoading(false)}
                        onError={() => setIsLoading(false)}
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <div className="post-footer">
            {post.description && (
              <div className="post-description-section">
                <p
                  className={`post-description ${isDescriptionExpanded ? 'expanded' : 'collapsed'}`}
                >
                  {post.description}
                </p>
                {post.description.length > 150 && (
                  <button
                    className="description-toggle"
                    onClick={() =>
                      setIsDescriptionExpanded(!isDescriptionExpanded)
                    }
                  >
                    {isDescriptionExpanded ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            )}
            {post.hashtags && post.hashtags.length > 0 && (
              <div className="post-hashtags">
                {post.hashtags.map((hashtag, idx) => (
                  <button
                    key={idx}
                    className="hashtag"
                    onClick={() => handleHashtagClick(hashtag)}
                  >
                    #{hashtag}
                  </button>
                ))}
              </div>
            )}
            <div className="post-footer-actions">
              <PostActions
                isLiked={localLikeStats.isLikedByUser}
                likeCount={localLikeStats.totalLikes}
                commentCount={post.commentsCount}
                isSaved={localSaveStats.isSavedByUser}
                saveCount={localSaveStats.totalSaves}
                onLike={handleLike}
                onSave={handleSave}
                onComment={() => {
                  try {
                    console.debug(
                      '[PostCard] comment-button clicked',
                      post._id
                    );
                  } catch {}
                  onComment?.(post._id ?? '');
                }}
              />
            </div>
          </div>
        </CardFooter>
      </Card>

      {hasMultipleMedia && (
        <div className="navigation-arrows">
          {currentMediaIndex > 0 && (
            <IconButton
              variant="ghost"
              size="md"
              className="prev"
              onClick={handlePrevious}
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="/icons.svg#icon-chevron-left" />
                </svg>
              }
            />
          )}
          {currentMediaIndex < media.length - 1 && (
            <IconButton
              variant="ghost"
              size="md"
              className="next"
              onClick={handleNext}
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <use href="/icons.svg#icon-chevron-right" />
                </svg>
              }
            />
          )}
        </div>
      )}

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        postId={post._id}
        postAuthor={post.userId?.username}
        isOwnPost={isOwnPost}
      />
    </div>
  );
}
