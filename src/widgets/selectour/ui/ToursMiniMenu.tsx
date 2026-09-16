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
  hotelRating: string | null;
  mealPlan: string | null;
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

  const starsActive = hotelRating === '4' || hotelRating === '5';
  const aiActive =
    Boolean(allInclusiveMealId) && mealPlan === allInclusiveMealId;
  const expensiveActive = expensive;
  const allActive = !starsActive && !aiActive && !expensiveActive;

  return (
    <div className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max items-center gap-3 pr-1">
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
          <PublicOutlinedIcon
            sx={{ fontSize: 20, color: allActive ? '#fff' : '#1A73E8' }}
          />
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
            sx={{ fontSize: 20, color: starsActive ? '#fff' : '#F59E0B' }}
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
          <RestaurantOutlinedIcon
            sx={{ fontSize: 20, color: aiActive ? '#fff' : '#1A73E8' }}
          />
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
          <TrendingUpIcon
            sx={{ fontSize: 20, color: expensiveActive ? '#fff' : '#1A73E8' }}
          />
          {t('mini_filter_expensive')}
        </button>

        <button
          type="button"
          aria-label={t('Настройте свой отдых')}
          onClick={onOpenFilters}
          className={cn(
            chipBase,
            'border border-[rgba(17,34,17,0.25)] bg-white text-[#6B7280]',
          )}
        >
          <FilterListIcon sx={{ fontSize: 22, color: '#1A73E8' }} />
          <ExpandMoreIcon sx={{ fontSize: 24, color: '#6B7280' }} />
        </button>
      </div>
    </div>
  );
}
