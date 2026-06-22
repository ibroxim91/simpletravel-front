'use client';

import formatDate from '@/shared/lib/formatDate';
import { cn } from '@/shared/lib/utils';
import { Input } from '@/shared/ui/input';
import StarIcon from '@mui/icons-material/Star';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import PeopleIcon from '@mui/icons-material/People';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import KingBedIcon from '@mui/icons-material/KingBed';
import Rating from '@mui/material/Rating';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
import * as LucideIcons from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Create_Ticketorder, Get_Info, Ticketorder_Api } from '../lib/api';
import formStore from '../lib/hook';

type Props = {
  onNext: () => void;
  onPrev: () => void;
  data: Get_Info | undefined;
  setOrderId: React.Dispatch<React.SetStateAction<number | undefined>>;
};

function parseApiDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null;
  if (dateStr.includes('-')) return new Date(dateStr);
  if (dateStr.length === 8) {
    const year = parseInt(dateStr.slice(0, 4), 10);
    const month = parseInt(dateStr.slice(4, 6), 10) - 1;
    const day = parseInt(dateStr.slice(6, 8), 10);
    return new Date(year, month, day);
  }
  return null;
}

function formatTourDate(date: Date | null | undefined): string {
  if (!date || Number.isNaN(date.getTime())) return '—';
  return formatDate.format(date, 'DD-MM-YYYY');
}

function getMealShort(meal?: string) {
  if (!meal) return '';
  const normalized = meal.toLowerCase().replace(/\s+/g, '_');
  const mealMap: Record<string, string> = {
    breakfast: 'BB',
    bed_breakfast: 'BB',
    half_board: 'HB',
    full_board: 'FB',
    all_inclusive: 'AI',
    ultra_all_inclusive: 'UAI',
    room_only: 'RO',
  };
  if (mealMap[normalized]) return mealMap[normalized];
  if (/^(bb|hb|fb|ai|uai|ro)$/i.test(meal.trim())) {
    return meal.trim().toUpperCase();
  }
  return meal.trim();
}

function getMealPlanValue(
  tour: Get_Info['data'] | undefined,
  translate: (key: string) => string,
): string {
  const hotel = Array.isArray(tour?.ticket_hotel)
    ? tour?.ticket_hotel[0]
    : tour?.ticket_hotel;
  const meal = tour?.hotel_meals || hotel?.meal_plan;
  if (!meal) return '—';

  const shortCode = getMealShort(meal);
  const translated = translate(shortCode);
  return translated !== shortCode ? translated : shortCode;
}

function syncCommentToTourStorage(value: string) {
  if (typeof window === 'undefined') return;
  const tourRaw = localStorage.getItem('tour');
  if (!tourRaw) return;

  try {
    const tourData = JSON.parse(tourRaw);
    const trimmed = value.trim();
    if (trimmed) {
      tourData.comment = trimmed;
    } else {
      delete tourData.comment;
    }
    localStorage.setItem('tour', JSON.stringify(tourData));
    localStorage.setItem('bookingComment', trimmed);
  } catch {
    // ignore invalid tour payload
  }
}

