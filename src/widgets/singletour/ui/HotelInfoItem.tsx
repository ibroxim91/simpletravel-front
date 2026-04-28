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
    <>
      {iconNode ? (
        <div className="w-6 h-6 flex items-center justify-center">{iconNode}</div>
      ) : (
        <div className="w-6 h-6">
          <Image
            className="w-full h-full"
            src={img}
            alt={'hotel'}
            width={500}
            height={500}
          />
        </div>
      )}

      <div className="flex flex-col h-full justify-between gap-2">
        <p
          className={`text-[16px] leading-5 font-bold line-clamp-1 ${
            highlighted ? 'text-white' : 'text-[#1A73E8]'
          }`}
        >
          {name}
        </p>
        <h1
          className={`text-[14px] leading-[17px] font-semibold line-clamp-2 ${
            highlighted ? 'text-white' : 'text-[#112211]'
          }`}
        >
          {title}
        </h1>
      </div>
    </>
  );
}
