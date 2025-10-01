import Image from 'next/image';
import { IHotel } from '../lib/data';

export default function HotelInfoItem({ hotel }: { hotel: IHotel }) {
  return (
    <>
      <div className="w-[80px] h-[80px]">
        <Image
          className="w-full h-full"
          src={hotel.icon}
          alt={hotel.title}
          width={500}
          height={500}
        />
      </div>

      <div className="flex flex-col w-fit h-full justify-end max-lg:justify-start">
        <p className="text-[#031753] text-xl w-full font-bold">{hotel.name}</p>
        <h1 className="text-md w-full">{hotel.title}</h1>
      </div>
    </>
  );
}
