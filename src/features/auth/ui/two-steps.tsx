'use client';

import formatPhone from '@/shared/lib/formatPhone';
import { Button } from '@/shared/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/shared/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { LoaderCircle } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useLoginPhoneStore } from '../lib/store';

interface Props {
  setStep: Dispatch<SetStateAction<number>>;
}

const TwoStep = ({ setStep }: Props) => {
  const { phone, email } = useLoginPhoneStore();
  const [time, setTime] = useState<number>(30);
  const [error, setError] = useState<boolean>(false);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCanResend(true);
    }
  }, [time]);

  const confirmForm = z.object({
    otp: z.string().regex(/^\d{5}$/, "Kodni to'liq kiriting"), // faqat 5 raqam
  });

  const phoneForm = useForm<z.infer<typeof confirmForm>>({
    resolver: zodResolver(confirmForm),
    defaultValues: {
      otp: '',
    },
  });

  const otpValue = phoneForm.watch('otp');

  useEffect(() => {
    if (error && otpValue.length > 0) {
      setError(false);
    }
  }, [otpValue, error]);

  async function onSubmitPhone() {
    setLoading(true);
    setError(false);
    try {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve('ok');
        }, 2000);
      });
      setError(false);
      setLoading(false);
      setStep(3);
    } catch {
      setLoading(false);
      setError(true);
      toast.error('Слишком много попыток.', {
        icon: null,
        description:
          'Вы ввели неверные данные 5 раз. Доступ заблокирован на 30 минут.',
        position: 'bottom-right',
      });
    }
  }

  const handleResend = () => {
    setTime(30);
    setCanResend(false);
  };

  return (
    <div className="w-[50%] bg-white rounded-3xl h-fit py-5 px-10 absolute bottom-0 top-52 max-md:px-2 max-sm:top-16 max-lg:w-[90%] left-1/2 -translate-x-1/2">
      <p className="text-xl font-semibold">Код аутентификации</p>
      <p className="mt-4 text-lg w-[70%] max-lg:w-full max-[340px]:break-words">
        Введите 5-значный код, который мы только что отправили на{' '}
        {phone ? (
          <span className="text-[#3E7FFF]">{formatPhone(phone)}</span>
        ) : (
          email && <span className="text-[#3E7FFF]">{email}</span>
        )}
      </p>
      <Form {...phoneForm}>
        <form
          onSubmit={phoneForm.handleSubmit(onSubmitPhone)}
          className="space-y-8 mt-10"
        >
          <FormField
            control={phoneForm.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <InputOTP
                    maxLength={5}
                    pattern={REGEXP_ONLY_DIGITS}
                    {...field}
                  >
                    <InputOTPGroup className="flex gap-2">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className={clsx(
                            'border rounded-lg w-14 h-14 data-[active=true]:border-[#084FE3] data-[active=true]:ring-0 max-[330px]:w-10 max-[330px]:h-10',
                            error && 'border-[#E03137]',
                          )}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              className="text-[#1764FC] underline"
            >
              Отправить код повторно
            </button>
          ) : (
            <p className="text-[#646465]">
              Прислать код повторно через 00:
              {time.toString().padStart(2, '0')}
            </p>
          )}

          <Button
            type="submit"
            className="w-full py-8 text-lg bg-[#1764FC] hover:bg-[#1764FC] rounded-full cursor-pointer"
            disabled={phoneForm.watch('otp').length !== 5 || loading}
          >
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              'Подтвердить'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TwoStep;
