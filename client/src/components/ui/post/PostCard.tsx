'use client';

import React from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Card, CardBody } from '../Card';
import { CardHeader } from '../Card';
import { CardFooter } from '../Card';
import { IconButton } from '../IconButton';
import { Spinner } from '../Spinner';
import Avatar from '@/components/ui/Avatar';
import { PostCardProps } from '@/types/post';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade, Mousewheel, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/mousewheel';
import 'swiper/css/keyboard';
import '@/styles/components/post/swiper.scss';

/**
 * PostCard component
 * @param {object} props - Component props
 * @param {import('@/types/post').Post} props.post - Post data (media, author, etc.)
 * @param {boolean} props.isFirstItem - Whether this post is the first in the list
 * @param {boolean} props.isLastItem - Whether this post is the last in the list
 * @returns {JSX.Element}
 */
export default function PostCard({
  onComment,
}: Pick<PostCardProps, 'post' | 'onComment'>) {
  const postId = React.useId();
  const swiperRef = React.useRef<SwiperType | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [playingIndex, setPlayingIndex] = React.useState<number | null>(null);

  const demoMedia = [
    {
      id: '1',
      type: 'image' as const,
      url: 'https://dummyimage.com/500x500/000/fff',
      alt: 'Nature landscape',
    },
    {
      id: '2',
      type: 'video' as const,
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      alt: 'Flower video',
    },
    {
      id: '3',
      type: 'image' as const,
      url: 'https://dummyimage.com/800x800/000/fff',
      alt: 'Urban scene',
    },
  ];

  const media = demoMedia;
  // const currentMedia = media[currentMediaIndex];
  const hasMultipleMedia = media.length > 1;

  // Demo post used intentionally for testing/upload flow.
  // Construct a fully-typed PostData object (no casts) so TypeScript is happy
  // and the demo avatar URL renders correctly.
  const demoPost: import('@/types/post').PostData = {
    _id: 'demo-_id-1',
    id: 'demo-post',
    author: {
      _id: 'demo-user-1',
      username: 'user_1',
      fullName: 'Demo User',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    },
    userId: {
      _id: 'demo-user-1',
      username: 'user_1',
      fullName: 'Demo User',
      avatar:
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
    },
    title: 'Demo post',
    description: 'This is a demo post used for testing the upload flow.',
    hashtags: ['demo'],
    visibility: 'public',
    allowComments: true,
    allowLikes: true,
    allowShares: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Use the demo post for rendering while testing uploads
  const displayPost = demoPost;

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
                src={displayPost?.author?.avatar}
                alt={displayPost?.author?.username}
                size="md"
                className="author-avatar"
              />

              <div className="author-meta">
                <div className="author-username">
                  {displayPost?.author?.username || 'Unknown'}
                </div>
              </div>
            </div>

            <div className="post-header-right">
              <div className="author-location">
                <IconButton
                  variant="ghost"
                  size="sm"
                  className="location-icon-btn"
                  icon={
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src="/img/location.png"
                      alt="location"
                      width={16}
                      height={16}
                    />
                  }
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
                  <SwiperSlide key={item.id}>
                    {item.type === 'video' ? (
                      <div className="video-wrapper">
                        <video
                          className="post-video"
                          src={item.url}
                          playsInline
                          loop
                          muted={playingIndex === idx ? false : true}
                          onLoadStart={() => setIsLoading(true)}
                          onLoadedData={() => setIsLoading(false)}
                          onError={() => setIsLoading(false)}
                          poster={
                            (item as typeof item & { poster?: string })
                              .poster ||
                            (media.find(m => m.type === 'image')?.url ??
                              undefined)
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
                              <circle
                                cx="24"
                                cy="24"
                                r="24"
                                fill="rgba(0,0,0,0.6)"
                              />
                              <path d="M20 16L34 24L20 32V16Z" fill="#fff" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="post-image"
                        src={item.url}
                        alt={item.alt || 'Post image'}
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
            <div className="post-footer-left">
              <IconButton
                variant="ghost"
                size="md"
                className="comment-button"
                aria-label="Open comments"
                onClick={() => {
                  try {
                    console.debug(
                      '[PostCard] comment-button clicked',
                      displayPost.id
                    );
                  } catch {}
                  // ensure we pass a string id to the handler
                  onComment?.(displayPost.id ?? '');
                }}
                icon={
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
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
                  <path
                    d="M10.25 12.5L5.75 8L10.25 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
                  <path
                    d="M5.75 12.5L10.25 8L5.75 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />
          )}
        </div>
      )}
    </div>
  );
}
