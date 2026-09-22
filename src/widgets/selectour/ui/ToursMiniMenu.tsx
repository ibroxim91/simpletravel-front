'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterListIcon from '@mui/icons-material/FilterList';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import RestaurantOutlinedIcon from '@mui/icons-material/RestaurantOutlined';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useTranslations } from 'next-intl';
import { cn } from '@/shared/lib/utils';

type Props = {
  hotelRating: string[];
  mealPlan: string[];
  expensive: boolean;
  allInclusiveMealId: string | null;
  onAll: () => void;
  onStars: () => void;
  onAllInclusive: () => void;
  onExpensive: () => void;
  onOpenFilters: () => void;
};

const chipBase =
  'inline-flex h-9 shrink-0 items-center justify-center gap-1 rounded-full px-3 text-sm font-semibold whitespace-nowrap transition-colors';

export default function ToursMiniMenu({
  hotelRating,
  mealPlan,
  expensive,
  allInclusiveMealId,
  onAll,
  onStars,
  onAllInclusive,
  onExpensive,
  onOpenFilters,
}: Props) {
  const t = useTranslations();

  const starsActive = hotelRating.includes('4') || hotelRating.includes('5');
  const aiActive = Boolean(
    allInclusiveMealId && mealPlan.includes(allInclusiveMealId),
  );
  const expensiveActive = expensive;
  const allActive = !starsActive && !aiActive && !expensiveActive;

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scrollbar-none">
      <button
        type="button"
        onClick={onAll}
        className={cn(
          chipBase,
          allActive
            ? 'bg-[#1A73E8] text-white'
            : 'border border-[rgba(17,34,17,0.25)] bg-white text-[#6B7280]',
        )}
      >
        <PublicOutlinedIcon sx={{ fontSize: 18 }} />
        {t('mini_filter_all')}
      </button>

      <button
        type="button"
        onClick={onStars}
        className={cn(
          chipBase,
          starsActive
            ? 'bg-[#1A73E8] text-white'
            : 'border border-[rgba(17,34,17,0.25)] bg-white text-[#6B7280]',
        )}
      >
        <StarRoundedIcon
          sx={{ fontSize: 18, color: starsActive ? '#fff' : '#F59E0B' }}
        />
        {t('mini_filter_stars')}
      </button>

      <button
        type="button"
        onClick={onAllInclusive}
        className={cn(
          chipBase,
          aiActive
            ? 'bg-[#1A73E8] text-white'
            : 'border border-[rgba(17,34,17,0.25)] bg-white text-[#6B7280]',
        )}
      >
        <RestaurantOutlinedIcon sx={{ fontSize: 18 }} />
        {t('mini_filter_ai')}
      </button>

      <button
        type="button"
        onClick={onExpensive}
        className={cn(
          chipBase,
          expensiveActive
            ? 'bg-[#1A73E8] text-white'
            : 'border border-[rgba(17,34,17,0.25)] bg-white text-[#6B7280]',
        )}
      >
        <TrendingUpIcon sx={{ fontSize: 18 }} />
        {t('mini_filter_expensive')}
      </button>

      <button
        type="button"
        onClick={onOpenFilters}
        className={cn(
          chipBase,
          'border border-[rgba(17,34,17,0.25)] bg-white text-[#6B7280]',
        )}
        aria-label={t('Настройте свой отдых')}
      >
        <FilterListIcon sx={{ fontSize: 18, color: '#1A73E8' }} />
        <ExpandMoreIcon sx={{ fontSize: 18 }} />
      </button>
    </div>
  );
}
