'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import SwiperImage from '../../../public/images/image1.png';
import Image from 'next/image';
import React from 'react';

const images = [
  SwiperImage.src,
  SwiperImage.src,
  SwiperImage.src,
  SwiperImage.src,
];

interface Props {
  setOpenWatch: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ImageSwiper({ setOpenWatch }: Props) {
  return (
    <div className="w-full mx-auto square relative">
      <Swiper
        modules={[Pagination]}
        pagination={{
          clickable: true,
        }}
        spaceBetween={16}
        slidesPerView={1}
        className="mySwiper"
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-[640px]" onClick={() => setOpenWatch(true)}>
              <Image
                src={img}
                alt={`Image ${idx + 1}`}
                className="object-cover"
                fill
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className='flex items-center justify-center text-white absolute top-10 w-full z-10'>
        <div className='custom-container flex items-center justify-between'>
          <div className='flex items-center gap-[12px]'>
            <p>Главная страница</p>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.911 12.7441C11.5856 13.0695 11.5856 13.5972 11.911 13.9226C12.2364 14.248 12.7641 14.248 13.0895 13.9226L16.4228 10.5893C16.7483 10.2638 16.7483 9.73619 16.4228 9.41075L13.0895 6.07742C12.7641 5.75198 12.2364 5.75198 11.911 6.07742C11.5856 6.40286 11.5856 6.9305 11.911 7.25593L13.8217 9.16668H4.16683C3.70659 9.16668 3.3335 9.53977 3.3335 10C3.3335 10.4602 3.70659 10.8333 4.16683 10.8333H13.8217L11.911 12.7441Z" fill="white" />
            </svg>
            <p>Подобрать тур</p>

            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5064 12.7441C12.1647 13.0695 12.1647 13.5972 12.5064 13.9226C12.8481 14.248 13.4021 14.248 13.7438 13.9226L17.2438 10.5893C17.5855 10.2638 17.5855 9.73619 17.2438 9.41075L13.7438 6.07742C13.4021 5.75198 12.8481 5.75198 12.5064 6.07742C12.1647 6.40286 12.1647 6.9305 12.5064 7.25593L14.5127 9.16668H4.375C3.89175 9.16668 3.5 9.53977 3.5 10C3.5 10.4602 3.89175 10.8333 4.375 10.8333H14.5127L12.5064 12.7441Z" fill="white" />
            </svg>

            <p>Тур страница</p>
          </div>

          <div className='flex items-center gap-10'>
            <div className='flex items-center gap-5 bg-black/50 rounded-full px-5 py-2 cursor-pointer backdrop-blur-2xl'>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7 3C4.23858 3 2 5.23858 2 8V16C2 18.7614 4.23858 21 7 21H17C19.7614 21 22 18.7614 22 16V8C22 5.23858 19.7614 3 17 3H7ZM8 10C8 9.44772 8.44772 9 9 9H11C11.5523 9 12 8.55228 12 8C12 7.44772 11.5523 7 11 7H9C7.34315 7 6 8.34315 6 10V12C6 12.5523 6.44772 13 7 13C7.55228 13 8 12.5523 8 12V10ZM18 12C18 11.4477 17.5523 11 17 11C16.4477 11 16 11.4477 16 12V14C16 14.5523 15.5523 15 15 15H13C12.4477 15 12 15.4477 12 16C12 16.5523 12.4477 17 13 17H15C16.6569 17 18 15.6569 18 14V12Z" fill="white" />
              </svg>
              <p>Полный обзор</p>
            </div>

            <div className='flex items-center gap-5 bg-black/50 rounded-full cursor-pointer backdrop-blur-2xl justify-center w-[40px] h-[40px]'><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 5L14.58 6.42L12.99 4.83V16H11.01V4.83L9.42 6.42L8 5L12 1L16 5ZM20 10V21C20 22.1 19.1 23 18 23H6C4.89 23 4 22.1 4 21V10C4 8.89 4.89 8 6 8H9V10H6V21H18V10H15V8H18C19.1 8 20 8.89 20 10Z" fill="white" />
            </svg>
            </div>

            <div className='flex items-center gap-5 bg-black/50 rounded-full cursor-pointer backdrop-blur-2xl justify-center w-[40px] h-[40px]'>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.175L10.55 19.855C5.4 15.185 2 12.105 2 8.32501C2 5.24501 4.42 2.82501 7.5 2.82501C9.24 2.82501 10.91 3.63501 12 4.91501C13.09 3.63501 14.76 2.82501 16.5 2.82501C19.58 2.82501 22 5.24501 22 8.32501C22 12.105 18.6 15.185 13.45 19.865L12 21.175Z" fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .square .swiper-pagination-bullet {
          width: 40px;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(25px);
          opacity: 1;
          border-radius: 27px;
          margin: 0 6px !important;
          transition:
            background 0.3s,
            border-radius 0.3s;
          border: none;
        }
        .square .swiper-pagination-bullet-active {
          background: #ffffff !important;
          backdrop-filter: none;
        }
      `}</style>
    </div>
  );
}
