import PoolIcon from '@mui/icons-material/Pool';
import SpaIcon from '@mui/icons-material/Spa';
import { Laugh, PartyPopper, Plane, Umbrella, Wifi } from 'lucide-react';
import { JSX } from 'react';

type TtourAdditionalInfo = {
  name: string;
  icon: JSX.Element;
};

const tourAdditionalInfo: TtourAdditionalInfo[] = [
  {
    name: 'Wi-Fi в общественных местах (бесплатно)',
    icon: <Wifi width={32} height={32} />,
  },
  {
    name: 'Не дальше 50 км от аэропорта',
    icon: <Plane />,
  },
  {
    name: 'Детский клуб',
    icon: <Laugh />,
  },
  {
    name: 'Песчаный пляж',
    icon: <Umbrella />,
  },
  {
    name: 'Анимация',
    icon: <PartyPopper />,
  },
  {
    name: 'SPA-центр',
    icon: <SpaIcon />,
  },
  {
    name: 'Открытый бассейн',
    icon: <PoolIcon />,
  },
];

const star = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.0001 14.8083L15.1501 17.9167L13.7834 12.0583L18.3334 8.11668L12.3417 7.60834L10.0001 2.08334L7.65841 7.60834L1.66675 8.11668L6.21675 12.0583L4.85008 17.9167L10.0001 14.8083Z"
      fill="#F08125"
    />
  </svg>
);

const gap_star = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.0001 14.8083L15.1501 17.9167L13.7834 12.0583L18.3334 8.11668L12.3417 7.60834L10.0001 2.08334L7.65841 7.60834L1.66675 8.11668L6.21675 12.0583L4.85008 17.9167L10.0001 14.8083Z"
      fill="#909091"
    />
  </svg>
);

export { gap_star, star, tourAdditionalInfo };
