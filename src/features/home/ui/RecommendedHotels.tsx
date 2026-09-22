'use client';

import TourOffersSection from './TourOffersSection';

const RecommendedHotels = () => {
  return (
    <TourOffersSection
      queryKey="home_offers_recommended"
      titleKey="recommended_hotels"
      subtitleKey="recommended_hotels_subtitle"
      sectionClassName="bg-transparent pb-10 pt-0"
      cardsStart={0}
      cardsEnd={16}
      isPopularDestination={false}
      offerMode="recommended"
    />
  );
};

export default RecommendedHotels;
