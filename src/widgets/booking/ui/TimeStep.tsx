import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Form, FormControl, FormField, FormItem } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import FlightIcon from '@mui/icons-material/Flight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Drawer from '@mui/material/Drawer';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { TimesStepForm } from '../lib/form';
import formStore from '../lib/hook';
type Props = {
  onNext: () => void;
};

export default function TimeStep({ onNext }: Props) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [openWhereMobile, setOpenWhereMobile] = useState(false);
  const [openWhereToMobile, setOpenWhereToMobile] = useState(false);
  const {
    where,
    whereTo,
    dispatch,
    returned,
    setWhere,
    setWhereTo,
    setDispatch,
    setReturned,
  } = formStore();
  const [date, setDate] = useState<Date>();
  const [dateReturned, setDateReturned] = useState<Date>();
  const [openReturned, setOpenReturned] = useState(false);
  const form = useForm<z.infer<typeof TimesStepForm>>({
    resolver: zodResolver(TimesStepForm),
    defaultValues: {
      where: where,
      whereTo: whereTo,
      dispatch: dispatch || undefined,
      returned: returned || undefined,
    },
  });

  useEffect(() => {
    form.reset({
      where,
      whereTo,
      dispatch: dispatch || undefined,
      returned: returned || undefined,
    });
  }, [where, whereTo, dispatch, returned, form]);

  function onSubmit(values: z.infer<typeof TimesStepForm>) {
    onNext();
    setWhere(values.where);
    setWhereTo(values.whereTo);
    setDispatch(values.dispatch);
    setReturned(values.returned);
  }

  return (
    <div className="relative">
      <div className="bg-[#FFFFFF] p-[20px] rounded-[20px]">
        <h1 className="font-semibold text-[#212122] text-xl">{t('Дата')}</h1>
        <hr className="h-[2px] my-[24px] bg-[#EDEEF1]" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-2 w-full gap-4 items-start max-lg:grid-cols-1">
              <FormField
                control={form.control}
                name="where"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-lg">{t('Откуда')}</Label>
                    <FormControl>
                      <div className="flex items-center gap-[16px] relative">
                        <Input
                          placeholder={t('Откуда')}
                          {...field}
                          className=" w-full h-full border-2 border-[#EDEEF1] justify-between p-[15px] rounded-md"
                        />
                        <LocationOnIcon
                          sx={{
                            position: 'absolute',
                            width: '28px',
                            right: 10,
                            height: '28px',
                          }}
                        />
                      </div>
                    </FormControl>
                    <p className="text-destructive text-sm">
                      {form.formState.errors.where &&
                        t(form.formState.errors.where.message as string)}
                    </p>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whereTo"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-lg">{t('Куда')}</Label>
                    <FormControl>
                      <div className="flex items-center gap-[16px] relative">
                        <Input
                          placeholder={t('Куда')}
                          {...field}
                          className=" w-full h-full border-2 border-[#EDEEF1] justify-between p-[15px] rounded-md"
                        />
                        <FlightIcon
                          sx={{
                            width: '28px',
                            height: '28px',
                            position: 'absolute',
                            right: 10,
                          }}
                        />
                      </div>
                    </FormControl>
                    <p className="text-destructive text-sm">
                      {form.formState.errors.whereTo &&
                        t(form.formState.errors.whereTo.message as string)}
                    </p>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 w-full gap-4 items-start max-lg:grid-cols-1">
              <FormField
                control={form.control}
                name="dispatch"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-lg">{t('Дата отправления')}</Label>
                    <FormControl>
                      <div>
                        <div className="max-lg:hidden">
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <button
                                className={cn(
                                  'w-full justify-start text-left cursor-pointer relative font-normal border-2 h-full border-[#EDEEF1] rounded-md p-[12px]',
                                  !field.value && 'text-muted-foreground',
                                )}
                              >
                                <CalendarMonthIcon
                                  sx={{
                                    width: '28px',
                                    height: '28px',
                                    position: 'absolute',
                                    right: 10,
                                  }}
                                />
                                {field.value
                                  ? format(field.value, 'dd.MM.yyyy')
                                  : t('Когда')}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => {
                                  setDate(d);
                                  field.onChange(d);
                                  setOpen(false);
                                }}
                                captionLayout="dropdown"
                                disabled={{ before: new Date() }}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="lg:hidden">
                          <button
                            className={cn(
                              'w-full justify-start text-left cursor-pointer relative font-normal border-2 h-[56px] border-[#EDEEF1] rounded-md p-[12px]',
                              !field.value && 'text-muted-foreground',
                            )}
                            onClick={() => setOpenWhereMobile(true)}
                          >
                            <CalendarMonthIcon
                              sx={{
                                width: '28px',
                                height: '28px',
                                position: 'absolute',
                                right: 10,
                              }}
                            />
                            {field.value
                              ? format(field.value, 'dd.MM.yyyy')
                              : t('Когда')}
                          </button>
                          <Drawer
                            anchor="bottom"
                            open={openWhereMobile}
                            onClose={() => setOpenWhereMobile(false)}
                            PaperProps={{
                              sx: {
                                borderTopLeftRadius: 16,
                                borderTopRightRadius: 16,
                                padding: 2,
                                width: '100vw',
                                maxHeight: '85vh',
                                overflow: 'auto',
                              },
                            }}
                          >
                            <div className="flex flex-col gap-4 w-full font-medium">
                              <div className="flex items-center justify-between">
                                <p className="text-lg font-semibold">
                                  {t('Дата отправления')}
                                </p>
                                <Button
                                  variant={'outline'}
                                  className="rounded-full h-[40px] w-[40px] cursor-pointer"
                                  onClick={() => setOpenWhereMobile(false)}
                                >
                                  <CloseIcon sx={{ color: 'black' }} />
                                </Button>
                              </div>
                              <Calendar
                                className="w-full max-w-3xl mx-auto"
                                mode="single"
                                selected={date}
                                onSelect={(d) => {
                                  setDate(d);
                                  field.onChange(d);
                                  setOpen(false);
                                  setOpenWhereMobile(false);
                                }}
                                disabled={{ before: new Date() }}
                                captionLayout="dropdown"
                              />
                            </div>
                          </Drawer>
                        </div>
                      </div>
                    </FormControl>
                    <p className="text-destructive text-sm">
                      {form.formState.errors.dispatch &&
                        t(form.formState.errors.dispatch.message as string)}
                    </p>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="returned"
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-lg">{t('Время возвращения')}</Label>
                    <FormControl>
                      <div>
                        <div className="max-lg:hidden">
                          <Popover
                            open={openReturned}
                            onOpenChange={setOpenReturned}
                          >
                            <PopoverTrigger asChild>
                              <button
                                className={cn(
                                  'w-full justify-start text-left relative font-normal border-2 h-full border-[#EDEEF1] rounded-md p-[12px]',
                                  !field.value && 'text-muted-foreground',
                                )}
                              >
                                <CalendarMonthIcon
                                  sx={{
                                    width: '28px',
                                    height: '28px',
                                    position: 'absolute',
                                    right: 10,
                                  }}
                                />
                                {field.value
                                  ? format(field.value, 'dd.MM.yyyy')
                                  : t('Когда')}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={dateReturned}
                                onSelect={(d) => {
                                  setDateReturned(d);
                                  field.onChange(d);
                                  setOpenReturned(false);
                                }}
                                disabled={{ before: date || new Date() }}
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="lg:hidden">
                          <button
                            className={cn(
                              'w-full justify-start text-left cursor-pointer relative font-normal border-2 h-[56px] border-[#EDEEF1] rounded-md p-[12px]',
                              !field.value && 'text-muted-foreground',
                            )}
                            onClick={() => setOpenWhereToMobile(true)}
                          >
                            <CalendarMonthIcon
                              sx={{
                                width: '28px',
                                height: '28px',
                                position: 'absolute',
                                right: 10,
                              }}
                            />
                            {field.value
                              ? format(field.value, 'dd.MM.yyyy')
                              : t('Когда')}
                          </button>
                          <Drawer
                            anchor="bottom"
                            open={openWhereToMobile}
                            onClose={() => setOpenWhereToMobile(false)}
                            PaperProps={{
                              sx: {
                                borderTopLeftRadius: 16,
                                borderTopRightRadius: 16,
                                padding: 2,
                                width: '100vw',
                                maxHeight: '85vh',
                                overflow: 'auto',
                              },
                            }}
                          >
                            <div className="flex flex-col gap-4 w-full font-medium">
                              <div className="flex items-center justify-between">
                                <p className="text-lg font-semibold">
                                  {t('Время возвращения')}
                                </p>
                                <Button
                                  variant={'outline'}
                                  className="rounded-full h-[40px] w-[40px] cursor-pointer"
                                  onClick={() => setOpenWhereToMobile(false)}
                                >
                                  <CloseIcon sx={{ color: 'black' }} />
                                </Button>
                              </div>
                              <Calendar
                                className="w-full max-w-3xl mx-auto"
                                mode="single"
                                selected={date}
                                onSelect={(d) => {
                                  setDate(d);
                                  field.onChange(d);
                                  setOpen(false);
                                  setOpenWhereToMobile(false);
                                }}
                                disabled={{ before: new Date() }}
                                captionLayout="dropdown"
                              />
                            </div>
                          </Drawer>
                        </div>
                      </div>
                    </FormControl>
                    <p className="text-destructive text-sm">
                      {form.formState.errors.returned &&
                        t(form.formState.errors.returned.message as string)}
                    </p>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
      <Button
        className="mt-5 w-96 max-lg:w-full py-8 cursor-pointer text-lg rounded-full bg-[#1764FC]"
        onClick={form.handleSubmit(onSubmit)}
      >
        {t('Следующий')}
      </Button>
    </div>
  );
}
