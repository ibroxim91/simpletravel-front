// lib/formatPrice.ts
import { LanguageRoutes } from '../config/i18n/types';

export const formatPrice = (
  amount: number | string,
  locale?: LanguageRoutes,
  withLabel = false,
) => {
  const label = withLabel
    ? locale === LanguageRoutes.RU
      ? ' сум'
      : locale === LanguageRoutes.UZ
        ? ' сўм'
        : " so'm"
    : '';

  const numericAmount = Number(amount) || 0;
  const formatted = numericAmount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return formatted + label;
};
