import Hotel1 from '../../../../public/images/hotel1.png';
import Hotel2 from '../../../../public/images/hotel2.png';
import Hotel3 from '../../../../public/images/hotel3.png';
import Hotel4 from '../../../../public/images/hotel4.png';
import TourFood1 from '../../../../public/images/TourFood1.png';

export interface IHotel {
  title: string;
  name: string;
  icon: string;
}

export interface IFood {
  image: string;
  name: string;
  title: string;
}

export interface ITourAdditionalInfo {
  name: string;
  icon: string;
}

export const foodInfo: IFood[] = [
  {
    image: TourFood1.src,
    name: 'Завтраки',
    title: 'Свежая выпечка, джемы и фрукты для лёгкого утра',
  },
  {
    image: TourFood1.src,
    name: 'Салаты и закуски',
    title: 'Свежие овощи и лёгкие закуски для любого вкуса',
  },
  {
    image: TourFood1.src,
    name: 'Горячие блюда',
    title: 'Традиционная кухня и интернациональное меню каждый день новое',
  },
  {
    image: TourFood1.src,
    name: 'Гриль и мясо',
    title: 'Шашлыки, кебабы и блюда на гриле для настоящих гурманов',
  },
  {
    image: TourFood1.src,
    name: 'Десерты',
    title: 'Восточные сладости, торты и свежие фрукты',
  },
  {
    image: TourFood1.src,
    name: 'Напитки',
    title: 'Чай, кофе, свежевыжатые соки и местные вина',
  },
  {
    image: TourFood1.src,
    name: 'Напитки',
    title: 'Чай, кофе, свежевыжатые соки и местные вина',
  },
  {
    image: TourFood1.src,
    name: 'Напитки',
    title: 'Чай, кофе, свежевыжатые соки и местные вина',
  },
  {
    image: TourFood1.src,
    name: 'Напитки',
    title: 'Чай, кофе, свежевыжатые соки и местные вина',
  },
  {
    image: TourFood1.src,
    name: 'Напитки',
    title: 'Чай, кофе, свежевыжатые соки и местные вина',
  },
  {
    image: TourFood1.src,
    name: 'Напитки',
    title: 'Чай, кофе, свежевыжатые соки и местные вина',
  },
  {
    image: TourFood1.src,
    name: 'Напитки',
    title: 'Чай, кофе, свежевыжатые соки и местные вина',
  },
  {
    image: TourFood1.src,
    name: 'Напитки',
    title: 'Чай, кофе, свежевыжатые соки и местные вина',
  },
  {
    image: TourFood1.src,
    name: 'Напитки',
    title: 'Чай, кофе, свежевыжатые соки и местные вина',
  },
  {
    image: TourFood1.src,
    name: 'Напитки',
    title: 'Чай, кофе, свежевыжатые соки и местные вина',
  },
  {
    image: TourFood1.src,
    name: 'Напитки',
    title: 'Чай, кофе, свежевыжатые соки и местные вина',
  },
  {
    image: TourFood1.src,
    name: 'Напитки',
    title: 'Чай, кофе, свежевыжатые соки и местные вина',
  },
  {
    image: TourFood1.src,
    name: 'Напитки',
    title: 'Чай, кофе, свежевыжатые соки и местные вина',
  },
  {
    image: TourFood1.src,
    name: 'Напитки',
    title: 'Чай, кофе, свежевыжатые соки и местные вина',
  },
];

export const hotelAdditionalInfo: IHotel[] = [
  { title: 'Тип', name: 'Отели', icon: Hotel1.src },
  { title: 'Продолжительность', name: '8 дня', icon: Hotel2.src },
  { title: 'Размер группы', name: '50 человек', icon: Hotel3.src },
  { title: 'Языки', name: 'Английский, Испанский', icon: Hotel4.src },
];

export interface ToursDetail {
  status: boolean;
  data: ToursDetailData;
}

export interface ToursDetailData {
  id: number;
  title: string;
  price: number;
  departure_date: string;
  departure: string;
  destination: string;
  languages: string;
  passenger_count: number;
  rating: number;
  hotel_info: string;
  duration_days: number;
  hotel_meals: string;
  ticket_images: [
    {
      image: string;
    },
  ];
  allow_comment: boolean;
  ticket_amenities: [{ icon_name: string; name: string }];
  ticket_included_services: [
    {
      image: string;
      title: string;
      desc: string;
    },
  ];
  ticket_itinerary: [
    {
      title: string;
      duration: number;
      ticket_itinerary_image: [
        {
          image: string;
        },
      ];
      ticket_itinerary_destinations: [
        {
          name: string;
        },
      ];
    },
  ];
  ticket_hotel_meals: [
    {
      image: string;
      name: string;
      desc: string;
    },
  ];
  travel_agency_id: string;
  ticket_comments: [
    {
      user: {
        id: number;
        username: string;
      };
      text: string;
      rating: number;
    },
  ];
  tariff: [
    {
      name: string;
    },
  ];
  is_liked: boolean;
  ticket_hotel: [
    {
      id: number;
      name: string;
      meal_plan: 'full_board' | 'breakfast' | 'all_inclusive' | 'half_board';
      rating: number;
    },
  ];
}
