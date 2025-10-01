import { Star } from 'lucide-react';
import Image from 'next/image';
import People from '../../../../public/images/peopleimg1.png';

export default function Reviews() {
  return (
    <div className="bg-[#FFFFFF] rounded-[15.84px] h-[106px] max-[465px]:flex-col p-2 max-lg:h-full flex items-center gap-[10px] shrink-0">
      <div className="aspect-square w-[20%] max-lg:w-[50%] cursor-pointer relative">
        <Image
          src={People}
          alt="user photo"
          width={500}
          height={500}
          className="w-full h-full object-cover rounded-2xl"
        />
        <div className="bg-white flex absolute bottom-1 left-1/2 -translate-x-1/2 font-semibold z-10 px-3 gap-2 items-center rounded-2xl py-1">
          <Star color="#DAB72A" fill="#DAB72A" width={14} height={14} />
          <p className="text-[14px]">4.5</p>
        </div>
      </div>
      <div>
        <h1 className="font-bold text-[#031753] text-[18px] max-[465px]:text-center">
          Светлана Р.
        </h1>
        <p className="text-[14px] text-[#636363]">
          Всё прошло идеально, спасибо за организацию!
        </p>
      </div>
    </div>
  );
}
