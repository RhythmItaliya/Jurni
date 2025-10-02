'use client';

import React from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Card, CardBody } from '../Card';
import { CardHeader } from '../Card';
import { CardFooter } from '../Card';
import { IconButton } from '../IconButton';
import { Spinner } from '../Spinner';
import { PostCardProps } from '@/types/post';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  Navigation,
  EffectFade,
  Virtual,
  Mousewheel,
  Keyboard,
} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/mousewheel';
import 'swiper/css/keyboard';
import '@/styles/components/post/swiper.scss';

export default function PostCard({
  post,
  isFirstItem,
  isLastItem,
}: PostCardProps) {
  const postId = React.useId();
  const swiperRef = React.useRef<SwiperType | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

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
  const currentMedia = media[currentMediaIndex];
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

  return (
    <div className="post-container">
      <Card className="post-card">
        <CardHeader>
          <div className="post-header" />
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
                modules={[
                  Navigation,
                  EffectFade,
                  Virtual,
                  Mousewheel,
                  Keyboard,
                ]}
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
                keyboard={{
                  enabled: true,
                }}
                touchRatio={1.5}
                followFinger={true}
                resistance={false}
                shortSwipes={true}
                longSwipes={true}
                longSwipesRatio={0.2}
                threshold={5}
                touchAngle={45}
                touchMoveStopPropagation={true}
                preventClicks={false}
                preventClicksPropagation={false}
                touchStartPreventDefault={false}
                cssMode={true}
                onSwiper={swiper => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={swiper =>
                  setCurrentMediaIndex(swiper.activeIndex)
                }
              >
                {media.map(item => (
                  <SwiperSlide key={item.id}>
                    {item.type === 'video' ? (
                      <video
                        className="post-video"
                        src={item.url}
                        autoPlay
                        playsInline
                        muted
                        loop
                        onLoadStart={() => setIsLoading(true)}
                        onLoadedData={() => setIsLoading(false)}
                        onError={() => setIsLoading(false)}
                      />
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
          <div className="post-footer" />
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
