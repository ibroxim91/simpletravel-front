import loaderAnimation from '@/assets/lottie/Travel.json';
import { useRouter } from '@/shared/config/i18n/navigation';
import { Button } from '@/shared/ui/button';
import { CardContent } from '@/shared/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import { Player } from '@lottiefiles/react-lottie-player';
import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import Drawer from '@mui/material/Drawer';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';
import formStore from '../lib/hook';

interface Props {
  onClose: () => void;
  setError: Dispatch<SetStateAction<string | null>>;
  setSuccess: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  success: boolean;
  error: string | null;
  open: boolean;
  openDrawer: boolean;
  setOpenDrawer: Dispatch<SetStateAction<boolean>>;
}

export default function PaidModal({
  onClose,
  error,
  loading,
  success,
  setSuccess,
  setError,
  openDrawer,
  setOpenDrawer,
  open,
}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const { reset } = formStore();

  return (
    <>
      <CardContent className="grid-cols-2 grid w-full h-full max-lg:grid-cols-1 mb-5">
        <Dialog
          open={open}
          onOpenChange={() => {
            if (!loading) {
              onClose();
              reset();
            }
          }}
        >
          <DialogContent
            showCloseButton={false}
            className="rounded-4xl !max-w-4xl"
          >
            <DialogHeader>
              <DialogTitle
                className={clsx(
                  'flex justify-between w-full items-center',
                  error && 'justify-center',
                  success && 'justify-center',
                )}
              >
                {loading && <p className="text-3xl">{t('Отправка')}...</p>}

                {success && (
                  <Button
                    color="#38DA2A"
                    className="bg-[#38DA2A] h-14 w-14 mt-5 rounded-2xl hover:bg-[#38DA2A]"
                  >
                    <DoneIcon sx={{ width: '38px', height: '38px' }} />
                  </Button>
                )}

                {error && (
                  <Button
                    color="#E03137"
                    className="bg-[#E03137] h-14 w-14 rounded-2xl hover:bg-[#E03137]"
                  >
                    <CloseIcon sx={{ width: 32, height: 32 }} />
                  </Button>
                )}

                {!loading && !success && !error && (
                  <>
                    <p className="text-3xl">{t('Оплата')}</p>
                    <DialogClose asChild>
                      <Button
                        variant={'outline'}
                        onClick={() => {
                          setSuccess(false);
                        }}
                        className="rounded-full p-6 h-12 w-12"
                      >
                        <CloseIcon sx={{ width: 26, height: 26 }} />
                      </Button>
                    </DialogClose>
                  </>
                )}
              </DialogTitle>

              <DialogDescription className="flex flex-col justify-center items-center gap-8">
                {loading && (
                  <div className="flex justify-center items-center mt-10">
                    <Player
                      autoplay
                      loop
                      src={loaderAnimation}
                      style={{ height: '240px', width: '240px' }}
                    />
                  </div>
                )}

                {success && (
                  <div className="text-center flex flex-col gap-4 px-4 justify-center">
                    <p className="text-2xl mt-5 text-[#212122] font-semibold">
                      {t('Оплата прошла успешно!')}
                    </p>
                    <p className="text-[#646465] font-medium text-lg">
                      {t('Эксперт свяжется с вами в ближайшее время по номеру')}{' '}
                      +998 93 222 29 22, {t('позвонив на него')}
                    </p>
                    <div className="flex mt-4 justify-center gap-4">
                      <Button
                        variant={'default'}
                        className="rounded-3xl border-2 border-[#DFDFDF] bg-white text-[#031753] px-10 font-semibold cursor-pointer hover:bg-white py-4 h-fit w-fit"
                        onClick={() => {
                          setSuccess(false);
                          onClose();
                          reset();
                          router.push('/');
                        }}
                      >
                        {t('На главную')}
                      </Button>
                      <Button
                        variant={'default'}
                        className="rounded-3xl bg-[#1764FC] px-10 font-semibold cursor-pointer py-4 h-fit w-fit"
                        onClick={() => {
                          setSuccess(false);
                          onClose();
                          reset();
                          router.push('/profile?tabs=reservations');
                        }}
                      >
                        {t('Мои брони')}
                      </Button>
                    </div>
                  </div>
                )}

                {error && !loading && !success && (
                  <div className="flex flex-col items-center text-center gap-6 mt-6">
                    <p className="text-xl font-semibold text-[#212122]">
                      {error}
                    </p>
                    <Button
                      variant="destructive"
                      className="rounded-3xl px-10 cursor-pointer py-4 h-fit w-fit font-semibold"
                      onClick={() => {
                        setSuccess(false);
                        onClose();
                        reset();
                        setError(null);
                      }}
                    >
                      {t('Попробовать снова')}
                    </Button>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>

      <Drawer
        anchor="bottom"
        open={openDrawer}
        sx={{
          bgcolor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(6px)',
        }}
        onClose={() => {
          if (!loading) {
            reset();
            setSuccess(false);
            setError(null);
            setOpenDrawer(false);
          }
        }}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            width: '100vw',
            height: '95vh',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {!success && !error && !loading && (
          <div className="flex justify-between items-center p-4">
            <p className="text-2xl font-semibold">{t('Оплата')}</p>
            <Button
              variant="outline"
              onClick={() => {
                setSuccess(false);
                setError(null);
                setOpenDrawer(false);
              }}
              className="rounded-full h-12 w-12"
            >
              <CloseIcon sx={{ width: 26, height: 26 }} />
            </Button>
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {loading && (
            <div className="flex justify-center items-center h-full">
              <Player
                autoplay
                loop
                src={loaderAnimation}
                style={{ height: '240px', width: '240px' }}
              />
            </div>
          )}
          {success && !loading && (
            <div className="flex flex-col items-center justify-center gap-4 h-full px-4 text-center">
              <Button
                color="#38DA2A"
                className="bg-[#38DA2A] h-14 w-14 mt-5 rounded-2xl hover:bg-[#38DA2A]"
              >
                <DoneIcon sx={{ width: '38px', height: '38px' }} />
              </Button>
              <p className="text-2xl mt-5 text-[#212122]">
                {t('Заявка успешно отправлено')}
              </p>
              <p className="text-[#646465] font-medium text-md">
                {t('Эксперт свяжется с вами в ближайшее время по номеру')} +998
                88 007 78 03 {t('позвонив на него')}
              </p>
              <div className="grid grid-cols-2 w-full mt-4 gap-4 absolute bottom-2 px-5">
                <Button
                  variant={'default'}
                  className="rounded-3xl border-2 border-[#DFDFDF] bg-white text-[#031753] px-10 font-semibold cursor-pointer hover:bg-white py-4 h-fit w-full"
                  onClick={() => {
                    setSuccess(false);
                    onClose();
                    reset();
                    router.push('/');
                  }}
                >
                  {t('На главную')}
                </Button>
                <Button
                  variant={'default'}
                  className="rounded-3xl bg-[#1764FC] px-10 font-semibold cursor-pointer py-4 h-fit w-full"
                  onClick={() => {
                    setSuccess(false);
                    onClose();
                    reset();
                    router.push('/profile?tabs=reservations');
                  }}
                >
                  {t('Мои брони')}
                </Button>
              </div>
            </div>
          )}
          {error && !loading && !success && (
            <div className="flex flex-col items-center justify-center gap-4 h-full px-4 text-center">
              <Button
                color="#E03137"
                className="bg-[#E03137] h-14 w-14 rounded-2xl hover:bg-[#E03137]"
              >
                <CloseIcon sx={{ width: 32, height: 32 }} />
              </Button>
              <p className="text-2xl mt-5 text-[#212122]">
                {t('Произошла ошибка при отправке')}
              </p>
              <p className="text-xl font-semibold text-[#212122]">{error}</p>
              <Button
                variant="destructive"
                className="rounded-3xl px-10 absolute bottom-2 cursor-pointer py-4 h-fit w-[90%]"
                onClick={() => {
                  setSuccess(false);
                  setError(null);
                  setOpenDrawer(false);
                }}
              >
                {t('Попробовать снова')}
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}
