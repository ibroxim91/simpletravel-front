'use client';

import TourOffersSection from './TourOffersSection';

const HotTours = () => {
  return (
    <TourOffersSection
      queryKey="home_tickets"
      titleKey="Горящие туры: успейте забронировать!"
      subtitleKey="Лучшие направления по минимальным ценам"
      sectionClassName="bg-transparent pb-10 pt-0"
      cardsStart={0}
      cardsEnd={4}
    />
  );
};

export default HotTours;
