import { z } from 'zod';

const sendHelp = z.object({
  name: z.string().min(2, {
    message: "Eng kamida 2ta harf bo'lishi kerak",
  }),
  phone: z.string().min(5, {
    message: 'Telefon raqam xato',
  }),
});

export default sendHelp;
