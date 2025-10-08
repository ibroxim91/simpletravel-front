'use client';

import formatPhone from '@/shared/lib/formatPhone';
import onlyNumber from '@/shared/lib/onlyNember';
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
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import clsx from 'clsx';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { Auth_Api } from '../lib/api';
import { useLoginPhoneStore } from '../lib/store';

interface Props {
  setStep: Dispatch<SetStateAction<number>>;
}

const TwoStep = ({ setStep }: Props) => {
  const t = useTranslations();
  const { phone, email } = useLoginPhoneStore();
  const [time, setTime] = useState<number>(120);
  const [error, setError] = useState<boolean>(false);
  const [canResend, setCanResend] = useState<boolean>(false);

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
    otp: z.string().regex(/^\d{4}$/, "Kodni to'liq kiriting"), // faqat 4 raqam
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

  const { mutate: phoneMutate, isPending } = useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) => {
      return Auth_Api.confirmPhone({ phone, code });
    },
    onSuccess() {
      setStep(3);
    },
    onError(error: AxiosError<{ data: { detail: string } }>) {
      toast.error(t('Xatolik yuz berdi'), {
        icon: null,
        description: error.response?.data.data.detail,
        position: 'bottom-right',
      });
    },
  });

  const { mutate: resendOtpPhone } = useMutation({
    mutationFn: ({ phone }: { phone: string }) => {
      return Auth_Api.resendPhone({ phone });
    },
    onSuccess() {
      setTime(120);
      setCanResend(false);
      toast.success(t("Sms qayta jo'natildi"), {
        icon: null,
        position: 'bottom-right',
      });
    },
    onError(error: AxiosError<{ non_field_errors: [string] }>) {
      toast.error(t('Xatolik yuz berdi'), {
        icon: null,
        description: error.response?.data.non_field_errors[0],
        position: 'bottom-right',
      });
    },
  });

  const { mutate: resendOtpEmail } = useMutation({
    mutationFn: ({ email }: { email: string }) => {
      return Auth_Api.resendEmail({ email });
    },
    onSuccess() {
      setTime(120);
      setCanResend(false);
      toast.success(t("Sms qayta jo'natildi"), {
        icon: null,
        position: 'bottom-right',
      });
    },
    onError(error: AxiosError<{ non_field_errors: [string] }>) {
      toast.error(t('Xatolik yuz berdi'), {
        icon: null,
        description: error.response?.data.non_field_errors[0],
        position: 'bottom-right',
      });
    },
  });

  const { mutate: emailMutate, isPending: emailPending } = useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => {
      return Auth_Api.confirmEmail({ email, code });
    },
    onSuccess() {
      setStep(3);
    },
    onError(error: AxiosError<{ data: { detail: string } }>) {
      toast.error(t('Xatolik yuz berdi'), {
        icon: null,
        description: error.response?.data.data.detail,
        position: 'bottom-right',
      });
    },
  });

  async function onSubmitPhone(values: z.infer<typeof confirmForm>) {
    if (phone !== undefined) {
      phoneMutate({
        code: values.otp,
        phone: onlyNumber(phone),
      });
    } else if (email !== undefined) {
      emailMutate({
        code: values.otp,
        email,
      });
    }
  }

  const handleResend = () => {
    if (phone !== undefined) {
      resendOtpPhone({
        phone: onlyNumber(phone),
      });
    } else if (email !== undefined) {
      resendOtpEmail({
        email,
      });
    }
  };

  return (
    <div className="w-[50%] bg-white rounded-3xl h-fit py-5 px-10 absolute bottom-0 top-52 max-md:px-2 max-sm:top-16 max-lg:w-[90%] left-1/2 -translate-x-1/2">
      <p className="text-xl font-semibold">{t('Код аутентификации')}</p>
      <p className="mt-4 text-lg w-[70%] max-lg:w-full max-[340px]:break-words">
        {t('Введите 5-значный код, который мы только что отправили на')}{' '}
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
                    maxLength={4}
                    pattern={REGEXP_ONLY_DIGITS}
                    {...field}
                  >
                    <InputOTPGroup className="flex gap-2">
                      {[0, 1, 2, 3].map((i) => (
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
              {t('Отправить код повторно')}
            </button>
          ) : (
            <p className="text-[#646465]">
              {t('Прислать код повторно через')}{' '}
              {String(Math.floor(time / 60)).padStart(2, '0')}:
              {String(time % 60).padStart(2, '0')}
            </p>
          )}

          <Button
            type="submit"
            className="w-full py-8 text-lg bg-[#1764FC] hover:bg-[#1764FC] rounded-full cursor-pointer"
            disabled={phoneForm.watch('otp').length !== 4 || isPending}
          >
            {isPending || emailPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              t('Подтвердить')
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TwoStep;
