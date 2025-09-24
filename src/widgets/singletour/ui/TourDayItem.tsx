import Image from 'next/image';
import TourDay1 from '../../../../public/images/tourday1.png';

type Props = {
  isLast?: boolean;
};

export default function TourDayItem({ isLast }: Props) {
  return (
    <div className="flex items-center gap-[20px] relative">
      <div className="h-[200px] mt-[16px] py-[12px] w-[90%] px-[12px] flex items-center gap-[20px] bg-[#FFFFFF] rounded-[20px] cursor-pointer">
        <div className="w-[270px] h-[164px] relative">
          <Image
            src={TourDay1.src}
            fill
            alt={TourDay1.src}
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-[24px] font-bold">
            День 1–2 — Бухара (Узбекистан)
          </h1>
          <ul className="flex list-disc list-inside items-center gap-[16px] mt-[16px] text-sm text-[#636363]">
            <li className="marker:text-[#084FE3]">Комплекс Пои-Калян</li>
            <li className="marker:text-[#084FE3]">Крепость Арк</li>
            <li className="marker:text-[#084FE3]">Ляби-Хауз</li>
          </ul>

          <div className="flex items-center gap-[8px] mt-[24px]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C7.31 2 3.5 5.81 3.5 10.5C3.5 15.19 7.31 19 12 19H12.5V22C17.36 19.66 20.5 15 20.5 10.5C20.5 5.81 16.69 2 12 2ZM13 16.5H11V14.5H13V16.5ZM13 13H11C11 9.75 14 10 14 8C14 6.9 13.1 6 12 6C10.9 6 10 6.9 10 8H8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8C16 10.5 13 10.75 13 13Z"
                fill="#084FE3"
              />
            </svg>

            <p className="text-[#636363]">Услуги профессионального гида</p>
          </div>

          <div className="flex items-center gap-[8px] mt-[24px]">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.2 16.2L11 13V7H12.5V12.2L17 14.9L16.2 16.2Z"
                fill="#084FE3"
              />
            </svg>

            <p className="text-[#636363]">Продолжительность: 4 дней</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center absolute right-[5%] top-[50%]">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="1"
            y="1"
            width="30"
            height="30"
            rx="15"
            stroke="#084FE3"
            stroke-width="2"
            stroke-dasharray="6 6"
          />
          <rect x="8" y="8" width="16" height="16" rx="8" fill="#084FE3" />
        </svg>

        {!isLast && (
          <svg
            width="2"
            height="168"
            viewBox="0 0 2 168"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mt-3"
          >
            <path
              d="M1 0V168"
              stroke="#084FE3"
              stroke-width="2"
              stroke-dasharray="6 6"
            />
          </svg>
        )}
      </div>
    </div>
  );
}
