import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';

interface Props {
  onClose: () => void;
  images: [
    {
      image: string;
    },
  ];
}

export default function WatchTour({ onClose, images }: Props) {
  const [current, setCurrent] = useState(0);

  // useEffect(() => {
  //   const onKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === 'Escape') onClose();
  //     if (e.key === 'ArrowRight') setCurrent((c) => (c + 1) % images.length);
  //     if (e.key === 'ArrowLeft')
  //       setCurrent((c) => (c - 1 + images.length) % images.length);
  //   };
  //   window.addEventListener('keydown', onKeyDown);
  //   return () => window.removeEventListener('keydown', onKeyDown);
  // }, [onClose, images.length]);

  // useEffect(() => {
  //   const prev = document.body.style.overflow;
  //   document.body.style.overflow = 'hidden';
  //   return () => {
  //     document.body.style.overflow = prev;
  //   };
  // }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + images.length) % images.length);
  }, [images.length]);

  const onBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[99999999] bg-black/60 backdrop-blur-2xl flex items-center justify-center p-2 md:p-4"
      onClick={onBackdrop}
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute left-1/2 lg:hidden bottom-3 cursor-pointer z-[1001] bg-white/90 hover:bg-white text-black rounded-full p-2 md:p-2.5 shadow focus:outline-none focus:ring-2 focus:ring-white/80"
      >
        <CloseIcon />
      </button>
      <div className="relative w-full max-w-full md:max-w-5xl lg:max-w-6xl">
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute right-3 max-lg:hidden top-3 md:-right-6 md:-top-6 lg:-right-8 lg:-top-8 cursor-pointer z-[1001] bg-white/90 hover:bg-white text-black rounded-full p-2 md:p-2.5 shadow focus:outline-none focus:ring-2 focus:ring-white/80"
        >
          <CloseIcon />
        </button>
        <div className="relative w-full h-[55vh] sm:h-[60vh] md:h-[70vh] rounded-xl sm:rounded-2xl overflow-hidden bg-black/30">
          {images?.[current] && (
            <Image
              src={images[current].image}
              alt={`Tour image ${current + 1}`}
              fill
              quality={100}
              priority
              className="object-cover"
            />
          )}

          {/* Left/Right controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 cursor-pointer md:left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 md:p-3 shadow focus:outline-none focus:ring-2 focus:ring-white/70"
                aria-label="Previous"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5 15L7.5 10L12.5 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={next}
                className="absolute right-2 cursor-pointer md:right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-black rounded-full p-2 md:p-3 shadow focus:outline-none focus:ring-2 focus:ring-white/70"
                aria-label="Next"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 5L12.5 10L7.5 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Thumbnails strip */}
        {images.length > 1 && (
          <div className="mt-3 sm:mt-4 w-full flex items-center justify-center">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto px-2 py-1 max-w-full">
              {images.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  aria-label={`Go to image ${idx + 1}`}
                  className={`relative h-14 w-24 cursor-pointer sm:h-16 sm:w-28 md:h-20 md:w-32 rounded-lg overflow-hidden border transition-all ${
                    current === idx
                      ? 'border-white ring-2 ring-white'
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={src.image}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
