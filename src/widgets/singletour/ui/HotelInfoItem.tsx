import Image, { StaticImageData } from 'next/image';
import { ReactNode } from 'react';

interface Props {
  title: string;
  name: string;
  img: StaticImageData;
  highlighted?: boolean;
  iconNode?: ReactNode;
}
export default function HotelInfoItem({
  title,
  name,
  img,
  highlighted = false,
  iconNode,
}: Props) {
  return (
    <div className="flex w-full items-start justify-between gap-4">
      {iconNode ? (
        <div className="flex h-6 w-6 items-center justify-center">{iconNode}</div>
      ) : (
        <div className="h-6 w-6">
          <Image
            className="h-full w-full"
            src={img}
            alt={'hotel'}
            width={500}
            height={500}
          />
        </div>
      )}

      <div className="flex h-full flex-col justify-between gap-2 max-lg:items-end">
        <p
          className={`line-clamp-1 text-[16px] font-bold leading-5 max-lg:text-right ${
            highlighted ? 'text-white' : 'text-[#1A73E8]'
          }`}
        >
          {name}
        </p>
        <h1
          className={`line-clamp-2 text-[14px] font-medium leading-[17px] max-lg:text-[12px] max-lg:leading-[15px] max-lg:text-right ${
            highlighted ? 'text-white' : 'text-[#112211]'
          }`}
        >
          {title}
        </h1>
      </div>
    </div>
  );
}
