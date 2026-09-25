'use client';

import httpClient from '@/shared/config/api/httpClient';
import { GET_VIDEO_COMMENTS } from '@/shared/config/api/URLs';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/shared/ui/carousel';
import { cn } from '@/shared/lib/utils';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import { useQuery } from '@tanstack/react-query';
import { Pause, Play, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useLayoutEffect, useRef, useState, type SyntheticEvent } from 'react';

type VideoItem = {
  id: number;
  caption_foto: string;
  duration: string;
  location: string;
  stream_url: string;
};

const SWIPE_HINT_KEY = 'st-video-swipe-hint';

function readVideos(payload: unknown): VideoItem[] {
  if (!payload || typeof payload !== 'object') return [];
  const body = payload as { data?: unknown };
  if (Array.isArray(body.data)) return body.data as VideoItem[];
  if (Array.isArray(payload)) return payload as VideoItem[];
  return [];
}

const DESKTOP_VISIBLE = 7;

type VideoSlide = {
  item: VideoItem;
  sourceIndex: number;
  key: string;
};

function buildVideoSlides(videos: VideoItem[]): VideoSlide[] {
  if (videos.length === 0) return [];
  const copies = videos.length >= DESKTOP_VISIBLE ? 1 : Math.ceil(DESKTOP_VISIBLE / videos.length);
  const filledCount = videos.length * copies;
  const rounds = filledCount >= DESKTOP_VISIBLE * 2 ? 1 : 2;
  const total = videos.length * copies * rounds;
  return Array.from({ length: total }, (_, index) => {
    const sourceIndex = index % videos.length;
    return {
      item: videos[sourceIndex],
      sourceIndex,
      key: `${videos[sourceIndex].id}-${index}`,
    };
  });
}

function loopDistance(index: number, selectedIndex: number, total: number) {
  if (total <= 1) return 0;
  let diff = index - selectedIndex;
  const half = total / 2;
  if (diff > half) diff -= total;
  if (diff < -half) diff += total;
  return diff;
}

function videoCardPose(distance: number) {
  const abs = Math.abs(distance);
  const toRight = distance > 0;
  if (abs === 0) {
    return {
      item: 'z-[5]',
      card: 'scale-100 translate-y-0 shadow-[0_12px_28px_rgba(16,24,40,0.16)]',
    };
  }
  if (abs === 1) {
    return {
      item: 'z-[4]',
      card: cn(
        'scale-[0.92] translate-y-2.5 shadow-[0_6px_16px_rgba(16,24,40,0.07)] md:translate-y-3 xl:translate-y-[14px]',
        toRight
          ? '-translate-x-[12%] -rotate-[1deg] xl:translate-x-0'
          : 'translate-x-[12%] rotate-[1deg] xl:translate-x-0',
      ),
    };
  }
  if (abs === 2) {
    return {
      item: 'z-[3]',
      card: cn(
        'scale-[0.82] translate-y-5 shadow-[0_4px_12px_rgba(16,24,40,0.05)] xl:scale-[0.8] xl:translate-y-[26px]',
        toRight ? '-translate-x-[16%] xl:translate-x-0' : 'translate-x-[16%] xl:translate-x-0',
      ),
    };
  }
  return {
    item: 'z-[2]',
    card: cn(
      'scale-[0.78] translate-y-6 shadow-[0_4px_12px_rgba(16,24,40,0.04)]',
      toRight ? '-translate-x-[10%] xl:translate-x-0' : 'translate-x-[10%] xl:translate-x-0',
    ),
  };
}

function streamSrc(item: VideoItem) {
  const base = (process.env.NEXT_PUBLIC_API_URL || 'https://simple-travel.felixits.uz').replace(
    /\/$/,
    '',
  );
  if (item.stream_url) {
    try {
      const stream = new URL(item.stream_url);
      const api = new URL(base);
      if (stream.hostname === api.hostname) {
        stream.protocol = api.protocol;
        return stream.toString();
      }
    } catch {
      return item.stream_url;
    }
    return item.stream_url;
  }
  return `${base}${GET_VIDEO_COMMENTS}${item.id}/stream/`;
}

