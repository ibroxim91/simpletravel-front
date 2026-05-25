// src/data/cardData.ts
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PublicIcon from '@mui/icons-material/Public';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CardTravelIcon from '@mui/icons-material/CardTravel';

import { ComponentType } from 'react';

export interface CardItem {
  icon: ComponentType<{ sx?: object }>;
  color: string;
  title: string;
  text: string;
}

export const CardData: CardItem[] = [
  {
    icon: AttachMoneyIcon,
    color: '#2E7D32',
    title: 'To‘g‘ridan to‘g‘ri narxlar',
    text: 'Oraliq vositachilarsiz eng yaxshi narxlar',
  },
  {
    icon: PublicIcon,
    color: '#0288D1',
    title: 'Ko‘plab yo‘nalishlar tanlovi',
    text: 'Dunyo bo‘ylab keng tanlov',
  },
  {
    icon: EventAvailableIcon,
    color: '#F57C00',
    title: 'Qulay onlayn bron qilish',
    text: 'Onlayn tez va oson bron',
  },
  {
    icon: SupportAgentIcon,
    color: '#C2185B',
    title: 'Ishonchli xizmat va qo‘llab-quvvatlash',
    text: '24/7 xizmat va yordam',
  },
  {
    icon: CardTravelIcon,
    color: '#6A1B9A',
    title: 'Sizga mos sayohat variantlari',
    text: 'Sizga moslashtirilgan sayohatlar paketlari mavjud',
  },
];
