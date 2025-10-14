'use client';

import BannerCircle from '@/assets/divCircleMobile.png';
import Shore from '@/assets/shore.png';
import ShoreCrop from '@/assets/ShoreCrop.png';
import { BASE_URL } from '@/shared/config/api/URLs';
import { Link } from '@/shared/config/i18n/navigation';
import { LanguageRoutes } from '@/shared/config/i18n/types';
import { formatPrice } from '@/shared/lib/formatPrice';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import Ticket_Api from '@/widgets/selectour/lib/api';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';

const PopulardestinationsMboile = () => {
  const { locale } = useParams();
  const t = useTranslations();
  const { data: ticket } = useQuery({
    queryKey: ['ticket_popular'],
    queryFn: () =>
      Ticket_Api.GetAllTickets({
        params: {
          page: 1,
          page_size: 6,
        },
      }),
    select(data) {
      return data.data.results.tickets;
    },
  });
  return (
    <div className="custom-container mt-10 lg:hidden">
      <div className="flex justify-between items-center">
        <Link
          href={'/selectour'}
          className="text-2xl text-[#031753] font-semibold"
        >
          {t('Популярные направления')}
        </Link>
      </div>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full mt-4"
      >
        <CarouselContent>
          {ticket?.map((e) => (
            <CarouselItem
              key={e.id}
              className="basis-1/2 max-sm:basis-1/1 h-[200px] font-medium"
            >
              <Link
                href={`/selectour/${ticket[0].id}`}
                prefetch={true}
                className="rounded-3xl w-full relative h-full"
              >
                <Image
                  src={BASE_URL + e.ticket_images}
                  width={528}
                  height={352}
                  quality={100}
                  alt={e.title}
                  className="rounded-3xl h-full object-cover w-full"
                />
                <div className="absolute h-full bottom-0 w-full bg-black/15 rounded-3xl" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white text-3xl font-semibold">{e.title}</p>
                  <p className="text-white text-md">
                    {formatPrice(
                      ticket[0].price,
                      locale as LanguageRoutes,
                      true,
                    )}{' '}
                    / {ticket[0].passenger_count} {t('чел')}
                  </p>
                </div>
              </Link>
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
              {t('Солнце, пляж, отпуск - всё включено')}
            </p>
            <p className="text-lg text-[#031753]">
              {t('Подбор туров у воды по сниженным ценам')}
            </p>
            <Link
              href="/selectour"
              className="bg-[#ECF2FF] w-fit py-3 px-5 rounded-4xl flex gap-4"
            >
              <p className="text-blue-600 font-semibold">
                {t('Забронировать')}
              </p>
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