const VideoReviews = () => {
  const t = useTranslations();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [selected, setSelected] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['home-video-comments'],
    queryFn: () => httpClient.get(GET_VIDEO_COMMENTS),
    staleTime: 1000 * 60 * 5,
  });

  const videos = readVideos(data?.data);
  const slides = buildVideoSlides(videos);
  const startIndex = slides.length > 1 ? Math.floor(slides.length / 2) : 0;

  useLayoutEffect(() => {
    if (!carouselApi) return;
    const update = () => {
      setSelected(carouselApi.selectedScrollSnap());
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    update();
    carouselApi.on('select', update);
    carouselApi.on('reInit', update);
    return () => {
      carouselApi.off('select', update);
      carouselApi.off('reInit', update);
    };
  }, [carouselApi]);

  if (isError || (!isLoading && videos.length === 0)) return null;

  const openAt = (index: number) => {
    if (!videos.length) return;
    setActiveIndex(Math.min(Math.max(index, 0), videos.length - 1));
  };

  return (
    <section>
      <div className="custom-container">
        <div className="mx-auto w-full max-w-[353px] rounded-[14px] bg-white px-4 pb-4 pt-4 shadow-[0_2px_4px_rgba(0,0,0,0.15)] md:max-w-[1240px] md:px-6 md:pb-6 md:pt-6 md:shadow-[0_2px_20px_rgba(0,0,0,0.15)]">
          <div className="flex w-full items-start justify-between gap-3 md:items-center">
            <div className="flex min-w-0 flex-col gap-2">
              <h2 className="text-[20px] font-bold leading-6 text-[#1C1C1E] md:text-[32px] md:leading-[44px]">
                {t('video_reviews_title')}
              </h2>
              <p className="text-[14px] font-normal leading-[17px] text-[#6B7280] md:text-base md:leading-[22px]">
                {t('video_reviews_subtitle')}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                className="text-[13px] font-medium text-[#1A73E8] md:text-base"
                onClick={() => openAt(0)}
              >
                {t('video_reviews_all')}
              </button>
              <div className="hidden items-center gap-2 md:flex">
                <button
                  type="button"
                  aria-label="prev"
                  disabled={!canScrollPrev}
                  className="grid h-9 w-9 place-items-center rounded-[20px] bg-[#E5E7EB]/70 text-[#6B7280] disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => carouselApi?.scrollPrev()}
                >
                  <KeyboardBackspaceIcon sx={{ fontSize: 18 }} />
                </button>
                <button
                  type="button"
                  aria-label="next"
                  disabled={!canScrollNext}
                  className="grid h-9 w-9 place-items-center rounded-[20px] bg-[#E5E7EB] text-black disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => carouselApi?.scrollNext()}
                >
                  <KeyboardBackspaceIcon sx={{ fontSize: 18, transform: 'rotate(180deg)' }} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="aspect-[9/16] w-[72%] shrink-0 animate-pulse rounded-[22px] bg-[#E5E7EB] md:w-[28%] xl:w-[16%]"
                  />
                ))}
              </div>
            ) : (
              <Carousel
                setApi={setCarouselApi}
                opts={{
                  align: 'center',
                  containScroll: false,
                  loop: slides.length > 1,
                  startIndex,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-0 items-start pb-8 pt-1">
                  {slides.map((slide, index) => {
                    const distance = loopDistance(
                      index,
                      carouselApi ? selected : startIndex,
                      slides.length,
                    );
                    const pose = videoCardPose(distance);
                    const item = slide.item;
                    return (
                      <CarouselItem
                        key={slide.key}
                        className={cn(
                          'basis-[78%] pl-0 md:basis-[34%] xl:basis-1/7 xl:px-[6px]',
                          pose.item,
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => openAt(slide.sourceIndex)}
                          className={cn(
                            'relative block aspect-[9/16] w-full origin-center overflow-hidden rounded-[20px] bg-[#111827] text-left transition-transform duration-300',
                            pose.card,
                          )}
                        >
                          {item.caption_foto ? (
                            <img
                              src={item.caption_foto}
                              alt={item.location}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                          {item.duration ? (
                            <span className="absolute right-3 top-3 rounded-full bg-black/65 px-2 py-1 text-[12px] font-medium text-white">
                              {item.duration}
                            </span>
                          ) : null}
                          <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#1C1C1E]">
                            <Play className="ml-0.5 h-5 w-5 fill-current" />
                          </span>
                          {item.location ? (
                            <span className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/75 to-transparent px-3 pb-3 pt-8 text-[13px] text-white">
                              <FmdGoodOutlinedIcon sx={{ fontSize: 16 }} />
                              <span className="truncate">{item.location}</span>
                            </span>
                          ) : null}
                        </button>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
              </Carousel>
            )}
          </div>

          {!isLoading && videos.length > 1 ? (
            <div className="mt-3 flex justify-center gap-1.5 md:hidden">
              {videos.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={item.location || `video-${index + 1}`}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    slides[carouselApi ? selected : startIndex]?.sourceIndex === index
                      ? 'w-4 bg-[#1A73E8]'
                      : 'w-1.5 bg-[#D1D5DB]',
                  )}
                  onClick={() => {
                    const slideIndex = slides.findIndex((slide) => slide.sourceIndex === index);
                    if (slideIndex >= 0) carouselApi?.scrollTo(slideIndex);
                  }}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {activeIndex !== null && videos[activeIndex] ? (
        <VideoPlayer
          videos={videos}
          index={activeIndex}
          swipeHint={t('video_reviews_swipe')}
          onClose={() => setActiveIndex(null)}
          onIndexChange={setActiveIndex}
        />
      ) : null}
    </section>
  );
};

function VideoPlayer({
  videos,
  index,
  swipeHint,
  onClose,
  onIndexChange,
}: {
  videos: VideoItem[];
  index: number;
  swipeHint: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const allowedTime = useRef(0);
  const touchStartX = useRef<number | null>(null);
  const swiped = useRef(false);
  const indexRef = useRef(index);
  indexRef.current = index;
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hint, setHint] = useState(false);
  const item = videos[index];
  const prev = index > 0 ? videos[index - 1] : null;
  const next = index < videos.length - 1 ? videos[index + 1] : null;

  useLayoutEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    allowedTime.current = 0;
    setProgress(0);
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      void video.play().catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        if (!cancelled) setPlaying(false);
      });
    };
    if (video.readyState >= 2) start();
    else video.addEventListener('canplay', start, { once: true });
    return () => {
      cancelled = true;
      video.removeEventListener('canplay', start);
    };
  }, [item.id]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || window.innerWidth >= 768) return;
    try {
      if (localStorage.getItem(SWIPE_HINT_KEY)) return;
      localStorage.setItem(SWIPE_HINT_KEY, '1');
    } catch {
      return;
    }
    setHint(true);
    const timer = window.setTimeout(() => setHint(false), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        videoRef.current?.pause();
        onClose();
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        const delta = event.key === 'ArrowRight' ? 1 : -1;
        const target = indexRef.current + delta;
        if (target < 0 || target >= videos.length) return;
        videoRef.current?.pause();
        allowedTime.current = 0;
        setPlaying(false);
        setProgress(0);
        onIndexChange(target);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onIndexChange, videos.length]);

  function close() {
    videoRef.current?.pause();
    onClose();
  }

  function step(delta: number) {
    const target = index + delta;
    if (target < 0 || target >= videos.length) return;
    videoRef.current?.pause();
    allowedTime.current = 0;
    setPlaying(false);
    setProgress(0);
    onIndexChange(target);
  }

  function toggle() {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  }

  function onTimeUpdate(event: SyntheticEvent<HTMLVideoElement>) {
    const video = event.currentTarget;
    if (video.currentTime > allowedTime.current + 1) {
      video.currentTime = allowedTime.current;
      return;
    }
    allowedTime.current = video.currentTime;
    setProgress(video.duration ? video.currentTime / video.duration : 0);
  }

  function onSeeking(event: SyntheticEvent<HTMLVideoElement>) {
    const video = event.currentTarget;
    if (Math.abs(video.currentTime - allowedTime.current) > 0.35) {
      video.currentTime = allowedTime.current;
    }
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85"
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
        swiped.current = false;
      }}
      onTouchEnd={(event) => {
        if (touchStartX.current == null) return;
        const dx = (event.changedTouches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
        if (Math.abs(dx) > 48) {
          swiped.current = true;
          step(dx < 0 ? 1 : -1);
        }
      }}
    >
      {prev?.caption_foto ? (
        <img
          src={prev.caption_foto}
          alt=""
          className="pointer-events-none absolute left-[6%] hidden h-[62vh] w-[18vw] max-w-[240px] rounded-[18px] object-cover opacity-40 blur-[1px] md:block"
        />
      ) : null}
      {next?.caption_foto ? (
        <img
          src={next.caption_foto}
          alt=""
          className="pointer-events-none absolute right-[6%] hidden h-[62vh] w-[18vw] max-w-[240px] rounded-[18px] object-cover opacity-40 blur-[1px] md:block"
        />
      ) : null}

      <button
        type="button"
        aria-label="close"
        className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white"
        onClick={close}
      >
        <X className="h-5 w-5" />
      </button>

      <button
        type="button"
        aria-label="prev-video"
        disabled={!prev}
        className="absolute left-6 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#1C1C1E] disabled:opacity-40 md:grid"
        onClick={() => step(-1)}
      >
        <KeyboardBackspaceIcon sx={{ fontSize: 20 }} />
      </button>
      <button
        type="button"
        aria-label="next-video"
        disabled={!next}
        className="absolute right-6 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#1C1C1E] disabled:opacity-40 md:grid"
        onClick={() => step(1)}
      >
        <KeyboardBackspaceIcon sx={{ fontSize: 20, transform: 'rotate(180deg)' }} />
      </button>

      <div className="relative z-10 h-[78vh] max-h-[820px] w-[min(78vh*9/16,92vw)] overflow-hidden rounded-[18px] bg-black">
        <video
          key={item.id}
          ref={videoRef}
          src={streamSrc(item)}
          playsInline
          preload="metadata"
          controls={false}
          disablePictureInPicture
          className="h-full w-full object-cover"
          onTimeUpdate={onTimeUpdate}
          onSeeking={onSeeking}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onClick={() => {
            if (swiped.current) {
              swiped.current = false;
              return;
            }
            toggle();
          }}
        />
        <button
          type="button"
          aria-label={playing ? 'pause' : 'play'}
          className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#1C1C1E]"
          onClick={toggle}
        >
          {playing ? (
            <Pause className="h-6 w-6 fill-current" />
          ) : (
            <Play className="ml-0.5 h-6 w-6 fill-current" />
          )}
        </button>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-white/30">
          <div className="h-full bg-white" style={{ width: `${progress * 100}%` }} />
        </div>
        {item.location ? (
          <span className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-1 text-sm text-white">
            <FmdGoodOutlinedIcon sx={{ fontSize: 16 }} />
            {item.location}
          </span>
        ) : null}
      </div>

      {hint ? (
        <div className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm text-white md:hidden">
          {swipeHint}
        </div>
      ) : null}
    </div>
  );
}

export default VideoReviews;
