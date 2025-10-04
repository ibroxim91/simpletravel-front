import z from 'zod';

export const welcomeForm = z.object({
  firstName: z.string().min(1, { message: 'Majburiy maydon' }),
  lastName: z.string().min(1, { message: 'Majburiy maydon' }),
});

export const editUserName = z.object({
  firstName: z.string().min(1, { message: 'Majburiy maydon' }),
  lastName: z.string().min(1, { message: 'Majburiy maydon' }),
});

export const editUserPhone = z.object({
  phone: z.string().regex(/^\+?\d{9,15}$/, 'Введите корректный номер телефона'),
});

export const editUserEmail = z.object({
  emial: z.string().min(1, { message: 'Majburiy maydon' }),
});

export const ParticipantProfileSchema = z.object({
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
