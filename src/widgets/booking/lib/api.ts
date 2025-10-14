import httpClient from '@/shared/config/api/httpClient';
import {
  PAYMENTS,
  TICKETORDER,
  TICKETORDER_INFO,
} from '@/shared/config/api/URLs';

export interface Get_Info {
  status: boolean;
  data: {
    departure: string;
    destination: string;
    price: number;
    departure_date: string;
    departure_time: string;
    travel_time: string;
    title: string;
    rating: number;
    image_banner: string;
    ticket_amenities: [
      {
        name: string;
        icon_name: string;
      },
    ];
    tariff: [
      {
        name: string;
      },
    ];
    transports: [
      {
        name: string;
        icon_name: string;
      },
    ];
    extra_service: [
      {
        id: number;
        name: string;
      },
    ];
    extra_paid_service: [
      {
        id: number;
        price: number;
        name: string;
      },
    ];
  };
}

export interface Create_Ticketorder {
  departure: string;
  destination: string;
  departure_date: string;
  arrival_time: string;
  participant: number[];
  ticket: number;
  tariff: string;
  transport: string;
  extra_service: number[];
  extra_paid_service: number[];
  total_price: number;
}

export const Ticketorder_Api = {
  async ticketorder_info({ id }: { id: number }) {
    const res = await httpClient.get<Get_Info>(`${TICKETORDER_INFO}${id}/`);
    return res;
  },

  async ticketorder_create(body: Create_Ticketorder) {
    const res = await httpClient.post(TICKETORDER, body);
    return res;
  },

  async payments({
    paymentType,
    order_id,
    return_url,
  }: {
    paymentType: string;
    return_url: string;
    order_id: number;
  }) {
    const res = await httpClient.post(`${PAYMENTS}${paymentType}/`, {
      order_id,
      return_url,
    });
    return res;
  },
};
