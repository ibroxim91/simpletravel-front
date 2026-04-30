'use client';

import TourOffersSection from './TourOffersSection';

const VisaTours = () => {
  return (
    <TourOffersSection
      queryKey="home_tickets_visa"
      titleKey="Виза не нужна"
      subtitleKey="Путешествуйте без лишних хлопот"
      sectionClassName="bg-transparent pb-10 pt-0"
      cardsStart={4}
      cardsEnd={8}
    />
  );
};

export default VisaTours;
