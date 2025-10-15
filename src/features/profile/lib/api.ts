import httpClient from '@/shared/config/api/httpClient';
import {
  GET_ME,
  PARTICIPANT,
  PARTICIPANT_IMAGE,
  TICKETORDER,
} from '@/shared/config/api/URLs';

interface GetMe {
  status: boolean;
  data: {
    id: number;
    last_login: string;
    is_superuser: boolean;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    phone: string;
    email: string;
    username: string;
    avatar: string;
    validated_at: string;
    role: string;
    travel_agency: number;
  };
}

export interface GetAllParticipantData {
  status: boolean;
  data: {
    links: {
      previous: string;
      next: string;
    };
    total_items: number;
    total_pages: number;
    page_size: number;
    current_page: number;
    results: {
      id: number;
      first_name: string;
      gender: 'male' | 'female';
      last_name: string;
    }[];
  };
}

interface GetOneParticipantData {
  status: boolean;
  data: {
    id: number;
    first_name: string;
    last_name: string;
    birth_date: string;
    phone_number: string;
    gender: 'male' | 'female';
    participant_pasport_image: [
      {
        id: number;
        image: string;
      },
    ];
  };
}

interface GetAllOrder {
  status: boolean;
  data: {
    links: {
      previous: string;
      next: string;
    };
    total_items: number;
    total_pages: number;
    page_size: number;
    current_page: number;
    results: {
      id: number;
      departure: string;
      destination: string;
      departure_date: string;
      arrival_time: string;
      participant: {
        id: number;
        first_name: string;
        last_name: string;
        gender: 'male' | 'female';
      }[];
      ticket: {
        id: 1;
        title: string;
        service_name: string;
        location_name: string;
      };
      tariff: string;
      transport: string;
      extra_service: {
        id: number;
        name: string;
      }[];
      extra_paid_service: {
        id: number;
        name: string;
        price: number;
      }[];
      total_price: number;
      order_status: string;
    }[];
  };
}

interface GetOrderId {
  status: boolean;
  data: {
    id: number;
    departure: string;
    destination: string;
    departure_date: string;
    arrival_time: string;
    participant: {
      id: number;
      first_name: string;
      last_name: string;
      gender: 'male' | 'female';
    }[];
    ticket: {
      id: number;
      title: string;
      service_name: string;
      location_name: string;
    };
    tariff: string;
    transport: string;
    extra_service: {
      id: number;
      name: string;
    }[];
    extra_paid_service: {
      id: number;
      name: string;
      price: number;
    }[];
    total_price: number;
    order_status: string;
  };
}

export const User_Api = {
  async getMe() {
    const res = await httpClient.get<GetMe>(GET_ME);
    return res;
  },

  async getAllParticipant({
    page,
    page_size,
  }: {
    page: number;
    page_size: number;
  }) {
    const res = await httpClient.get<GetAllParticipantData>(PARTICIPANT, {
      params: {
        page,
        page_size,
      },
    });
    return res;
  },

  async getOneParticipant({ id }: { id: number | string }) {
    const res = await httpClient.get<GetOneParticipantData>(
      `${PARTICIPANT}${id}/`,
    );
    return res;
  },

  async createParticipant(formData: FormData) {
    const res = await httpClient.post(PARTICIPANT, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res;
  },

  async editParticipant({ id, formData }: { id: number; formData: FormData }) {
    const res = await httpClient.patch(`${PARTICIPANT}${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res;
  },

  async deleteParticipant({ id }: { id: string | number }) {
    const res = await httpClient.delete(`${PARTICIPANT}${id}/`);
    return res;
  },

  async deleteParticipantImage({ id }: { id: string | number }) {
    const res = await httpClient.delete(`${PARTICIPANT_IMAGE}${id}/`);
    return res;
  },

  async getOrder({ page, page_size }: { page: number; page_size: number }) {
    const res = await httpClient.get<GetAllOrder>(TICKETORDER, {
      params: {
        page,
        page_size,
      },
    });
    return res;
  },

  async getOrderId({ id }: { id: number }) {
    const res = await httpClient.get<GetOrderId>(`${TICKETORDER}${id}/`);
    return res;
  },
};
