// lib/formatPrice.ts
import { LanguageRoutes } from '../config/i18n/types';

export const formatPrice = (
  amount: number | string,
  locale?: LanguageRoutes,
  withLabel = false,
) => {
  const numericAmount = Number(amount) || 0;

  // label tilga qarab
  const label = withLabel
    ? locale === LanguageRoutes.RU
      ? ' млн сум'
      : locale === LanguageRoutes.UZ
        ? " mln so'm"
        : " mln so'm"
    : '';

  // butun yoki kasr qismini chiqarish
  const formatted =
    numericAmount % 1 === 0
      ? numericAmount.toString()
      : numericAmount.toFixed(1);

  // vergul bilan ko‘rsatish (7.2 → 7,2)
  return formatted.replace('.', ',') + label;
};

// export const formatPrice = (
//   amount: number | string,
//   locale?: LanguageRoutes,
//   withLabel = false,
// ) => {
//   const label = withLabel
//     ? locale === LanguageRoutes.RU
//       ? ' сум'
//       : locale === LanguageRoutes.UZ
//         ? " so'm"
//         : " so'm"
//     : '';

//   const numericAmount = Number(amount) || 0;
//   const formatted = numericAmount
//     .toString()
//     .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

//   return formatted + label;
// };
