import Paasport from '@/assets/Kuba.jpg';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import { SvgIconProps } from '@mui/material/SvgIcon';
import {
  BriefcaseBusiness,
  CalendarIcon,
  CreditCard,
  Settings,
  UserIcon,
} from 'lucide-react';

export type TStep = {
  id: StepId;
  name: string;
  icon:
    | typeof CalendarIcon
    | typeof UserIcon
    | typeof BriefcaseBusiness
    | typeof Settings
    | typeof CreditCard;
};

export type StepId =
  | 'time'
  | 'participants'
  | 'package'
  | 'services'
  | 'payment';

const steps: TStep[] = [
  {
    id: 'time',
    name: 'Дата',
    icon: CalendarIcon,
  },
  {
    id: 'participants',
    name: 'Участники',
    icon: UserIcon,
  },
  {
    id: 'package',
    name: 'Турпакет',
    icon: BriefcaseBusiness,
  },
  {
    id: 'services',
    name: 'Услуги',
    icon: Settings,
  },
  {
    id: 'payment',
    name: 'Оплата',
    icon: CreditCard,
  },
];

export type ComfortLevel = 'comfort' | 'standard' | 'premium';
export type TransportType = 'avia' | 'transfer';
export type ExcursionsType = '50$' | '30$' | '40$';
export type ServicesType = 'Insurance' | 'Visa-support';

const options: { id: number; label: string }[] = [
  { id: 1, label: 'Комфорт' },
  { id: 2, label: 'Стандарт' },
  { id: 3, label: 'Премиум' },
];

const TransportOptions: {
  id: number;
  label: string;
  icon: React.FC<SvgIconProps>;
}[] = [
  { id: 1, label: 'Авиа-билет', icon: AirplaneTicketIcon },
  { id: 2, label: 'Трансфер', icon: LocalTaxiIcon },
];

const ExcursionsOptions: {
  price: ExcursionsType;
  label: string;
  id: number;
}[] = [
  { price: '50$', label: 'Городская экскурсия (+50$)', id: 1 },
  { price: '30$', label: 'Поездка на пляж (+30$)', id: 2 },
  { price: '40$', label: 'Ночной тур (+40$)', id: 3 },
];

const ServicesOptions: { id: number; label: string }[] = [
  { id: 1, label: 'Страховка' },
  { id: 2, label: 'Визовая поддержка' },
];

export { ExcursionsOptions, options, ServicesOptions, steps, TransportOptions };

export const participantsDate = [
  {
    gender: 'male',
    firstName: 'Azizbek',
    lastName: 'Usmonov',
    birthDate: '31.07.2004',
    phone: '998901111111',
    passprt: Paasport,
  },
];
