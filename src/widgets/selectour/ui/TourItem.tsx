import Image from 'next/image';
import TourImage from '../../../../public/images/tourImage.png';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { star, gap_star } from "@/shared/constants/icons"

export default function TourItem() {
  return (
    <div className="flex items-center relative bg-[#FFFFFF] rounded-xl mt-[16px] z-0 max-md:flex-col">
      <div className="relative rounded-2xl overflow-hidden w-[250px] h-[250px] max-md:w-full">
        <Image src={TourImage.src} alt="tour" className="object-cover" fill />
      </div>

      <div className="flex flex-col justify-between p-[16px]">
        <div className="flex flex-col gap-[4px]">
          <div className="flex items-center gap-2">
            {[star, star, star, star, gap_star].map((item, index) => {
              return <div key={index}>{item}</div>;
            })}
          </div>
          <h1 className="text-[20px] text-[#031753] font-semibold">
            Memories Varadero
          </h1>

          <div className="flex items-center gap-2">
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
                d="M9.9296 1.66669C8.73383 1.66669 7.55939 1.99259 6.53445 2.60755C4.55078 3.79775 3.33337 5.94344 3.33337 8.25786C3.33337 9.55836 3.71832 10.8298 4.43971 11.9118L8.01108 17.2689C8.45442 17.9339 9.20079 18.3334 10 18.3334C10.7993 18.3334 11.5457 17.9339 11.989 17.2689L15.5604 11.9118C16.2818 10.8298 16.6667 9.55836 16.6667 8.25786C16.6667 5.94344 15.4493 3.79775 13.4656 2.60755C12.4407 1.99259 11.2663 1.66669 10.0705 1.66669H9.9296ZM13.0893 6.91076C13.4147 7.2362 13.4147 7.76384 13.0893 8.08928L10.5893 10.5893C10.2639 10.9147 9.73622 10.9147 9.41079 10.5893L7.74412 8.92261C7.41868 8.59717 7.41868 8.06953 7.74412 7.7441C8.06956 7.41866 8.59719 7.41866 8.92263 7.7441L10 8.82151L11.9108 6.91076C12.2362 6.58533 12.7639 6.58533 13.0893 6.91076Z"
                fill="#084FE3"
              />
            </svg>

            <p>ОАЭ, Шарджа</p>
          </div>
        </div>

        <ul className="flex text-[#646465] items-center w-[230px] flex-wrap mt-3">
          <li>Открытый бассейн</li>
          <li>Первая линия пляжа</li>
          <li>Анимация</li>
        </ul>

        <div className="flex items-center gap-[20px] max-md:flex-col mt-3">
          <button className="bg-[#1764FC] text-white rounded-full px-4 py-3 cursor-pointer max-md:w-full">
            12 450 000 сум{' '}
          </button>
          <div className="flex items-center gap-5">
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_86_3431)">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3.05078 6.05632C3.07672 5.76867 3.24974 5.51496 3.50807 5.3858L5.86509 4.20729C6.06277 4.10845 6.29162 4.09218 6.50129 4.16207L11.316 5.76697L12.6791 4.40387C13.6494 3.4336 15.0846 3.09479 16.3863 3.52872C16.7185 3.63942 16.9791 3.90005 17.0898 4.23218C17.5237 5.53394 17.1849 6.96913 16.2146 7.93941L14.8515 9.30251L16.4564 14.1172C16.5263 14.3269 16.5101 14.5557 16.4112 14.7534L15.2327 17.1104C15.1035 17.3688 14.8498 17.5418 14.5622 17.5677C14.2745 17.5937 13.994 17.4688 13.8207 17.2378L10.8617 13.2924L10.1375 14.0166L10.5639 15.2957C10.6637 15.5952 10.5858 15.9253 10.3626 16.1485L8.59479 17.9163C8.41334 18.0977 8.15841 18.1855 7.90371 18.1541C7.64903 18.1227 7.42298 17.9758 7.29096 17.7558L5.63038 14.9881L2.86274 13.3275C2.6427 13.1955 2.49575 12.9695 2.4644 12.7148C2.43305 12.4601 2.52078 12.2052 2.70223 12.0237L4.47 10.2559C4.69319 10.0328 5.02333 9.95482 5.32278 10.0546L6.60195 10.481L7.32612 9.75685L3.38075 6.79782C3.14969 6.62453 3.02484 6.34397 3.05078 6.05632Z"
                  fill="#084FE3"
                />
              </g>
              <defs>
                <clipPath id="clip0_86_3431">
                  <rect
                    width="20"
                    height="20"
                    fill="white"
                    transform="translate(0 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>

            <p>12 Сен.</p>

            <ul className="flex items-center gap-4">
              <li>2 Вызрослых</li>
              <li>8 Ночей</li>
            </ul>
          </div>
        </div>
      </div>

      <IconButton
        aria-label="favourite"
        sx={{
          zIndex: 1, // 🔑 qo‘shib qo‘y
          border: '1px solid #9ca3af',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: 'transparent',
          },
          position: 'absolute',
          right: '1.5rem',
          top: '1.5rem',
        }}
      >
        <FavoriteIcon sx={{ color: 'black', width: '24px', height: '24px' }} />
      </IconButton>
    </div>
  );
}
