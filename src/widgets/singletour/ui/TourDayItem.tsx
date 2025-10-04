import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import clsx from 'clsx';
import Image from 'next/image';

type Props = {
  isLast?: boolean;
  isFirst?: boolean;
  data: {
    title: string;
    duration: number;
    ticket_itinerary_image: [
      {
        image: string;
      },
    ];
    ticket_itinerary_destinations: [
      {
        name: string;
      },
    ];
  };
};

export default function TourDayItem({ isLast, isFirst, data }: Props) {
  return (
    <div className="flex items-center gap-[20px] relative max-lg:h-[800px] max-lg:flex-col">
      <div className="mt-[16px] max-lg:mt-2 py-[12px] w-[90%] max-lg:w-full max-lg:flex-col max-lg:h-auto px-[12px] flex items-center gap-[20px] bg-[#FFFFFF] rounded-[20px] cursor-pointer">
        <div className="w-[270px] h-[164px] relative max-lg:w-full max-lg:h-auto">
          <Image
            src={data.ticket_itinerary_image[0].image}
            width={500}
            height={500}
            alt={data.title}
            className="object-cover w-full h-full max-lg:h-[300px]"
          />
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{data.title}</h1>
          <ul className="flex list-disc list-inside items-center gap-[16px] mt-[16px] text-sm text-[#636363] max-lg:flex-col max-lg:items-start">
            {data.ticket_itinerary_destinations.map((e) => (
              <li className="marker:text-[#084FE3]" key={e.name}>
                {e.name}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-[8px] mt-[24px]">
            <ContactSupportIcon
              sx={{ height: '26px', width: '26px', color: '#084FE3' }}
            />

            <p className="text-[#636363]">Услуги профессионального гида</p>
          </div>

          <div className="flex items-center gap-[8px] mt-[24px]">
            <WatchLaterIcon
              sx={{ height: '26px', width: '26px', color: '#084FE3' }}
            />

            <p className="text-[#636363]">
              Продолжительность: {data.duration} дней
            </p>
          </div>
        </div>
      </div>

      <div
        className={clsx(
          'flex flex-col max-lg:flex-row items-center absolute max-lg:static right-[5%]  lg:top-[50%] max-lg:w-full',
          isLast ? 'max-lg:justify-start' : 'max-lg:justify-end',
        )}
      >
        {!isFirst && (
          <>
            <svg
              width="200"
              height="2"
              viewBox="0 0 200 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-3 lg:hidden"
            >
              <path
                d="M0 1H200"
                stroke="#084FE3"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>
          </>
        )}
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
          <>
            <svg
              width="2"
              height="168"
              viewBox="0 0 2 168"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-3 max-lg:hidden"
            >
              <path
                d="M1 0V168"
                stroke="#084FE3"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>

            <svg
              width="200"
              height="2"
              viewBox="0 0 200 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-3 lg:hidden"
            >
              <path
                d="M0 1H200"
                stroke="#084FE3"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>
          </>
        )}
      </div>
    </div>
  );
}
