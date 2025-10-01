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
