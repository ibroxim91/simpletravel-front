'use client';

import { tourAdditionalInfo, star, gap_star } from '../lib/icons';
import React, { useEffect, useRef, useState } from 'react';
import { foodInfo, hotelAdditionalInfo } from '../lib/data';
import Statue from '../../../../public/images/statue.png';
import TourOffersItem from './TourOffersItem';
import HotelInfoItem from './HotelInfoItem';
import TourFoodItem from './TourFoodItem';
import Swiper from '@/shared/ui/swiper';
import TourDayItem from './TourDayItem';
import ReviewsItem from './ReviewsItem';
import SwiperImage from '../../../../public/images/image1.png';
import TourItem from './TourItem';
import Image from 'next/image';
import 'swiper/css';
import WatchTour from './WatchTour';
import WantHelpModal from './WantHelpModal';

const images: string[] = [
  SwiperImage.src,
  SwiperImage.src,
  SwiperImage.src,
  SwiperImage.src,
]

export default function SingleTour() {
  const [openWatch, setOpenWatch] = useState<boolean>(false);
  const [openHelp, setOpenHelp] = useState<boolean>(false);

  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const STEP = 250;
  const originalLength = items.length;
  const tripledItems = [...items, ...items, ...items];

  const [index, setIndex] = useState<number>(originalLength);
  const [isAnimating, setIsAnimating] = useState<boolean>(true);

  const hotelSwiperRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    setIsAnimating(true);
    setIndex((prev) => (direction === 'left' ? prev - 1 : prev + 1));
  };

  const offersScrollRef = useRef<HTMLDivElement | null>(null);
  const handleOffersScroll = (direction: 'left' | 'right') => {
    const el = offersScrollRef.current;
    if (!el) return;
    const amount = el.clientWidth || 300;
    el.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (!hotelSwiperRef.current) return;
    const x = -index * STEP;
    if (isAnimating) {
      hotelSwiperRef.current.style.transition = 'transform 300ms ease-in-out';
    } else {
      hotelSwiperRef.current.style.transition = 'none';
    }
    hotelSwiperRef.current.style.transform = `translateX(${x}px)`;
  }, [index, isAnimating]);

  useEffect(() => {
    if (!hotelSwiperRef.current) return;
    const el = hotelSwiperRef.current;
    const onEnd = () => {
      if (index < originalLength) {
        setIsAnimating(false);
        setIndex(index + originalLength);
      } else if (index >= originalLength * 2) {
        setIsAnimating(false);
        setIndex(index - originalLength);
      }
    };
    el.addEventListener('transitionend', onEnd);
    return () => {
      el.removeEventListener('transitionend', onEnd);
    };
  }, [index, originalLength]);

  useEffect(() => {
    if (!isAnimating) {
      const id = requestAnimationFrame(() => setIsAnimating(true));
      return () => cancelAnimationFrame(id);
    }
  }, [isAnimating]);

  return (
    <div>
      <div>

        {openHelp && <WantHelpModal onClose={() => setOpenHelp(false)} />}
          
        <div className="flex flex-col gap-[20px]">
          <Swiper setOpenWatch={setOpenWatch} />
        </div>

        {openWatch && <WatchTour onClose={() => setOpenWatch(false)} images={images} />}
      </div>

      <div className="custom-container">
        <div>
          <div className="flex items-center justify-between mt-[60px]">
            <div>
              <div className="flex items-center gap-[4px]">
                {[star, star, star, star, gap_star].map((item, index) => {
                  return <div key={index}>{item}</div>;
                })}
              </div>
              <h1 className="text-[32px] font-bold">Memories Varadero</h1>

              <div className="flex items-center gap-[8px]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                    fill="#084FE3"
                  />
                </svg>

                <p className="text-[#084FE3]">Куба, Варадеро, Варадеро</p>
              </div>
            </div>

            <div>
              <h1 className="text-[32px] font-bold">12 450 000 сум</h1>
              <div className="flex items-center gap-[8px]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1.6665 10C1.6665 5.39765 5.39746 1.66669 9.99984 1.66669C14.6022 1.66669 18.3332 5.39765 18.3332 10C18.3332 14.6024 14.6022 18.3334 9.99984 18.3334C5.39746 18.3334 1.6665 14.6024 1.6665 10ZM9.99984 6.66669C10.4601 6.66669 10.8332 6.29359 10.8332 5.83335C10.8332 5.37312 10.4601 5.00002 9.99984 5.00002C9.5396 5.00002 9.1665 5.37312 9.1665 5.83335C9.1665 6.29359 9.5396 6.66669 9.99984 6.66669ZM9.99984 8.33335C10.4601 8.33335 10.8332 8.70645 10.8332 9.16669V14.1667C10.8332 14.6269 10.4601 15 9.99984 15C9.5396 15 9.1665 14.6269 9.1665 14.1667V10C8.70627 10 8.33317 9.62692 8.33317 9.16669C8.33317 8.70645 8.70627 8.33335 9.1665 8.33335H9.99984Z"
                    fill="#084FE3"
                  />
                </svg>
                <p>Без скрытых комиссий</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-[12px] w-[80%] flex-wrap mt-[32px]">
            {tourAdditionalInfo.map((info, index) => (
              <div
                key={index}
                className="w-max flex items-center gap-[8px] bg-[#EFF2F6] rounded-[8px] p-[4px]"
              >
                <div>{info.icon}</div>
                <h1 className="text-[14px]">{info.name}</h1>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-[32px] mt-[32px]">
            <button className="bg-[#1764FC] rounded-[43px] px-[70px] py-[14px] text-white cursor-pointer text-sm">
              Забронировать
            </button>
            <button onClick={() => setOpenHelp(true)} className="flex items-center gap-[10px] bg-[#ECF2FF] px-[70px] py-[14px] text-[#084FE3] cursor-pointer text-sm rounded-[43px]">
              <svg
                width="21"
                height="20"
                viewBox="0 0 21 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.4998 1.66663C5.89984 1.66663 2.1665 5.39996 2.1665 9.99996C2.1665 14.6 5.89984 18.3333 10.4998 18.3333C15.0998 18.3333 18.8332 14.6 18.8332 9.99996C18.8332 5.39996 15.0998 1.66663 10.4998 1.66663ZM11.3332 14.1666H9.6665V9.16663H11.3332V14.1666ZM11.3332 7.49996H9.6665V5.83329H11.3332V7.49996Z"
                  fill="#084FE3"
                />
              </svg>
              <p>Нужна помощь?</p>
            </button>
          </div>

          <hr className="mt-[60px]" />

          <div className="mt-[60px]">
            <h1 className="text-[28px] font-bold">Описание отеля</h1>
            <p className="w-full text-sm mt-[12px]">
              Уютная зеленая территория этого отеля и песчаный пляж заставят Вас
              отвлечься от будничной суеты. Здесь к услугам отдыхающих
              предлагаются открытые бассейны для взрослых и детей, анимационные
              программы, детская игровая площадка и ресторан международной
              кухни. Общая площадь территории отеля - 82000 кв. м. Год открытия
              отеля - 1998 г. Последняя реновация - 2018 г.
            </p>
            <div className="flex items-center gap-[20px] mt-[24px]">
              {hotelAdditionalInfo.map((hotel, index) => (
                <HotelInfoItem hotel={hotel} key={index} />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between w-full mt-[60px]">
            <h1 className="text-[32px] font-bold text-[#031753]">
              Что включено в стоимость тура
            </h1>

            <div className="flex items-center gap-[15px]">
              <div
                className="p-[9px] border border-[#DFDFDF] rounded-full cursor-pointer h-[42px] w-[42px] flex items-center justify-center"
                onClick={() => handleScroll('left')}
              >
                <svg
                  width="16"
                  height="10"
                  viewBox="0 0 16 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.70701 1.70711C6.09753 1.31658 6.09753 0.683418 5.70701 0.292894C5.31648 -0.0976305 4.68332 -0.0976305 4.29279 0.292894L0.292794 4.29289C-0.0977311 4.68342 -0.097731 5.31658 0.292794 5.70711L4.29279 9.70711C4.68332 10.0976 5.31648 10.0976 5.70701 9.70711C6.09753 9.31658 6.09753 8.68342 5.70701 8.29289L3.41411 6L15 6C15.5523 6 16 5.55228 16 5C16 4.44772 15.5523 4 15 4L3.41411 4L5.70701 1.70711Z"
                    fill="#031753"
                  />
                </svg>
              </div>

              <div
                className="p-[9px] border border-[#DFDFDF] rounded-full cursor-pointer h-[42px] w-[42px] flex items-center justify-center"
                onClick={() => handleScroll('right')}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.293 15.2929C13.9025 15.6834 13.9025 16.3166 14.293 16.7071C14.6835 17.0976 15.3167 17.0976 15.7072 16.7071L19.7072 12.7071C20.0977 12.3166 20.0977 11.6834 19.7072 11.2929L15.7072 7.29289C15.3167 6.90237 14.6835 6.90237 14.293 7.29289C13.9025 7.68342 13.9025 8.31658 14.293 8.70711L16.5859 11H5C4.44771 11 4 11.4477 4 12C4 12.5523 4.44771 13 5 13H16.5859L14.293 15.2929Z"
                    fill="#031753"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="overflow-x-hidden mt-[20px]">
            <div
              className="flex items-center gap-[12px]"
              ref={hotelSwiperRef}
              style={{
                transform: `translateX(${-index * STEP}px)`,
                transition: isAnimating
                  ? 'transform 300ms ease-in-out'
                  : 'none',
              }}
            >
              {tripledItems.map((item, key) => (
                <TourItem key={`${item}-${key}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#EDEEF1] rounded-[32px] mt-[60px]">
        <div className="custom-container py-[60px]">
          <div className="w-full p-[33px] rounded-[20px] text-white bg-linear-to-r from-[#1764FC] to-[#42B5CD] flex items-center justify-between relative z-10">
            <div>
              <h1 className="text-[28px] font-bold">План путешествия</h1>
              <p className="text-[16px]">Каждый день — новые впечатления</p>
              <div className="flex items-center gap-[12px] mt-[24px] py-[12px] bg-linear-to-r from-[#347afb] to-[#1881ef] rounded-[20px] px-[20px]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM15.29 16.71L11 12.41V7H13V11.59L16.71 15.3L15.29 16.71Z"
                    fill="white"
                  />
                </svg>

                <h1 className="text-[16px] font-bold">
                  Продолжительность тура
                </h1>
                <p className="text-[16px]">12 дня / 11 ночи</p>
              </div>
            </div>

            <div className="absolute right-[10px] -top-[60px] z-0 pr-[70px]">
              <div className="w-[345px] h-[256px] relative">
                <Image src={Statue.src} fill alt={Statue.src} />
              </div>
            </div>
          </div>

          <div className="mt-[24px]">
            {[1, 2, 3].map((item, key) => (
              <TourDayItem key={key} isLast={item === 3} />
            ))}
          </div>

          <div className="mt-[120px]">
            <h1 className="font-bold text-[28px]">Что подают в отеле</h1>
            <p className="w-[600px] text-sm text-[#636363] mt-[12px]">
              Наслаждайтесь завтраками, обедами и ужинами с богатым выбором
              блюд: от свежей выпечки и фруктов до традиционной кухни и
              интернационального меню
            </p>

            <div className="w-full flex items-center mt-[24px] gap-[18px]">
              {foodInfo.map((item, key) => (
                <TourFoodItem key={key} food={item} />
              ))}
            </div>
          </div>

          <div className='mt-[60px]'>
            <h1 className='font-bold text-[28px]'>
              Важно знать перед поездкой
            </h1>

            <div className='flex items-center justify-between mt-[24px] gap-[24px]'>
              <div className='bg-linear-to-b from-[#084FE3] text-white to-[#0A3CA9] w-[360px] h-[360px] rounded-[20px] flex flex-col justify-between p-[32px]'>
                <div>
                  <h1 className='text-[24px] font-bold'>ID Турфирмы</h1>
                  <p className='text-sm mt-[10px]'>Официально зарегистрированная компания в реестре туроператоров</p>
                </div>

                <div className='flex items-center justify-between'>
                  <div className="w-[80%] rounded-[8px] p-[10px] bg-linear-to-r from-[#2857bd] to-[#2857bb]">
                    ID: T-10234
                  </div>

                  <div className='w-[15%] bg-[#FFFFFF] rounded-[8px] cursor-pointer p-[10px] flex items-center justify-center'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.5 1H4.5C3.4 1 2.5 1.9 2.5 3V17H4.5V3H16.5V1ZM19.5 5H8.5C7.4 5 6.5 5.9 6.5 7V21C6.5 22.1 7.4 23 8.5 23H19.5C20.6 23 21.5 22.1 21.5 21V7C21.5 5.9 20.6 5 19.5 5ZM19.5 21H8.5V7H19.5V21Z" fill="#212122" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className='w-full p-[32px] h-[360px] bg-[#FFFFFF] rounded-[20px]'>
                <h1 className='font-bold text-[24px]'>
                  Требование по визе
                </h1>
                <p className='text-sm mt-[10px] text-[#636363]'>Мы поможем с оформлением и предоставим список документов.</p>

                <div className='flex flex-col'>
                  {
                    [1, 2, 3].map((item, key) => (
                      <div className='flex items-center gap-5 mt-[20px]'>
                        <div className='border border-[#DFDFDF] p-[10px] rounded-[8px]'>
                          ⏳
                        </div>
                        <div className='w-full'>
                          <p className='font-bold text-[#031753]'>Срок оформления: 7–10 дней</p>
                          <hr />
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="custom-container mt-[60px]">
        <div className="w-full h-[229px] rounded-[24px] bg-gradient-to-r from-[#ABDAFF] to-[#F5EDC7] py-[32px]">
          <h1 className="text-[24px] font-bold text-center mb-6">
            Отзывы наших клиентов
          </h1>

          <div className="flex items-center gap-10 overflow-x-auto whitespace-nowrap hide-scrollbar px-4">
            {[...Array(20)].map((_, key) => (
              <ReviewsItem key={key} />
            ))}
          </div>
        </div>

        <div>
          <div className='mt-[30px] flex items-center justify-between'>
            <h1 className='text-[28px] font-bold'>Откройте новые направления</h1>
            <div className="flex items-center gap-[15px]">
              <div
                className="p-[9px] border border-[#DFDFDF] rounded-full cursor-pointer h-[42px] w-[42px] flex items-center justify-center"
                onClick={() => handleOffersScroll('left')}
              >
                <svg
                  width="16"
                  height="10"
                  viewBox="0 0 16 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.70701 1.70711C6.09753 1.31658 6.09753 0.683418 5.70701 0.292894C5.31648 -0.0976305 4.68332 -0.0976305 4.29279 0.292894L0.292794 4.29289C-0.0977311 4.68342 -0.097731 5.31658 0.292794 5.70711L4.29279 9.70711C4.68332 10.0976 5.31648 10.0976 5.70701 9.70711C6.09753 9.31658 6.09753 8.68342 5.70701 8.29289L3.41411 6L15 6C15.5523 6 16 5.55228 16 5C16 4.44772 15.5523 4 15 4L3.41411 4L5.70701 1.70711Z"
                    fill="#031753"
                  />
                </svg>
              </div>

              <div
                className="p-[9px] border border-[#DFDFDF] rounded-full cursor-pointer h-[42px] w-[42px] flex items-center justify-center"
                onClick={() => handleOffersScroll('right')}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.293 15.2929C13.9025 15.6834 13.9025 16.3166 14.293 16.7071C14.6835 17.0976 15.3167 17.0976 15.7072 16.7071L19.7072 12.7071C20.0977 12.3166 20.0977 11.6834 19.7072 11.2929L15.7072 7.29289C15.3167 6.90237 14.6835 6.90237 14.293 7.29289C13.9025 7.68342 13.9025 8.31658 14.293 8.70711L16.5859 11H5C4.44771 11 4 11.4477 4 12C4 12.5523 4.44771 13 5 13H16.5859L14.293 15.2929Z"
                    fill="#031753"
                  />
                </svg>
              </div>
            </div>
          </div>


          <div className='flex items-center gap-[24px] mt-[30px]'>
            <div className='flex items-center gap-[24px] overflow-x-scroll hide-scrollbar' ref={offersScrollRef}>
              {[1, 2, 3, 4, 5, 6, 8, 9, 10].map((item, key) => (
                <TourOffersItem key={key} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
