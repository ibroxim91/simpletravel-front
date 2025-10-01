import Image from '@/assets/Paris.jpg';
import { StaticImageData } from 'next/image';

export const dataPayment: Payment = {
  data: [
    {
      id: 123456,
      service: 'Tashkent -New York',
      amount: '60,000 $',
      location: 'Weys sity',
      status: 'Подтверждено',
      detail: 'Detail',
    },
    {
      id: 123456,
      service: 'Tashkent -New York',
      amount: '60,000 $',
      location: 'Weys sity',
      status: 'Подтверждено',
      detail: 'Detail',
    },
    {
      id: 123456,
      service: 'Tashkent -New York',
      amount: '60,000 $',
      location: 'Weys sity',
      status: 'Подтверждено',
      detail: 'Detail',
    },
    {
      id: 123456,
      service: 'Tashkent -New York',
      amount: '60,000 $',
      location: 'Weys sity',
      status: 'Подтверждено',
      detail: 'Detail',
    },
    {
      id: 123456,
      service: 'Tashkent -New York',
      amount: '60,000 $',
      location: 'Weys sity',
      status: 'Подтверждено',
      detail: 'Detail',
    },
    {
      id: 123456,
      service: 'Tashkent -New York',
      amount: '60,000 $',
      location: 'Weys sity',
      status: 'Подтверждено',
      detail: 'Detail',
    },
    {
      id: 123456,
      service: 'Tashkent -New York',
      amount: '60,000 $',
      location: 'Weys sity',
      status: 'Подтверждено',
      detail: 'Detail',
    },
    {
      id: 123456,
      service: 'Tashkent -New York',
      amount: '60,000 $',
      location: 'Weys sity',
      status: 'Подтверждено',
      detail: 'Detail',
    },
    {
      id: 123456,
      service: 'Tashkent -New York',
      amount: '60,000 $',
      location: 'Weys sity',
      status: 'Подтверждено',
      detail: 'Detail',
    },
    {
      id: 123456,
      service: 'Tashkent -New York',
      amount: '60,000 $',
      location: 'Weys sity',
      status: 'Подтверждено',
      detail: 'Detail',
    },
  ],
  page: 1,
  page_size: 10,
  total: 100,
};

export type Payment = {
  data: {
    id: number;
    location: string;
    service: string;
    amount: string;
    detail: string;
    status: string;
  }[];
  total: number;
  page: number;
  page_size: number;
};

export type PaymentRow = {
  id: number;
  location: string;
  service: string;
  amount: string;
  detail: string;
  status: string;
};

export type Traveler = {
  gender: 'male' | 'female';
  firstName: string;
  lastName: string;
  birthData: string;
  phone: string;
  passport: StaticImageData;
};

export const dataTraveler: Traveler[] = [
  {
    birthData: '14-09-2003',
    firstName: 'Samandar',
    gender: 'male',
    lastName: 'Turgunboyev',
    passport: Image,
    phone: '998901111111',
  },
  {
    birthData: '14-09-2003',
    firstName: 'Samandar',
    gender: 'male',
    lastName: 'Turgunboyev',
    passport: Image,
    phone: '998901111111',
  },
];
