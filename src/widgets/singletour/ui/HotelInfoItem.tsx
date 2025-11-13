import Image, { StaticImageData } from 'next/image';

interface Props {
  title: string;
  title_two?: string;
  name: string;
  img: StaticImageData;
}
export default function HotelInfoItem({ title, name, img, title_two }: Props) {
  return (
    <>
      <div className="w-[80px] h-[80px]">
        <Image
          className="w-full h-full"
          src={img}
          alt={'hotel'}
          width={500}
          height={500}
        />
      </div>

      <div className="flex flex-col w-fit h-full justify-center">
        <p className="text-[#031753] text-xl w-full font-bold">{name}</p>
        <h1 className="text-[#031753] text-md w-full">{title}</h1>
      </div>
    </>
  );
}
