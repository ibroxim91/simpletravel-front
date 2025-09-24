import Image from "next/image";
import People from "../../../../public/images/peopleimg1.png";

export default function Reviews() {
  return (
    <div
      className="p-[8px] bg-[#FFFFFF] rounded-[15.84px] h-[106px] flex items-center gap-[10px] shrink-0"
    >
      <div className="relative w-[90px] h-[90px] cursor-pointer">
        <Image
          src={People}
          alt="user photo"
          fill
          className="object-cover rounded-2xl"
        />
      </div>

      <div>
        <h1 className="font-bold text-[#031753] text-[18px]">
          Светлана Р.
        </h1>
        <p className="text-[14px] text-[#636363]">
          Всё прошло идеально, спасибо за организацию!
        </p>
      </div>
    </div>
  );
}