export default function TourInfoStep({
  onNext,
  onPrev,
  data,
  setOrderId,
}: Props) {
  const t = useTranslations();
  const { id } = useParams();
  const [transport, setTransport] = useState<{
    transport: { name: string; id: number; icon_name?: string } | null;
  }>({
    transport: null,
  });

  const { setTransport: setStoreTransport, tariff, setAdditional } = formStore();
  const [comment, setComment] = useState('');

  useEffect(() => {
    let savedComment = '';
    try {
      const tourRaw = localStorage.getItem('tour');
      const tourComment = tourRaw ? JSON.parse(tourRaw).comment : '';
      savedComment =
        localStorage.getItem('bookingComment') ||
        (typeof tourComment === 'string' ? tourComment : '') ||
        '';
    } catch {
      savedComment = localStorage.getItem('bookingComment') || '';
    }

    setComment(savedComment);
    if (savedComment) {
      setAdditional(savedComment);
      syncCommentToTourStorage(savedComment);
    }
  }, [setAdditional]);

  useEffect(() => {
    if (
      data?.data.transports &&
      data.data.transports.length > 0 &&
      !transport.transport
    ) {
      const firstTransport = data.data.transports[0];
      console.log("firstTransport ", firstTransport)
      const defaultTransport = {
        transport: {
          id: firstTransport?.id,
          name: firstTransport?.name,
        },
      };
      console.log("defaultTransport ", defaultTransport)
      setTransport(defaultTransport);
      setStoreTransport(defaultTransport);
    }
  }, [data, transport.transport, setStoreTransport]);

  const buildTourPayload = () => {
    const tourData = JSON.parse(localStorage.getItem('tour') || 'null');
    if (!tourData) return tourData;
    tourData.tour_operator_id = localStorage.getItem('tourOperatorId');
    tourData.tour_operator = localStorage.getItem('tourOperator');
    tourData.ticket_hotel = tourData.ticket_hotel?.[0] ?? tourData.ticket_hotel;
    syncCommentToTourStorage(comment);
    if (comment.trim()) {
      tourData.comment = comment.trim();
    } else {
      delete tourData.comment;
    }
    return tourData;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (_body: Create_Ticketorder) =>
      Ticketorder_Api.ticketorder_create(buildTourPayload()),
    onSuccess: (res) => {
      localStorage.setItem('orderId', res.data.id.toString());
      setOrderId(res.data.id);
      onNext();
      toast.success(t('Tur muvaffaqiyatli bron qilindi'));
    },
    onError: () => {
      toast.error(t('Xatolik yuz berdi'));
    },
  });

  const handleNext = () => {
    const timeData = JSON.parse(localStorage.getItem('timesStepForm') || '{}');
    const participantsData = JSON.parse(
      localStorage.getItem('participantsForm') || '{}',
    );

    localStorage.setItem('bookingComment', comment.trim());
    syncCommentToTourStorage(comment);
    setAdditional(comment.trim() || null);

    if (transport && transport.transport) {
      setStoreTransport({
        price: transport.price,
        transport: {
          icon_name: transport.transport?.icon_name,
          name: transport.transport?.name,
        },
      });
    }

    const hasExtra =
      (data?.data.extra_service && data.data.extra_service.length > 0) ||
      (data?.data.paid_extra_service &&
        data.data.paid_extra_service.length > 0);

    const basePrice = data ? Number(data.data.price) : 0;
    const userPrice =
      basePrice && basePrice * participantsData.participants.length;
    const total_price = userPrice;

    if (total_price && !hasExtra) {
      mutate({
        departure: timeData.where,
        destination: timeData.whereTo,
        departure_date: formatDate.format(timeData.dispatch, 'YYYY-MM-DD'),
        arrival_time: formatDate.format(timeData.returned, 'YYYY-MM-DD'),

        extra_paid_service: [],
        extra_service: [],

        participant: participantsData.userIds,

        tariff: tariff.tariff.name,
        transport: transport.transport?.name,
        ticket: Number(id),
        total_price,
      });
      localStorage.setItem(
        'info',
        JSON.stringify({
          transport,
          tariff: tariff.tariff.name,
        }),
      );
      localStorage.setItem('totalPrice', JSON.stringify(total_price));
    } else {
      onNext();
      localStorage.setItem(
        'info',
        JSON.stringify({
          transport,
          tariff: tariff.tariff.name,
        }),
      );
    }
  };

  const tour = data?.data;
  const timeData = JSON.parse(
    typeof window !== 'undefined'
      ? localStorage.getItem('timesStepForm') || '{}'
      : '{}',
  );
  const participantsData = JSON.parse(
    typeof window !== 'undefined'
      ? localStorage.getItem('participantsForm') || '{}'
      : '{}',
  );

  const departureName =
    timeData.where || tour?.departure?.name || '—';
  const destinationName =
    timeData.whereTo || tour?.destination?.name || '—';

  const departureDate = timeData.dispatch
    ? new Date(timeData.dispatch)
    : parseApiDate(tour?.departure_time || tour?.departure_date);
  const returnDate = timeData.returned
    ? new Date(timeData.returned)
    : parseApiDate(tour?.travel_time);

  const nights = tour?.nights ?? tour?.duration_days ?? '—';
  const passengerCount =
    participantsData.participants?.length ||
    participantsData.userIds?.length ||
    tour?.passenger_count ||
    1;

  const mealPlan = getMealPlanValue(tour, t);
  const roomType = tour?.room_type?.trim();

  const infoRows = [
    {
      label: t('Qayerdan'),
      value: departureName,
      icon: (
        <FlightTakeoffIcon sx={{ width: 20, height: 20, color: '#084FE3' }} />
      ),
    },
    {
      label: t('Qayerga'),
      value: destinationName,
      icon: (
        <FlightLandIcon sx={{ width: 20, height: 20, color: '#084FE3' }} />
      ),
    },
    {
      label: t('Ketish sanasi'),
      value: formatTourDate(departureDate),
      icon: (
        <CalendarMonthIcon sx={{ width: 20, height: 20, color: '#084FE3' }} />
      ),
    },
    {
      label: t('Kelish sanasi'),
      value: formatTourDate(returnDate),
      icon: (
        <CalendarMonthIcon sx={{ width: 20, height: 20, color: '#084FE3' }} />
      ),
    },
    {
      label: t('Tunlar soni'),
      value: nights,
      icon: (
        <NightsStayIcon sx={{ width: 20, height: 20, color: '#084FE3' }} />
      ),
    },
    {
      label: t('Sayohatchilar soni'),
      value: passengerCount,
      icon: <PeopleIcon sx={{ width: 20, height: 20, color: '#084FE3' }} />,
    },
    {
      label: t('Ovqatlanish turi'),
      value: mealPlan,
      icon: (
        <RestaurantMenuIcon sx={{ width: 20, height: 20, color: '#084FE3' }} />
      ),
    },
    ...(roomType
      ? [
          {
            label: t('Xona turi'),
            value: roomType,
            icon: (
              <KingBedIcon sx={{ width: 20, height: 20, color: '#084FE3' }} />
            ),
          },
        ]
      : []),
  ];

  return (
    <div>
      <div className="w-full bg-[#FFFFFF] p-[20px] rounded-[20px] relative">
        <h1 className="text-[20px] font-bold text-[#212122]">
          {t('Турпакет')}
        </h1>
        <hr className="h-[2px] my-[24px] bg-[#DFDFDF]" />

        <div className="flex items-center gap-[20px] my-[20px] max-lg:flex-col max-lg:items-start">
          <div className="relative rounded-2xl aspect-square w-48 cursor-pointer max-lg:w-full">
            <Image
              src={
                tour?.hotel_photo ||
                data?.hotel_photo ||
                tour?.ticket_images ||
                ''
              }
              alt="tour"
              className="object-cover rounded-2xl"
              fill
              quality={100}
            />
          </div>

          <div>
            <div className="flex items-center gap-4 max-lg:items-start">
              <Rating
                name="read-only"
                size="medium"
                value={data?.data.rating}
                readOnly
                sx={{ color: '#F08125' }}
                precision={0.1}
              />
            </div>

            <h1 className="text-2xl font-semibold mt-1 text-[#031753]">
              {data?.data.title}
            </h1>
            <div className="flex items-center gap-1 mt-1">
              <WhereToVoteIcon
                sx={{ width: '24px', height: '24px', color: '#084FE3' }}
              />
              <p className="text-[#031753] font-normal">
                {data?.data.destination?.name}
              </p>
            </div>

            <ul className="flex items-center gap-[20px] mt-2 list-disc list-inside max-lg:flex-col max-lg:items-start">
              {tour?.ticket_amenities?.map((e) => (
                <li key={e.name} className="text-md text-[#646465]">
                  {e.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-[#212122] mb-4">
            {t("Tur ma'lumotlari")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {infoRows.map((row, index) => (
              <div
                key={row.label}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-xl px-4 py-3 max-md:flex-col max-md:items-start max-md:gap-2',
                  index % 2 === 0 ? 'bg-[#EDEEF1]' : 'bg-white border border-[#EDEEF1]',
                )}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {row.icon}
                  <span className="text-sm text-[#646465]">{row.label}</span>
                </div>
                <span className="text-sm font-medium text-[#212122] text-right max-md:text-left break-words">
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {(tour?.allow_comment ?? true) && (
            <div className="mt-6">
              <label
                htmlFor="booking-comment"
                className="block text-sm font-medium text-[#212122] mb-2"
              >
                {t("Qo'shimcha izoh")}{' '}
                <span className="text-[#646465] font-normal">
                  ({t('ixtiyoriy')})
                </span>
              </label>
              <textarea
                id="booking-comment"
                value={comment}
                onChange={(e) => {
                  const value = e.target.value;
                  setComment(value);
                  setAdditional(value || null);
                  syncCommentToTourStorage(value);
                }}
                placeholder={t('Izoh qoldiring...')}
                rows={4}
                className={cn(
                  'w-full resize-y min-h-[100px] rounded-xl border border-[#DFDFDF] bg-[#FAFAFA] px-4 py-3 text-sm text-[#212122]',
                  'placeholder:text-[#646465] outline-none transition-colors',
                  'focus:border-[#084FE3] focus:ring-2 focus:ring-[#084FE3]/20',
                )}
              />
            </div>
          )}
        </div>

        {/* <label className="text-xl font-semibold text-[#121212]">
          {t('Звезда гостиницы')}
        </label>

        <div className="mt-[8px] grid grid-cols-2 justify-between gap-[16px] max-md:grid-cols-1">
          <div
            className={`flex w-full justify-between items-center py-[17px] px-[20px] cursor-pointer border rounded-xl
               bg-[#EDEEF180] border-[#EDEEF1]`}
          >
            <label className="flex items-center mr-[70px] gap-[10px] cursor-pointer">
              <StarIcon
                sx={{
                  color: '#084FE3',
                  width: '30px',
                  height: '30px',
                }}
              />
              <div className="flex flex-col">
                {typeof data?.data?.ticket_hotel[0]?.rating === 'number' ? (
                  <p className={clsx('text-[#084FE3]')}>
                    {data.data.ticket_hotel[0]?.rating} {t('yulduzli')}
                  </p>
                ) : (
                  <p className={clsx('text-[#084FE3]')}>
                    {data?.data?.ticket_hotel[0]?.rating ?? ''}
                  </p>
                )}
              </div>
            </label>
            <div className="w-6 h-6 border border-[#084FE3] flex justify-center items-center rounded-full">
              <div className="bg-[#084FE3] w-3.5 h-3.5 rounded-full" />
            </div>
          </div>
        </div> */}
        {/* {data && data.data.transports.length > 0 && (
          <>
            <p className="text-xl font-semibold mt-5 text-[#121212]">
              {t('Транспорт')}
            </p>
            <div className="mt-[8px] grid grid-cols-2 justify-between gap-[16px] max-md:grid-cols-1">
              {data?.data.transports.map((opt) => {
           
                const inputId = `selectTransport-${opt?.id}`;
                const isChecked = transport?.transport?.id === opt?.id;
                const IconComponent =
                  LucideIcons[
                    opt?.icon_name as keyof typeof LucideIcons.icons
                  ];
                return (
                  <div
                    key={opt?.id}
                    onClick={() => setTransport({ transport: { id: opt.id, name: opt.name, icon_name: opt?.icon_name } })}
                    className={`flex w-full justify-between items-center py-[17px] px-[20px] cursor-pointer border rounded-xl bg-[#EDEEF180] border-[#EDEEF1]`}
                  >
                    <label
                      htmlFor={inputId}
                      className="flex items-center mr-[20px] gap-[10px] cursor-pointer"
                    >
                      {IconComponent ? (
                        <IconComponent className="w-5 h-5 text-[#232325]" />
                      ) : null}
                      <div className="flex flex-col">
                        <p
                          className={clsx(
                            isChecked ? 'text-[#084FE3]' : 'text-[#212122]',
                          )}
                        >
                          {opt?.name}
                        </p>
                      </div>
                    </label>
                    <Input
                      type="radio"
                      id={inputId}
                      name="selectTransport"
                      checked={isChecked}
                      onChange={() => setTransport({ transport: { id: opt.id, name: opt.name, icon_name: opt.icon_name } })}
                      className="w-6 h-6 accent-[#084FE3]"
                    />
                  </div>
                );
              })}
            </div>
          </>
        )} */}
      </div>

      <div className="flex justify-between max-lg:flex-col">
        <button
          onClick={onPrev}
          className="bg-gray-200 border shadow-sm border-[#D3D3D3] text-gray-800 hover:bg-gray-300 py-4 font-medium px-20 rounded-full mt-[20px]"
        >
          {t('Назад')}
        </button>
        <button
          onClick={handleNext}
          disabled={isPending}
          className="bg-[#1764FC] text-white py-4 font-medium px-20 rounded-full mt-[20px]"
        >
          {isPending ? t('Yuklanmoqda...') : t('Следующий')}
        </button>
      </div>
    </div>
  );
}
