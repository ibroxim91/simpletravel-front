import { LanguageRoutes } from '@/shared/config/i18n/types';
import formatDate from '@/shared/lib/formatDate';
import { formatPrice } from '@/shared/lib/formatPrice';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import Switch from '@mui/material/Switch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Create_Ticketorder, Get_Info, Ticketorder_Api } from '../lib/api';
import { ServicesForm } from '../lib/form';
import formStore from '../lib/hook';

type Props = {
  onNext: () => void;
  onPrev: () => void;
  data: Get_Info | undefined;
  setOrderId: Dispatch<SetStateAction<number | undefined>>;
};

export default function ServicesStep({
  onNext,
  onPrev,
  data,
  setOrderId,
}: Props) {
  const t = useTranslations();
  const { locale, id } = useParams();
  const queryClient = useQueryClient();
  const [selectedExcursions, setSelectedExcursions] = useState<number[]>([]);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  useEffect(() => {
    const savedExcursions = localStorage.getItem('selectedExcursions');
    const savedServices = localStorage.getItem('selectedServices');

    if (savedExcursions) {
      const parsed = JSON.parse(savedExcursions);
      setSelectedExcursions(parsed);
      setExcursions(parsed);
      form.setValue('excursions', parsed);
    }

    if (savedServices) {
      const parsed = JSON.parse(savedServices);
      setSelectedServices(parsed);

      const selectedServicesData = data?.data.extra_service
        .filter((item) => parsed.includes(item.id))
        .map((item) => ({
          id: item.id,
          name: item.name,
        }));

      if (selectedServicesData) {
        setToursCategory(selectedServicesData);
      }

      form.setValue('additional', parsed);
    }
  }, [data]);

  const { mutate, isPending } = useMutation({
    mutationFn: (body: Create_Ticketorder) =>
      Ticketorder_Api.ticketorder_create(body),
    onSuccess: (res) => {
      setOrderId(res.data.data.id);
      toast.success(t('Tur muvaffaqiyatli bron qilindi'));
      queryClient.refetchQueries({ queryKey: ['order_all'] });
      onNext();
    },
    onError: () => {
      toast.error(t('Xatolik yuz berdi'));
    },
  });

  const {
    excursions,
    setExcursions,
    tours_category,
    setToursCategory,
    setPaidService,
    setTotalPrice,
  } = formStore();

  const form = useForm<z.infer<typeof ServicesForm>>();

  const store = formStore();
  useEffect(() => {
    if (excursions?.length) {
      setSelectedExcursions(excursions);
    }
    if (tours_category?.length) {
      setSelectedServices(tours_category.map((service) => service.id));
    }
  }, [excursions, tours_category]);

  function toggleExcursion(id: number) {
    setSelectedExcursions((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((eid) => eid !== id)
        : [...prev, id];
      setExcursions(updated);

      const selectedExcursionData = data?.data.paid_extra_service
        .filter((service) => updated.includes(service.id))
        .map((service) => ({
          id: service.id,
          price: service.price,
          name: service.name,
        }));

      if (selectedExcursionData && selectedExcursionData.length > 0) {
        setPaidService(selectedExcursionData);
      } else {
        setPaidService([]);
      }
      form.setValue('excursions', updated);
      return updated;
    });
  }

  function toggleService(name: string, id: number) {
    setSelectedServices((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id];

      const selectedServicesData = data?.data.extra_service
        .filter((service) => updated.includes(service.id))
        .map((service) => ({
          id: service.id,
          name: service.name,
        }));

      if (selectedServicesData && selectedServicesData.length > 0) {
        setToursCategory(selectedServicesData);
      } else {
        setToursCategory([]);
      }
      form.setValue('additional', updated);
      return updated;
    });
  }

  function onSubmit() {
    const timeData = JSON.parse(localStorage.getItem('timesStepForm') || '{}');
    const participantsData = JSON.parse(
      localStorage.getItem('participantsForm') || '{}',
    );
    const tariff = JSON.parse(localStorage.getItem('info') || '{}');

    setExcursions(selectedExcursions);
    const selectedServicesData = data?.data.extra_service
      .filter((service) => selectedServices.includes(service.id))
      .map((service) => ({
        id: service.id,
        name: service.name,
      }));

    if (selectedServicesData) {
      setToursCategory(selectedServicesData);
    }

    const basePrice = data?.data.price || 0;
    const paidServicesTotal = store.paidService.reduce(
      (acc, service) => acc + service.price,
      0,
    );
    const userPrice = basePrice * participantsData.participants.length;

    const total_price =
      paidServicesTotal +
      store.tariff.price +
      store.transport.price +
      userPrice;
    setTotalPrice(total_price);
    if (id && total_price && tariff.transport) {
      mutate({
        departure: timeData.where,
        destination: timeData.whereTo,
        departure_date: formatDate.format(timeData.dispatch, 'YYYY-MM-DD'),
        arrival_time: formatDate.format(timeData.returned, 'YYYY-MM-DD'),

        extra_service: selectedExcursions,
        extra_paid_service: selectedServices,

        participant: participantsData.userIds,

        tariff: tariff.tariff.name,
        transport: tariff.transport.transport.name,
        ticket: Number(id),
        total_price,
      });
    }
    localStorage.setItem(
      'selectedExcursions',
      JSON.stringify(selectedExcursions),
    );
    localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
    localStorage.setItem('totalPrice', JSON.stringify(total_price));
  }

  console.log(form.formState.errors);

  return (
    <div>
      <div className="w-full bg-[#FFFFFF] p-[20px] rounded-[20px] relative">
        <h1 className="text-[20px] font-bold text-[#212122]">{t('Услуги')}</h1>
        <hr className="h-[2px] my-[24px] bg-[#DFDFDF]" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {data && data.data.paid_extra_service.length > 0 && (
              <FormField
                control={form.control}
                name={`excursions`}
                render={() => (
                  <FormItem>
                    <Label className="text-xl font-medium text-[#121212]">
                      {t('Экскурсии')}
                    </Label>
                    <FormControl>
                      <div className="mt-4 grid grid-cols-2 justify-between gap-[16px] my-5 max-lg:grid-cols-1">
                        {data?.data.paid_extra_service.map((opt) => {
                          const isChecked = selectedExcursions.includes(opt.id);
                          return (
                            <div
                              key={opt.id}
                              onClick={() => toggleExcursion(opt.id)}
                              className={`flex w-full justify-between items-center py-[17px] px-[20px] cursor-pointer border border-[#EDEEF1] rounded-[12px] bg-[#EDEEF180]`}
                            >
                              <p
                                className={clsx(
                                  'font-semibold',
                                  isChecked
                                    ? 'text-[#084FE3]'
                                    : 'text-[#212122]',
                                )}
                              >
                                {opt.name}{' '}
                                {formatPrice(
                                  opt.price,
                                  locale as LanguageRoutes,
                                  true,
                                )}
                              </p>
                              <Input
                                type="checkbox"
                                name={t('selectComfort')}
                                checked={isChecked}
                                onChange={() => toggleExcursion(opt.id)}
                                className="w-4 h-4 accent-[#084FE3] rounded-full"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {data && data.data.extra_service.length > 0 && (
              <div>
                <Label className="text-xl font-medium text-[#121212]">
                  {t('Дополнительные услуги')}
                </Label>
                <div className="mt-[8px] grid grid-cols-2 gap-[16px] max-lg:grid-cols-1">
                  {data?.data.extra_service.map((opt) => {
                    const isChecked = selectedServices.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => toggleService(opt.name, opt.id)}
                        className="flex justify-between items-center py-[17px] px-[20px] border border-[#EDEEF1] rounded-[12px] bg-[#EDEEF180] cursor-pointer"
                      >
                        <p
                          className={clsx(
                            'font-semibold',
                            isChecked ? 'text-[#084FE3]' : 'text-[#212122]',
                          )}
                        >
                          {opt.name}
                        </p>
                        <Switch
                          checked={isChecked}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleService(opt.name, opt.id);
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </form>
        </Form>
      </div>

      <div className="flex justify-between max-lg:flex-col">
        <button
          onClick={onPrev}
          className="bg-gray-200 border cursor-pointer shadow-sm border-[#D3D3D3] text-gray-800 hover:bg-gray-300 py-4 font-medium px-20 rounded-full mt-[20px]"
        >
          {t('Назад')}
        </button>
        <button
          onClick={form.handleSubmit(onSubmit)}
          className="bg-[#1764FC] text-white py-4 cursor-pointer font-medium px-20 rounded-full mt-[20px]"
        >
          {isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            t('Следующий')
          )}
        </button>
      </div>
    </div>
  );
}
