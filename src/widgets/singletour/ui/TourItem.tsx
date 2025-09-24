import Image from 'next/image';
import Tour1 from '../../../../public/images/Tour1.png';

export default function TourItem() {
  return (
    <div className="cursor-pointer">
      <div className="w-[264px] h-[240px] relative rounded-2xl">
        <Image src={Tour1.src} fill alt={Tour1.src} />
      </div>
      <div className="mt-[10px]">
        <h1 className="text-[20px] font-bold text-[#031753]">
          Проживание в отеле
        </h1>
        <p className="text-sm font-semibold text-[#031753]">Количество ночей</p>
      </div>
    </div>
  );
}
