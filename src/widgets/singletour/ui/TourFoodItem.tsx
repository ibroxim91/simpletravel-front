import Image from 'next/image';
import { IFood } from '../lib/data';

export default function TourFoodItem({ food }: { food: IFood }) {
  return (
    <div className="flex items-center flex-col">
      <div className="w-[120px] h-[120px] object-cover cursor-pointer relative">
        <Image src={food.image} fill alt={food.image} />
      </div>

      <h1 className="text-[16px] font-bold text-[#031753]">{food.name}</h1>
      <p className="text-[14px] text-[#636363] w-[180px] text-center">
        {food.title}
      </p>
    </div>
  );
}
