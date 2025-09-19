import BannerCircle from '@/assets/divCircleMobile.png';
import Kuba from '@/assets/Kuba.jpg';
import OAE from '@/assets/OAE.jpg';
import Shore from '@/assets/shore.png';
import ShoreCrop from '@/assets/ShoreCrop.png';
import ShriLanka from '@/assets/ShriLanka.jpg';
import Tailand from '@/assets/Tailand.jpg';
import Turk from '@/assets/Turk.jpg';
import { Link } from '@/shared/config/i18n/navigation';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import Image from 'next/image';

const data = [
  {
    name: 'Турция',
    desc: 'От $700 / 2 чел',
    img: Turk,
  },
  {
    name: 'Таиланд',
    desc: 'От $800 / 1 чел',
    img: Tailand,
  },
  {
    name: 'Шри-Ланка',
    desc: 'От $1050 / 2 чел',
    img: ShriLanka,
  },
  {
    name: 'ОАЭ',
    desc: 'От $1000 / 1 чел',
    img: OAE,
  },
  {
    name: 'Куба',
    desc: 'От $1200 / 2 чел',
    img: Kuba,
  },
];

const PopulardestinationsMboile = () => {
  return (
    <div className="custom-container mt-10 lg:hidden">
      <div className="flex justify-between items-center">
        <Link href={'#'} className="text-2xl text-[#031753] font-semibold">
          Популярные направления
        </Link>
      </div>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full mt-4"
      >
        <CarouselContent>
          {data.map((e) => (
            <CarouselItem
              key={e.name}
              className="basis-1/2 max-sm:basis-1/1 h-[200px] font-medium"
            >
              <div className="rounded-3xl w-full relative h-full">
                <Image
                  src={e.img}
                  width={528}
                  height={352}
                  quality={100}
                  alt={e.name}
                  className="rounded-3xl h-full object-cover w-full"
                />
                <div className="absolute h-full bottom-0 w-full bg-black/15 rounded-3xl" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white text-3xl font-semibold">{e.name}</p>
                  <p className="text-white text-md">{e.desc}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="w-full h-[800px] mt-10 relative overflow-hidden flex rounded-4xl font-medium">
        <div className="h-[800px] w-full overflow-hidden relative">
          <div className="w-[100%] h-[50%] max-sm:h-[60%] z-10 absolute left-0 top-0">
            <Image src={BannerCircle} alt="circle" className="w-full h-full" />
          </div>
          <div className="absolute z-12 top-10 h-full left-4 flex flex-col gap-4">
            <p className="text-4xl w-[90%] text-[#031753] font-semibold">
              Солнце, пляж, отпуск - всё включено
            </p>
            <p className="text-lg text-[#031753]">
              Подбор туров у воды по сниженным ценам. Количество мест
              ограничено.
            </p>
            <Link
              href={'#'}
              className="bg-[#ECF2FF] w-fit py-3 px-5 rounded-4xl flex gap-4"
            >
              <p className="text-blue-600 font-semibold">Забронировать</p>
              <ArrowRightAltIcon className="text-blue-600" />
            </Link>
          </div>
          <div className="w-full h-[80%] max-sm:h-[70%] max-md:h[100%] max-sm:top-96 overflow-hidden absolute left-0 bottom-0 top-64">
            <Image
              src={Shore}
              alt="Shore"
              className="w-full h-full max-md:h-[100%] object-fill right-0 absolute bottom-0"
            />
          </div>
        </div>
        <div className="w-[100%] h-[100%] absolute right-0 bottom-0">
          <Image
            src={ShoreCrop}
            alt="ShoreCrop"
            className="w-full h-[80%] max-md:h-[80%] max-sm:h-[70%] object-fill right-0 z-10 absolute top-64 max-md:top-64 max-sm:top-96"
          />
        </div>
      </div>
    </div>
  );
};

export default PopulardestinationsMboile;
