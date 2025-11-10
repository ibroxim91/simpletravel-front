import httpClient from '@/shared/config/api/httpClient';
import { GET_SAVED } from '@/shared/config/api/URLs';

interface Get_Saved {
  status: boolean;
  data: {
    current_page: number;
    links: {
      next: null | string;
      previous: null | string;
    };
    page_size: number;
    total_items: number;
    total_pages: number;
    results: {
      id: number;
      ticket: {
        departure: string;
        id: number;
        departure_date: string;
        destination: string;
        slug: string;
        duration_days: number;
        is_liked: boolean;
        passenger_count: number;
        price: number;
        rating: number;
        title: string;
        travel_time: string;
        visa_required: boolean;
        badge: {
          color: string;
          id: number;
          name: string;
        }[];
        ticket_amenities: {
          icon_name: string;
          name: string;
        }[];

        ticket_images: {
          image: string;
        };
      };
    }[];
  };
}

export const Get_Likes_Api = {
  async getAllSavedProduct({
    page,
    page_size,
  }: {
    page: number;
    page_size: number;
  }) {
    const res = await httpClient.get<Get_Saved>(GET_SAVED, {
      params: { page, page_size },
    });
    return res;
  },
};
