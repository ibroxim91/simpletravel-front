'use client';

import BannerCircle from '@/assets/divCircleMobile.png';
import { BASE_URL } from '@/shared/config/api/URLs';
import { Link } from '@/shared/config/i18n/navigation';
import { LanguageRoutes } from '@/shared/config/i18n/types';
import { formatPrice } from '@/shared/lib/formatPrice';
import { Button } from '@/shared/ui/button';
import { Card, CardContent } from '@/shared/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';
import { Skeleton } from '@/shared/ui/skeleton';
import Ticket_Api from '@/widgets/selectour/lib/api';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getBanner } from '../lib/api';

const PopulardestinationsMboile = () => {
  const { locale } = useParams();
  const t = useTranslations();

  const { data: ticket } = useQuery({
    queryKey: ['ticket_home_popular'],
    queryFn: () =>
      Ticket_Api.GetHomeTickets(),
    select(data) {
      return data.data.results.tickets;
    },
  });

  const {
    data: banner,
    isLoading: bannerLoad,
    isError: bannerError,
    refetch,
  } = useQuery({
    queryKey: ['get_banner3'],
    queryFn: () => getBanner({ page: 1, page_size: 99, position: 'banner3' }),
    select: (data) => data.data.data,
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

      {/* Tickets Carousel */}
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
                href={`/selectour/${e.tour_operator_id}/?departure=${e.departure_id}&destination=${e.destination_id}&adults=${e.adults}&operator=${e.tour_operator}`}
                onClick={() => {
                        localStorage.setItem("tourOperator", e?.operator ?? "");
                        localStorage.setItem("tourOperatorId", String(e?.tour_operator_id ?? ""));
                        
                      }} 
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

      {bannerLoad && (
        <div className="mt-10 w-full">
          <Card className="rounded-4xl border border-border bg-muted/20">
            <CardContent className="flex flex-col items-center justify-center h-[800px] gap-6">
              <Skeleton className="w-full h-full" />
            </CardContent>
          </Card>
        </div>
      )}

      {bannerError && (
        <div className="mt-10 w-full">
          <Card className="rounded-4xl border border-destructive/30 bg-destructive/5">
            <CardContent className="flex flex-col items-center justify-center h-[800px] gap-6 text-center px-6">
              <AlertTriangle className="w-16 h-16 text-destructive" />
              <div>
                <p className="text-destructive font-semibold text-lg mb-1">
                  {t('Banner yuklashda xatolik yuz berdi')}
                </p>
              </div>
              <Button
                onClick={() => refetch()}
                variant="destructive"
                className="rounded-full px-8 py-2 font-medium"
              >
                {t('Попробовать снова')}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {banner && banner.results.length > 0 && (
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full mt-10"
        >
          <CarouselContent>
            {banner.results.map((e) => (
              <CarouselItem key={e.id}>
                <div className="w-full h-[800px] relative overflow-hidden flex rounded-4xl font-medium">
                  <div className="h-[800px] w-full overflow-hidden relative rounded-4xl">
                    <div className="w-[100%] h-[50%] max-sm:h-[60%] z-10 absolute left-0 top-0">
                      <Image
                        src={BannerCircle}
                        alt="circle"
                        className="w-full h-full"
                      />
                    </div>
                    <div className="absolute z-20 top-10 left-4 flex flex-col gap-4">
                      <p className="text-4xl w-[90%] text-[#031753] font-semibold">
                        {e.title}
                      </p>
                      <p className="text-lg text-[#031753] w-[95%]">
                        {e.description}
                      </p>
                      <Link
                        href={e.link}
                        className="bg-[#ECF2FF] w-fit py-3 px-5 rounded-4xl flex gap-4"
                      >
                        <p className="text-[#084FE3] font-semibold">
                          {t('Забронировать')}
                        </p>
                        <ArrowRightAltIcon className="text-[#084FE3]" />
                      </Link>
                    </div>
                    <div
                      className="w-full h-[60%] max-sm:h-[50%] overflow-hidden absolute left-0 bottom-0 rounded-b-4xl"
                      style={{
                        background:
                          'linear-gradient(180deg, #66BCFF 0%, #35DED5 100%)',
                      }}
                    >
                      <Image
                        src={e.image}
                        width={500}
                        height={500}
                        alt="banner"
                        className="w-full h-full absolute z-10 object-cover"
                      />
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
};

export default PopulardestinationsMboile;


  