import httpClient from '@/shared/config/api/httpClient';
import { GET_TICKETS } from '@/shared/config/api/URLs';
import { ToursDetail } from './data';

export const TicketsDetailAPi = {
  async getTicketsDetail({ id }: { id: number }) {
    const res = await httpClient.get<ToursDetail>(`${GET_TICKETS}${id}/`);
    return res;
  },
};
