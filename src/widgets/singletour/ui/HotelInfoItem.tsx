import { IHotel } from '../lib/data';
import Image from 'next/image';

export default function HotelInfoItem({ hotel }: { hotel: IHotel }) {
  return (
    <div className="w-[350px] h-[200px] cursor-pointer flex flex-col justify-between p-[20px] bg-[#EDEEF1] rounded-[20px] relative">
      <div className="absolute top-[20px] right-[20px] w-[80px] h-[80px]">
        <Image src={hotel.icon} alt={hotel.title} fill />
      </div>

      <div className="flex flex-col w-full h-full justify-end">
        <p className="text-[#031753] text-[16px] w-full font-bold">
          {hotel.name}
        </p>
        <h1 className="text-sm w-full">{hotel.title}</h1>
      </div>
    </div>
  );
}
