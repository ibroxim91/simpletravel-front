// lib/formatPrice.ts
import { LanguageRoutes } from '../config/i18n/types';

export const formatPrice = (
  amount: number | string,
  locale?: LanguageRoutes,
  withLabel = false,
) => {
  const numericAmount = Number(amount) || 0;

  let formatted = "";
  let label = "";

  // Agar milliondan katta bo‘lsa → qisqartiramiz
  if (numericAmount >= 1_000_000) {
    const mlnValue = numericAmount / 1_000_000;

    formatted = mlnValue % 1 === 0
      ? mlnValue.toString()
      : mlnValue.toFixed(1);

    label = withLabel
      ? locale === LanguageRoutes.RU
        ? " млн сум"
        : " mln so'm"
      : "";
  } else {
    // Oddiy formatlash (minglarda)
    formatted = numericAmount.toString();
    label = withLabel
      ? locale === LanguageRoutes.RU
        ? " сум"
        : " so'm"
      : "";
  }

  // Vergul bilan ko‘rsatish (7.2 → 7,2)
  return formatted.replace(".", ",") + label;
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
