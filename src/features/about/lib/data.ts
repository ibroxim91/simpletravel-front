// src/data/cardData.ts
import DoneAllIcon from '@mui/icons-material/DoneAll';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';

import { ComponentType } from 'react';

export interface CardItem {
  icon: ComponentType<{ sx?: object }>;
  color: string;
  title: string;
  text: string;
}

export const CardData: CardItem[] = [
  {
    icon: DoneAllIcon,
    color: '#084FE3',
    title: 'Максимальная гибкость',
    text: 'Вы выбираете — мы адаптируем',
  },
  {
    icon: StarIcon,
    color: '#F08125',
    title: 'Уникальные впечатления',
    text: 'От альпийских вершин',
  },
  {
    icon: FavoriteIcon,
    color: '#E03137',
    title: 'Полный комфорт',
    text: 'Мы берём на себя',
  },
];
