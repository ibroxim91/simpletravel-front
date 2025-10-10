import formatDate from '@/shared/lib/formatDate';
import formatPhone from '@/shared/lib/formatPhone';
import onlyNumber from '@/shared/lib/onlyNember';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Calendar } from '@/shared/ui/calendar';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { TrashIcon, UserIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { User_Api } from '../lib/api';
import { EditParticipantProfileSchema } from '../lib/form';

type PassportType = File | { id: number; image: string };

const EditPartners = ({
  setAdded,
  id,
  setId,
}: {
  setAdded: Dispatch<SetStateAction<boolean>>;
  setId: Dispatch<SetStateAction<number | undefined>>;
  id: number | undefined;
}) => {
  const t = useTranslations();
  const queryClient = useQueryClient();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openWhereMobile, setOpenWhereMobile] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof EditParticipantProfileSchema>>({
    resolver: zodResolver(EditParticipantProfileSchema),
    defaultValues: {
      gender: 'male',
      firstName: '',
      lastName: '',
      date: null,
      phone: '',
      passport: null,
    },
  });

  const passportValue = form.watch('passport');
  const dateValue = form.watch('date');

  const { data: oneParticipant } = useQuery({
    queryKey: ['participant_one', id],
    queryFn: () => User_Api.getOneParticipant({ id: id! }),
    select: (data) => data.data,
    enabled: !!id,
  });

  useEffect(() => {
    if (oneParticipant) {
      form.setValue('firstName', oneParticipant.data.first_name);
      form.setValue('date', new Date(oneParticipant.data.birth_date));
      form.setValue('gender', oneParticipant.data.gender);
      form.setValue('lastName', oneParticipant.data.last_name);
      form.setValue('phone', formatPhone(oneParticipant.data.phone_number));
      if (oneParticipant.data.participant_pasport_image) {
        const passportImages =
          oneParticipant.data.participant_pasport_image.map((item) => ({
            id: item.id,
            image: item.image,
          }));

        form.setValue(
          'passport',
          passportImages.length ? passportImages : null,
        );
      } else {
        form.setValue('passport', null);
      }
    }
  }, [oneParticipant, id, form]);

  const { mutate: edit } = useMutation({
    mutationFn: ({ formData }: { formData: FormData }) => {
      return User_Api.editParticipant({ formData, id: id! });
    },
    onSuccess() {
      queryClient.refetchQueries({ queryKey: ['participant_all'] });
      queryClient.refetchQueries({ queryKey: ['participant_one'] });
      toast.success(t('Hamroh muvaffaqiyatli tahrirlandi'));
      form.reset();
      setAdded(false);
      setId(undefined);
    },
    onError() {
      toast.error(t('Xatolik yuz berdi'));
    },
  });

  const { mutate: deleteImage } = useMutation({
    mutationFn: ({ id }: { id: string | number }) => {
      return User_Api.deleteParticipantImage({ id: id });
    },
    onSuccess() {
      queryClient.refetchQueries({ queryKey: ['participant_all'] });
      queryClient.refetchQueries({ queryKey: ['participant_one'] });
      toast.success(t("Hamrohga tegishli rasm muvaffaqiyatli o'chirildi"));
    },
    onError() {
      toast.error(t('Xatolik yuz berdi'));
    },
  });

  function onSubmit(values: z.infer<typeof EditParticipantProfileSchema>) {
    const formData = new FormData();

    formData.append('first_name', values.firstName);
    formData.append('last_name', values.lastName);
    formData.append('gender', values.gender);

    if (values.date) {
      formData.append(
        'birth_date',
        formatDate.format(values.date, 'YYYY-MM-DD'),
      );
    }

    formData.append('phone_number', onlyNumber(values.phone));

    if (values.passport) {
      const files = Array.isArray(values.passport)
        ? values.passport
        : [values.passport];

      files.forEach((file) => {
        if (file instanceof File) {
          formData.append('pasport_images', file);
        }
      });
    }

    edit({ formData });
  }

  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="bg-white p-5 rounded-2xl relative space-y-6">
            <div className="flex items-center justify-between max-lg:flex-col max-lg:items-start max-lg:gap-4">
              <h1 className="font-bold text-xl">{t('Участник')}</h1>
            </div>
            <FormField
              control={form.control}
              name={`gender`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Пол')}</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-8 mt-2 max-sm:flex-col max-sm:items-start">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Input
                          type="radio"
                          value="male"
                          checked={field.value === 'male'}
                          onChange={field.onChange}
                          className="w-6 h-6 accent-[#084FE3]"
                        />
                        {t('Мужчина')}
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <Input
                          type="radio"
                          value="female"
                          checked={field.value === 'female'}
                          onChange={field.onChange}
                          className="w-6 h-6 accent-[#084FE3]"
                        />
                        {t('Женщина')}
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4 items-start max-lg:grid-cols-1">
              <FormField
                control={form.control}
                name={`firstName`}
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-lg font-semibold">{t('Имя')}</Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={t('Введите имя')}
                        className="px-5 h-14 rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`lastName`}
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-lg font-semibold">
                      {t('Фамилия')}
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder={t('Введите фамилию')}
                        className="p-5 rounded-lg h-14"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 items-start max-lg:grid-cols-1">
              <FormField
                control={form.control}
                name={`date`}
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-lg">{t('Время возвращения')}</Label>
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
                                selected={dateValue ? dateValue : undefined}
                                onSelect={(d) => {
                                  field.onChange(d);
                                  setOpen(false);
                                }}
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
                                className="w-full max-w-2xl mx-auto"
                                mode="single"
                                selected={dateValue ? dateValue : undefined}
                                onSelect={(d) => {
                                  {
                                    field.onChange(d);
                                    setOpenWhereMobile(false);
                                  }
                                }}
                                captionLayout="dropdown"
                              />
                            </div>
                          </Drawer>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`phone`}
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-lg font-semibold">
                      {t('Телефон номер')}
                    </Label>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || '+998'}
                        onChange={(e) =>
                          field.onChange(formatPhone(e.target.value))
                        }
                        maxLength={19}
                        placeholder={t('Введите номер')}
                        className="p-5 rounded-lg h-14"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name={`passport`}
              render={({ field }) => (
                <FormItem>
                  <Label className="text-xl font-semibold text-[#212122]">
                    {t('Фото/скан паспорта')}
                  </Label>
                  <FormControl>
                    <Input
                      onChange={(e) => {
                        const files = e.target.files
                          ? Array.from(e.target.files)
                          : [];
                        const currentFiles = Array.isArray(field.value)
                          ? field.value
                          : [];
                        field.onChange([...currentFiles, ...files]);
                      }}
                      type="file"
                      multiple
                      className="hidden"
                      accept="image/*"
                      id={`passport-file`}
                    />
                  </FormControl>
                  <label
                    htmlFor={`passport-file`}
                    className="w-full bg-[#EDEEF180] border-2 border-dashed border-[#D3D3D3] flex flex-col items-center gap-2 justify-center py-4 rounded-2xl cursor-pointer hover:bg-[#EDEEF1]"
                  >
                    <p className="font-semibold text-xl text-[#212122]">
                      {t('Drag or select file')}
                    </p>
                    <p className="text-[#646465] text-sm text-center">
                      {t('Drop files here or click to')}{' '}
                      <span className="underline text-[#084FE3]">
                        {t('browse')}
                      </span>{' '}
                      {t('through your machine')}
                    </p>
                  </label>
                  <FormMessage />
                </FormItem>
              )}
            />
            {passportValue && passportValue.length > 0 && (
              <div className="w-full flex flex-col gap-2 mt-4">
                {passportValue.map((file: PassportType, index: number) => (
                  <div
                    key={index}
                    className="w-full flex items-center justify-between p-3 border-2 border-[#EDEEF1] rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-[50px] h-[50px]">
                        <Image
                          src={
                            file instanceof File
                              ? URL.createObjectURL(file)
                              : typeof file === 'string'
                                ? file
                                : file.image
                          }
                          alt="passport"
                          fill
                          className="object-contain rounded-md"
                        />
                      </div>
                      <div>
                        <h1 className="font-bold text-sm truncate max-w-[150px]">
                          {'name' in file ? file.name : 'Image'}
                        </h1>
                        <p className="text-xs text-[#718096]">
                          {'size' in file
                            ? (file.size / 1024).toFixed(1) + 'KB'
                            : 'Image'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        type="button"
                        onClick={() => {
                          if (!passportValue) return;

                          const newFiles = [...passportValue]; // kopiya
                          const removed = newFiles.splice(index, 1)[0]; // elementni o'chirish
                          form.setValue(
                            'passport',
                            newFiles.length ? newFiles : null,
                          );

                          // Agar serverdagi rasm bo'lsa, o'chirish mutation chaqirish
                          if (
                            removed &&
                            typeof removed !== 'string' &&
                            'id' in removed
                          ) {
                            deleteImage({ id: removed.id });
                          }
                        }}
                      >
                        <TrashIcon />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        onClick={() => {
                          setPreviewFile(file instanceof File ? file : null);
                          setPreviewOpen(true);
                        }}
                      >
                        <UserIcon />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 max-lg:grid max-lg:grid-cols-2 mt-5 sticky bottom-0">
            <button
              type="button"
              onClick={() => {
                setAdded(false);
                setId(undefined);
              }}
              className="bg-[#FFFFFF] border shadow-nonde border-[#DFDFDF] text-[#031753] hover:bg-[#FFFFFF] px-14 py-3 max-lg:px-0 rounded-full cursor-pointer"
            >
              {t('Отмена')}
            </button>
            <button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
              className="bg-[#1764FC] border shadow-nonde text-white border-[#DFDFDF] hover:bg-[#1764FC] px-14 py-3 max-lg:px-0 rounded-full cursor-pointer"
            >
              {t('Сохранить')}
            </button>
          </div>
        </form>

        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-3xl">
            {previewFile && (
              <Image
                src={
                  typeof previewFile === 'string'
                    ? previewFile
                    : URL.createObjectURL(previewFile)
                }
                alt="passport-preview"
                width={800}
                height={600}
                className="object-contain w-full h-auto rounded-lg"
              />
            )}
          </DialogContent>
        </Dialog>
      </Form>
    </motion.div>
  );
};

export default EditPartners;
