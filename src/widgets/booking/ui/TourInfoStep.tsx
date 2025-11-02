'use client';

import { LanguageRoutes } from '@/shared/config/i18n/types';
import formatDate from '@/shared/lib/formatDate';
import { formatPrice } from '@/shared/lib/formatPrice';
import { Input } from '@/shared/ui/input';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import StarIcon from '@mui/icons-material/Star';
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import Rating from '@mui/material/Rating';
import { useMutation } from '@tanstack/react-query';
import clsx from 'clsx';
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
  const { locale, id } = useParams();
  const [selected, setSelected] = useState<string | null>(null);
  const [transport, setTransport] = useState<{
    transport: { name: string; icon_name: string };
    price: number;
  }>({
    price: 0,
    transport: { icon_name: '', name: '' },
  });

  const {
    additional,
    setAdditional,
    setTarif,
    transport: storeTransport,
    setTransport: setStoreTransport,
    user,
    where,
    whereTo,
    returned,
    dispatch,
    tariff,
    setTotalPrice,
  } = formStore();

  useEffect(() => {
    // Agar store'da oldingi tanlovlar bo'lsa, ularni yuklaymiz
    if (additional) setSelected(additional);
    if (storeTransport) setTransport(storeTransport);

    // Agar hali hech narsa tanlanmagan bo'lsa, default birinchi elementni tanlaymiz
    if (data?.data) {
      if (!additional && data.data.tariff.length > 0) {
        const firstTariff = data.data.tariff[0];
        setSelected(firstTariff.tariff.name);
        setTarif(firstTariff);
      }
      if (
        (!storeTransport || !storeTransport.transport?.name) &&
        data.data.transports.length > 0
      ) {
        const firstTransport = data.data.transports[0];
        setTransport({
          price: firstTransport.price,
          transport: firstTransport.transport,
        });
        setStoreTransport({
          price: firstTransport.price,
          transport: firstTransport.transport,
        });
      }
    }
  }, [additional, storeTransport, data]);

  const { mutate, isPending } = useMutation({
    mutationFn: (body: Create_Ticketorder) =>
      Ticketorder_Api.ticketorder_create(body),
    onSuccess: (res) => {
      setOrderId(res.data.data.id);
      onNext();
      toast.success(t('Tur muvaffaqiyatli bron qilindi'));
    },
    onError: () => {
      toast.error(t('Xatolik yuz berdi'));
    },
  });

  const handleNext = () => {
    setAdditional(selected);
    setStoreTransport(transport);

    const hasExtra =
      (data?.data.extra_service && data.data.extra_service.length > 0) ||
      (data?.data.paid_extra_service &&
        data.data.paid_extra_service.length > 0);

    const basePrice = data?.data.price || 0;
    const userPrice = basePrice * (user?.length || 0);
    const total_price = tariff.price + transport.price + userPrice;

    setTotalPrice(total_price);
    console.log(!hasExtra);

    if (returned && dispatch && id && total_price && !hasExtra) {
      mutate({
        departure: where,
        arrival_time: formatDate.format(returned, 'YYYY-MM-DD'),
        departure_date: formatDate.format(dispatch, 'YYYY-MM-DD'),
        destination: whereTo,
        extra_paid_service: [],
        extra_service: [],
        participant: user.map((u) => u.userId),
        tariff: tariff.tariff.name,
        transport: transport.transport.name,
        ticket: Number(id),
        total_price,
      });
    } else {
      onNext();
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
                {data?.data.destination}
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
          {t('Выберите категорию')}
        </label>

        <div className="mt-[8px] grid grid-cols-2 justify-between gap-[16px] max-md:grid-cols-1">
          {data?.data.tariff.map((opt) => {
            const inputId = `selectComfort-${opt.tariff.name}`;
            const isChecked = selected === opt.tariff.name;
            return (
              <div
                key={opt.tariff.name}
                onClick={() => {
                  setSelected(opt.tariff.name);
                  setTarif(opt);
                }}
                className={`flex w-full justify-between items-center py-[17px] px-[20px] cursor-pointer border rounded-xl bg-[#EDEEF180] border-[#EDEEF1]`}
              >
                <label
                  htmlFor={inputId}
                  className="flex items-center mr-[70px] gap-[10px] cursor-pointer"
                >
                  <StarIcon
                    sx={{
                      color: isChecked ? '#084FE3' : '#212122',
                      width: '30px',
                      height: '30px',
                    }}
                  />
                  <div className="flex flex-col">
                    <p
                      className={clsx(
                        isChecked ? 'text-[#084FE3]' : 'text-[#212122]',
                      )}
                    >
                      {opt.tariff.name}
                    </p>
                    <p
                      className={clsx(
                        'text-sm',
                        isChecked ? 'text-[#084FE3]' : 'text-[#212122]',
                      )}
                    >
                      {formatPrice(opt.price, locale as LanguageRoutes, true)}
                    </p>
                  </div>
                </label>
                <Input
                  type="radio"
                  id={inputId}
                  name="selectComfort"
                  checked={isChecked}
                  onChange={() => setSelected(opt.tariff.name)}
                  className="w-6 h-6 accent-[#084FE3]"
                />
              </div>
            );
          })}
        </div>

        <p className="text-xl font-semibold mt-5 text-[#121212]">
          {t('Транспорт')}
        </p>
        <div className="mt-[8px] grid grid-cols-2 justify-between gap-[16px] max-md:grid-cols-1">
          {data?.data.transports.map((opt) => {
            const inputId = `selectTransport-${opt.transport.name}`;
            const isChecked = transport.transport.name === opt.transport.name;
            return (
              <div
                key={opt.transport.name}
                onClick={() => setTransport(opt)}
                className={`flex w-full justify-between items-center py-[17px] px-[20px] cursor-pointer border rounded-xl bg-[#EDEEF180] border-[#EDEEF1]`}
              >
                <label
                  htmlFor={inputId}
                  className="flex items-center mr-[20px] gap-[10px] cursor-pointer"
                >
                  {opt.transport.icon_name === 'avia' ? (
                    <AirplaneTicketIcon
                      sx={{
                        color: isChecked ? '#084FE3' : '#212122',
                        width: '30px',
                        height: '30px',
                      }}
                    />
                  ) : (
                    <LocalTaxiIcon
                      sx={{
                        color: isChecked ? '#084FE3' : '#212122',
                        width: '30px',
                        height: '30px',
                      }}
                    />
                  )}
                  <div className="flex flex-col">
                    <p
                      className={clsx(
                        isChecked ? 'text-[#084FE3]' : 'text-[#212122]',
                      )}
                    >
                      {opt.transport.name}
                    </p>
                    <p
                      className={clsx(
                        'text-sm',
                        isChecked ? 'text-[#084FE3]' : 'text-[#212122]',
                      )}
                    >
                      {formatPrice(opt.price, locale as LanguageRoutes, true)}
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
