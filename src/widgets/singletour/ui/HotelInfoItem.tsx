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
    <div className="flex w-full items-start justify-between gap-2.5">
      {iconNode ? (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center">{iconNode}</div>
      ) : (
        <div className="h-6 w-6 shrink-0">
          <Image
            className="h-full w-full"
            src={img}
            alt={'hotel'}
            width={500}
            height={500}
          />
        </div>
      )}

      <div className="flex min-w-0 flex-col items-end gap-2">
        <p
          className={`line-clamp-1 text-right text-base font-bold leading-5 ${
            highlighted ? 'text-white' : 'text-[#1A73E8]'
          }`}
        >
          {name}
        </p>
        <p
          className={`line-clamp-2 text-right text-xs font-medium leading-[15px] ${
            highlighted ? 'text-white' : 'text-[#112211]'
          }`}
        >
          {title}
        </p>
      </div>
    </div>
  );
}
