import z from 'zod';

export const TimesStepForm = z.object({
  where: z.string().min(1, 'Majburiy maydon'),
  whereTo: z.string().min(1, 'Majburiy maydon'),
  dispatch: z.date({
    required_error: 'Majburiy maydon',
    invalid_type_error: 'Yaroqsiz sana',
  }),
  returned: z.date({
    required_error: 'Majburiy maydon',
    invalid_type_error: 'Yaroqsiz sana',
  }),
});

export const ParticipantSchema = z.object({
  gender: z.enum(['male', 'female']),
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  date: z
    .date({ required_error: 'Дата обязательна' })
    .nullish()
    .refine((date) => date, { message: 'Дата обязательна' }),
  phone: z.string().regex(/^\+?\d{9,15}$/, 'Введите корректный номер телефона'),
  passport: z
    .instanceof(File)
    .nullish()
    .refine((date) => date, { message: 'Обязательное поле' }),
});

export const ParticipantsForm = z.object({
  participants: z.array(ParticipantSchema).min(1),
});

export const ServicesForm = z.object({
  excursions: z.string().min(1, { message: 'Обязательное поле' }),
  additional: z.string().min(1, { message: 'Обязательное поле' }),
});
