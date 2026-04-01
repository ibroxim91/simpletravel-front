'use client';

import formatDate from '@/shared/lib/formatDate';
import { Input } from '@/shared/ui/input';
import StarIcon from '@mui/icons-material/Star';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
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

export default function TourInfoStep({
  onNext,
  onPrev,
  data,
  setOrderId,
}: Props) {
  const t = useTranslations();
  const { id } = useParams();
  const [transport, setTransport] = useState<{
    transport: { name: string; icon_name: string } | null;
    price: number;
  }>({
    price: 0,
    transport: null,
  });

  const { setTransport: setStoreTransport, tariff } = formStore();

  useEffect(() => {
    if (
      data?.data.transports &&
      data.data.transports.length > 0 &&
      !transport.transport
    ) {
      const firstTransport = data.data.transports[0];
      const defaultTransport = {
        price: firstTransport.price,
        transport: {
          icon_name: firstTransport.transport?.icon_name,
          name: firstTransport.transport?.name,
        },
      };
      setTransport(defaultTransport);
      setStoreTransport(defaultTransport);
    }
  }, [data, transport.transport, setStoreTransport]);

   const tourData = JSON.parse(localStorage.getItem('tour'))
      if (tourData){
        tourData.tour_operator_id = localStorage.getItem('tourOperatorId')
        tourData.tour_operator = localStorage.getItem('tourOperator')
        tourData.ticket_hotel = tourData.ticket_hotel[0]
      } 
  const { mutate, isPending } = useMutation({
    mutationFn: (body: Create_Ticketorder) =>
      Ticketorder_Api.ticketorder_create(tourData),
    onSuccess: (res) => {
      console.log("res ", res)
      console.log("res.data.data.id ", res.data.id)
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

    const basePrice = data && data.data.price;
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
              src={data?.data.image_banner || ''}
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
              {data?.data.ticket_amenities.map((e) => (
                <li key={e.name} className="text-md text-[#646465]">
                  {e.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <label className="text-xl font-semibold text-[#121212]">
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
                <p className={clsx('text-[#084FE3]')}>
                  {data?.data.hotel_rating} {t('yulduzli')}
                </p>
              </div>
            </label>
            <div className="w-6 h-6 border border-[#084FE3] flex justify-center items-center rounded-full">
              <div className="bg-[#084FE3] w-3.5 h-3.5 rounded-full" />
            </div>
          </div>
        </div>
        {data && data.data.transports.length > 0 && (
          <>
            <p className="text-xl font-semibold mt-5 text-[#121212]">
              {t('Транспорт')}
            </p>
            <div className="mt-[8px] grid grid-cols-2 justify-between gap-[16px] max-md:grid-cols-1">
              {data?.data.transports.map((opt) => {
                console.log("opt ", opt)
                const inputId = `selectTransport-${opt?.name}`;
                const isChecked =transport?.name === opt?.name;
                const IconComponent =
                  LucideIcons[
                    opt?.icon_name as keyof typeof LucideIcons.icons
                  ];
                return (
                  <div
                    key={opt?.name}
                    onClick={() => setTransport(opt)}
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
                      onChange={() => setTransport(opt)}
                      className="w-6 h-6 accent-[#084FE3]"
                    />
                  </div>
                );
              })}
            </div>
          </>
        )}
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
