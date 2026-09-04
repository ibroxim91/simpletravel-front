'use client';

import TourOffersSection from './TourOffersSection';

const VisaTours = () => {
  return (
    <TourOffersSection
      queryKey="home_offers_visa_free"
      titleKey="Виза не нужна"
      subtitleKey="Путешествуйте без лишних хлопот"
      sectionClassName="bg-transparent pb-10 pt-0"
      cardsStart={0}
      cardsEnd={4}
      offerMode="visa_free"
    />
  );
};

export default VisaTours;
