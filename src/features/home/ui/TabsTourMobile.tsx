// import FilterToursMobile from '@/widgets/filter/ui/FilterToursMobile';

// interface Props {
//   active: 'tours' | 'hotel';
// }

// const TabsTourMobile = ({ active }: Props) => {
//   return <>{active === 'tours' && <FilterToursMobile />}</>;
// };

// export default TabsTourMobile;

import FilterToursMobile from '@/widgets/filter/ui/FilterToursMobile';
import { useState } from 'react';

interface Props {
  active: 'tours' | 'hotel';
}

const TabsTourMobile = ({ active }: Props) => {
  const [selectedDestinations, setSelectedDestinations] = useState<string | null>(null);
  const [hotelRating, setHotelRating] = useState<string | null>(null);
  const [mealPlan, setMealPlan] = useState<string | null>(null);
  const [selectedDurations, setSelectedDurations] = useState<string | null>(null);
  const [selectedDefaulDestination, setSelectedDefaulDestination] = useState<string | null>(null);

  return (
    <>
      {active === 'tours' && (
        <FilterToursMobile
          selectedDestRegions={selectedDestinations}
          setSelectedDestRegions={setSelectedDestinations}
          setSelectedDefaulDestination={setSelectedDefaulDestination}
          setHotelRating={setHotelRating}
          setSelectedDurations={setSelectedDurations}
          setMealPlan={setMealPlan}
        />
      )}
    </>
  );
};

export default TabsTourMobile;
