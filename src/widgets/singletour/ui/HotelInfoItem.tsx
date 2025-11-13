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

      <div className="flex flex-col w-fit h-full justify-end max-lg:justify-start">
        <p className="text-[#031753] text-xl w-full font-bold">{name}</p>
      </div>
      <div className="flex justify-between w-ful max-lg:flex-col">
        <h1 className="text-[#031753] text-md w-full">{title}</h1>
        {title_two && (
          <h1 className="text-[#031753] text-md text-end w-full max-lg:text-start">
            {title_two}
          </h1>
        )}
      </div>
    </>
  );
}
