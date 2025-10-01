import Badge from '@/assets/Badge.png';
import { cn } from '@/shared/lib/utils';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
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
import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Drawer from '@mui/material/Drawer';
import clsx from 'clsx';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { TrashIcon, UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { dataTraveler } from '../lib/data';
import { ParticipantProfileSchema } from '../lib/form';

function TravelersTabs() {
  const [add, setAdded] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [openWhereMobile, setOpenWhereMobile] = useState(false);
  const [previewFile, setPreviewFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof ParticipantProfileSchema>>({
    resolver: zodResolver(ParticipantProfileSchema),
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

  function onSubmit() {
    setAdded(false);
    form.reset();
  }

  return (
    <div
      className={clsx(
        'w-full relative rounded-3xl px-6',
        add ? 'bg-none lg:px-6 max-lg:px-0' : 'bg-white h-full py-4',
      )}
    >
      <AnimatePresence mode="wait">
        {add ? (
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
                    <h1 className="font-bold text-xl">Участник</h1>
                  </div>
                  <FormField
                    control={form.control}
                    name={`gender`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Пол</FormLabel>
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
                              Мужчина
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <Input
                                type="radio"
                                value="female"
                                checked={field.value === 'female'}
                                onChange={field.onChange}
                                className="w-6 h-6 accent-[#084FE3]"
                              />
                              Женщина
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
                          <Label className="text-lg font-semibold">Имя</Label>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Введите имя"
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
                            Фамилия
                          </Label>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Введите фамилию"
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
                          <Label className="text-lg">Время возвращения</Label>
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
                                        : 'Когда'}
                                    </button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      selected={
                                        dateValue ? dateValue : undefined
                                      }
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
                                    : 'Когда'}
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
                                        Дата отправления
                                      </p>
                                      <Button
                                        variant={'outline'}
                                        className="rounded-full h-[40px] w-[40px] cursor-pointer"
                                        onClick={() =>
                                          setOpenWhereMobile(false)
                                        }
                                      >
                                        <CloseIcon sx={{ color: 'black' }} />
                                      </Button>
                                    </div>
                                    <Calendar
                                      className="w-full max-w-2xl mx-auto"
                                      mode="single"
                                      selected={
                                        dateValue ? dateValue : undefined
                                      }
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
                            Телефон номер
                          </Label>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Введите номер"
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
                          Фото/скан паспорта
                        </Label>
                        <FormControl>
                          <Input
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              field.onChange(file);
                            }}
                            type="file"
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
                            Drag or select file
                          </p>
                          <p className="text-[#646465] text-sm text-center">
                            Drop files here or click to{' '}
                            <span className="underline text-[#084FE3]">
                              browse
                            </span>{' '}
                            through your machine.
                          </p>
                        </label>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {passportValue && (
                    <div className="w-full flex items-center max-lg:flex-col max-lg:gap-4 max-lg:items-start justify-between p-3 border-2 border-[#EDEEF1] rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="relative w-[50px] h-[50px] cursor-pointer">
                          <Image
                            src={
                              typeof passportValue === 'string'
                                ? passportValue
                                : URL.createObjectURL(passportValue as File)
                            }
                            alt="passport"
                            fill
                            className="object-contain rounded-md"
                          />
                        </div>
                        <div>
                          <div className="max-w-[100px] sm:max-w-[80%] truncate">
                            <h1 className="font-bold text-sm truncate">
                              {typeof passportValue === 'string'
                                ? passportValue
                                : (passportValue as File)?.name}
                            </h1>
                          </div>
                          {typeof passportValue !== 'string' && (
                            <p className="text-xs text-[#718096]">
                              {((passportValue?.size || 0) / 1024).toFixed(1)}{' '}
                              KB
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 max-sm:flex-col max-sm:items-start max-sm:w-full">
                        <button
                          type="button"
                          onClick={() => form.setValue(`passport`, null)}
                          className="p-2 flex gap-4 rounded-full bg-red-500 text-white max-sm:w-full max-sm:justify-center"
                        >
                          <TrashIcon />
                          <p className="sm:hidden">Удалить</p>
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-2 bg-[#084FE3] text-white px-3 py-2 rounded-full max-sm:w-full max-sm:justify-center"
                          onClick={() => {
                            setPreviewFile(passportValue as File);
                            setPreviewOpen(true);
                          }}
                        >
                          <UserIcon />
                          Посмотреть
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 max-lg:grid max-lg:grid-cols-2 mt-5 sticky bottom-0">
                  <button
                    type="button"
                    onClick={() => setAdded(false)}
                    className="bg-[#FFFFFF] border shadow-nonde border-[#DFDFDF] text-[#031753] hover:bg-[#FFFFFF] px-14 py-3 max-lg:px-0 rounded-full cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    onClick={form.handleSubmit(onSubmit)}
                    className="bg-[#1764FC] border shadow-nonde text-white border-[#DFDFDF] hover:bg-[#1764FC] px-14 py-3 max-lg:px-0 rounded-full cursor-pointer"
                  >
                    Сохранить
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
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <div className="flex w-full justify-between">
                <p className="text-xl font-semibold text-[#212122]">
                  Мои попутчики
                </p>
                <Button
                  variant={'outline'}
                  className="!px-6 !py-5 rounded-full border border-[#DFDFDF]"
                  onClick={() => setAdded(true)}
                >
                  <AddIcon sx={{ width: 24, height: 24, color: '#031753' }} />
                  <p className="text-[#031753] text-md max-lg:hidden">
                    Добавить попутчика
                  </p>
                </Button>
              </div>

              <hr className="h-[2px] bg-[#EDEEF1] mt-5" />

              {dataTraveler.length === 0 ? (
                <div className="w-full h-[400px] flex flex-col gap-2 justify-center items-center">
                  <Image src={Badge} alt="badge" width={100} height={100} />
                  <p className="text-2xl font-semibold text-[#212122] mt-2">
                    Пока нет попутчиков
                  </p>
                  <p className="w-[40%] text-center text-[#646465] max-lg:w-full">
                    Добавьте своего первого попутчика, чтобы вместе планировать
                    поездки и делиться впечатлениями.
                  </p>
                </div>
              ) : (
                <div className="mt-5">
                  {dataTraveler.map((e, index) => (
                    <div
                      key={index}
                      className="w-full bg-[#EDEEF140] p-2 border border-[#EDEEF1] rounded-2xl mt-4 flex justify-between items-center max-lg:flex-col max-lg:items-start gap-4"
                    >
                      <div className="flex gap-2 items-center">
                        <Avatar className="w-14 h-14 rounded-lg">
                          <AvatarFallback className="w-14 h-14 rounded-lg">
                            {e.firstName[0]}
                            {e.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-lg text-[#050B08] font-semibold">
                            {e.firstName} {e.lastName}
                          </p>
                          <p className="text-md text-[#646465] font-medium">
                            {e.gender === 'male' ? 'Мужчина' : 'Женщина'}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="!px-2.5 !py-5 rounded-full border bg-[#E03137] hover:bg-[#E03137]"
                        >
                          <DeleteIcon
                            sx={{ width: 24, height: 24, color: '#FFF' }}
                          />
                        </Button>
                        <Button
                          variant="outline"
                          className="!px-6 !py-5 rounded-full border border-[#DFDFDF]"
                        >
                          <EditIcon
                            sx={{ width: 24, height: 24, color: '#031753' }}
                          />
                          <p className="text-[#031753] text-md">Изменить</p>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TravelersTabs;
