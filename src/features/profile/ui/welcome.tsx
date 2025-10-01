'use client';

import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { welcomeForm } from '../lib/form';
import { useWelcomeStore } from '../lib/hook';

const Welcome = () => {
  const { openModal: open, setOpenModal: setOpen } = useWelcomeStore();

  const form = useForm<z.infer<typeof welcomeForm>>({
    resolver: zodResolver(welcomeForm),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });
  const isMobile = useMediaQuery('(max-width:1024px)');

  function onSubmit() {
    setOpen(false);
  }
  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <Label className="text-xl font-semibold text-[#212122]">
                Имя
              </Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Введите имя"
                  className="h-[60px] px-4 font-medium !text-lg rounded-xl text-black"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <Label className="text-xl font-semibold text-[#212122]">
                Фамилия
              </Label>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Введите фамилию"
                  className="h-[60px] px-4 font-medium !text-lg rounded-xl text-black max-lg:w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="px-14 py-8 rounded-4xl text-lg font-medium cursor-pointer bg-[#1764FC] hover:bg-[#1764FC] max-lg:w-full max-lg:mt-10"
        >
          Сохранить
        </Button>
      </form>
    </Form>
  );

  return (
    <>
      {!isMobile ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="rounded-4xl !max-w-3xl">
            <DialogHeader>
              <DialogTitle
                className={clsx('flex justify-between w-full items-center')}
              >
                <div className="flex flex-col gap-4">
                  <p className="text-2xl">Давайте познакомимся!</p>
                  <p className="w-[80%] text-[#646465] font-medium">
                    Чтобы завершить регистрацию, пожалуйста, укажите ваше имя
                  </p>
                </div>
                <DialogClose asChild>
                  <Button
                    variant={'outline'}
                    disabled
                    className="rounded-full p-6 h-12 w-12 cursor-pointer"
                  >
                    <CloseIcon sx={{ width: 26, height: 26 }} />
                  </Button>
                </DialogClose>
              </DialogTitle>
              <DialogDescription className="flex flex-col justify-center items-center gap-8 mt-5">
                {formContent}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer
          anchor="bottom"
          open={open}
          onClose={() => setOpen(false)}
          PaperProps={{
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              width: '100vw',
              height: 'auto',
              display: 'flex',
              flexDirection: 'column',
              p: 2,
            },
          }}
        >
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-3xl font-semibold">Давайте познакомимся!</p>
              <p className="w-[80%] text-[#646465] font-medium">
                Чтобы завершить регистрацию, пожалуйста, укажите ваше имя
              </p>
            </div>
            <Button
              variant={'outline'}
              disabled
              className="rounded-full p-6 h-12 w-12 cursor-pointer"
            >
              <CloseIcon sx={{ width: 26, height: 26 }} />
            </Button>
          </div>
          <div className="mt-5">{formContent}</div>
        </Drawer>
      )}
    </>
  );
};

export default Welcome;
