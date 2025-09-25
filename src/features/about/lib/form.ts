import { z } from 'zod';

const senPartners = z.object({
  name: z.string().min(2, {
    message: "Eng kamida 2ta harf bo'lishi kerak",
  }),
  phone: z.string().min(5, {
    message: 'Telefon raqam xato',
  }),
  address: z.string().min(5, {
    message: "Eng kamida 5ta harf bo'lishi kerak",
  }),
  license: z.instanceof(File, { message: 'Fayl tanlanishi shart' }),
  email: z.string().min(5, {
    message: "Eng kamida 5ta harf bo'lishi kerak",
  }),
  website: z.string().min(1, {
    message: 'Majburiy maydon',
  }),
});

export default senPartners;
