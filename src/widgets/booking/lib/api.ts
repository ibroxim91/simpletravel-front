import httpClient from '@/shared/config/api/httpClient';
import {
  DONWLOAD_PDF,
  PAYMENTS,
  TICKETORDER,
  TICKETORDER_INFO,
} from '@/shared/config/api/URLs';

export interface Get_Info {
  status: boolean;
  data: {
    departure: {
      id: number;
      name: string;
      country: {
        id: number;
        name: string;
      };
    };
    min_person: number;
    max_person: number;
    destination: {
      id: number;
      name: string;
      country: {
        id: number;
        name: string;
      };
    };
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
        tariff: {
          name: string;
        };
        price: number;
      },
    ];
    transports: [
      {
        transport: {
          name: string;
          icon_name: string;
        };
        price: number;
      },
    ];
    extra_service: {
      id: number;
      name: string;
    }[];
    paid_extra_service: {
      id: number;
      price: number;
      name: string;
    }[];
    hotel_rating: string;
  };
}

export interface SamoOrderParticipant {
  id: number;
  first_name: string;
  last_name: string;
  gender?: 'male' | 'female';
}

export interface SamoOrder {
  id: number;
  tour_operator_id: string;
  tour_operator: string;
  title: string;
  price: string;
  total_price: number | string;
  check_in_date: string;
  check_out_date: string;
  order_status: string;
  payment_type?: string | null;
  destination_id: number;
  destination_name: string;
  destination_country_name?: string;
  departure_id: number;
  departure_name: string;
  departure_country_name?: string;
  passenger_count: number;
  duration_days: number;
  hotel_id?: number;
  hotel_name?: string;
  meal_plan?: string;
  rating?: string;
  participant: SamoOrderParticipant[] | number[];
}

export interface Create_Ticketorder {
  departure: string;
  destination: string;
  departure_date: string;
  arrival_time: string;
  participant: number[];
  ticket: number;
  tariff?: string;
  transport?: string;
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
    let parisipants = JSON.parse(localStorage.getItem('participantsForm'))
    parisipants = parisipants.userIds
    console.log("parisipants 2", parisipants);
    console.log("typeof parisipants 2", typeof parisipants);

    body.participant = parisipants 
    console.log("body 2", body);
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

  async downloadPdf(body: { order_id: number | null; lang: string }) {
    const res = await httpClient.post(DONWLOAD_PDF, body, {
      responseType: 'blob',
    });
    return res;
  },

  async getOrderById({ id }: { id: number }) {
    const res = await httpClient.get<SamoOrder | { data: SamoOrder }>(
      `${TICKETORDER}${id}/`,
    );
    return res;
  },
};
