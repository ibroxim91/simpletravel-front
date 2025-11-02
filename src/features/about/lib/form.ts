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
  license: z
    .union([z.instanceof(File), z.array(z.instanceof(File))])
    .refine((val) => (Array.isArray(val) ? val.length > 0 : !!val), {
      message: 'Fayl tanlanishi shart',
    }),
  email: z.string().min(5, {
    message: "Eng kamida 5ta harf bo'lishi kerak",
  }),
  website: z.string().min(1, {
    message: 'Majburiy maydon',
  }),
  instagram: z.string().optional(),
});

export default senPartners;
