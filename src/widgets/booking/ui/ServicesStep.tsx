import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { ExcursionsOptions, ServicesOptions } from '@/widgets/booking/lib/data';
import { zodResolver } from '@hookform/resolvers/zod';
import Switch from '@mui/material/Switch';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { ServicesForm } from '../lib/form';
import formStore from '../lib/hook';

type Props = {
  onNext: () => void;
  onPrev: () => void;
};

export default function ServicesStep({ onNext, onPrev }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [service, setService] = useState<number | null>(null);
  const { excursions, setExcursions, tours_category, setToursCategory } =
    formStore();

  const form = useForm<z.infer<typeof ServicesForm>>({
    resolver: zodResolver(ServicesForm),
    defaultValues: {
      additional: '',
      excursions: '',
    },
  });

  useEffect(() => {
    if (excursions) {
      setSelected(excursions);
    }
    if (tours_category) {
      setService(tours_category);
    }
    if (excursions && tours_category) {
      form.reset({
        additional: String(tours_category),
        excursions: String(excursions),
      });
    }
  }, [excursions, tours_category, form]);

  function onSubmit(values: z.infer<typeof ServicesForm>) {
    onNext();
    setExcursions(Number(values.excursions));
    setToursCategory(Number(values.additional));
  }
  return (
    <div>
      <div className="w-full bg-[#FFFFFF] p-[20px] rounded-[20px] relative">
        <h1 className="text-[20px] font-bold">Услуги</h1>
        <hr className="h-[2px] my-[24px] bg-[#EDEEF1]" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name={`excursions`}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-xl font-medium">Экскурсии</Label>
                  <FormControl>
                    <div className="mt-4 grid grid-cols-2 justify-between gap-[16px] my-5 max-lg:grid-cols-1">
                      {ExcursionsOptions.map((opt) => {
                        const inputId = `selectComfort-${opt.id}`;
                        const isChecked = selected === opt.id;
                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              setSelected(opt.id);
                              field.onChange(String(opt.id));
                            }}
                            className={`flex w-full justify-between items-center py-[17px] px-[20px] cursor-pointer border border-[#EDEEF1] rounded-[12px] bg-[#EDEEF180]`}
                          >
                            <p
                              className={clsx(
                                'font-semibold',
                                isChecked ? 'text-[#084FE3]' : 'text-[#212122]',
                              )}
                            >
                              {opt.label}
                            </p>
                            <Input
                              type="radio"
                              id={inputId}
                              name="selectComfort"
                              checked={isChecked}
                              onChange={() => {
                                setSelected(opt.id);
                                field.onChange(String(opt.id));
                              }}
                              className="w-6 h-6 accent-[#084FE3]"
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
            <FormField
              control={form.control}
              name={`additional`}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-xl font-medium">
                    Дополнительные услуги
                  </Label>
                  <FormControl>
                    <div className="mt-[8px] grid grid-cols-2 gap-[16px] max-lg:grid-cols-1">
                      {ServicesOptions.map((opt) => {
                        const isChecked = service === opt.id; // service hozirgi tanlov
                        return (
                          <div
                            key={opt.id}
                            onClick={() => {
                              const newValue = isChecked ? null : opt.id;
                              setService(newValue);
                              field.onChange(newValue ? String(newValue) : '');
                            }}
                            className={`flex w-full justify-between items-center py-[17px] px-[20px] cursor-pointer border border-[#EDEEF1] rounded-[12px] bg-[#EDEEF180]`}
                          >
                            <p
                              className={clsx(
                                'font-semibold',
                                isChecked ? 'text-[#084FE3]' : 'text-[#212122]',
                              )}
                            >
                              {opt.label}
                            </p>
                            <Switch
                              checked={isChecked}
                              onClick={(e) => {
                                e.stopPropagation();
                                const newValue = isChecked ? null : opt.id;
                                setService(newValue);
                                field.onChange(
                                  newValue ? String(newValue) : '',
                                );
                              }}
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
          </form>
        </Form>
      </div>
      <div className="flex justify-between max-lg:flex-col">
        <button
          onClick={onPrev}
          className="bg-gray-200 border shadow-sm border-[#D3D3D3] text-gray-800 hover:bg-gray-300 py-4 font-medium px-20 left-0 cursor-pointer rounded-full mt-[20px]"
        >
          Назад
        </button>
        <button
          onClick={form.handleSubmit(onSubmit)}
          className="bg-[#084FE3] text-white py-4 font-medium px-20 left-0 cursor-pointer rounded-full mt-[20px]"
        >
          Следующий
        </button>
      </div>
    </div>
  );
}
