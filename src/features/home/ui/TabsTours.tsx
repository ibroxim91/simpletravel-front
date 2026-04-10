import FilterTours from '@/widgets/filter/ui/FilterTours';
import { useState } from 'react';

interface Props {
  active: 'tours' | 'hotel';
}

const TabsTours = ({ active }: Props) => {
  const [selectedDestinations, setSelectedDestinations] = useState<string | null>(null);
  const [hotelRating, setHotelRating] = useState<string | null>(null);
  const [mealPlan, setMealPlan] = useState<string | null>(null);
  const [selectedDurations, setSelectedDurations] = useState<string | null>(null);

  return (
    <>
      {active === 'tours' && (
        <FilterTours
          selectedDestRegions={selectedDestinations}
          setSelectedDestRegions={setSelectedDestinations}
          setHotelRating={setHotelRating}
          setSelectedDurations={setSelectedDurations}
          setMealPlan={setMealPlan}
        />
      )}
    </>
  );
};

// const TabsTours = ({ active }: Props) => {
//   return <>{active === 'tours' && <FilterTours />}</>;
// };

export default TabsTours;
