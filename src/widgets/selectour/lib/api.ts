import httpClient from '@/shared/config/api/httpClient';
import {
  GET_TICKETS,
  HOTEL_MEAL_PLAN,
  SAVE_TICKETS,
  HOMETICKETS,
} from '@/shared/config/api/URLs';
import { AxiosResponse } from 'axios';
import qs from 'qs';
import { HotelMealPlan, TickectAll, TickectAllFilter } from './types';

const Ticket_Api = {
  
  async GetHomeTickets() {
    
    const res = await httpClient.get(HOMETICKETS);
    return res.data;
  },
  
  async GetAllTickets({
    params,
  }: {
    params: TickectAllFilter;
    paramsSerializer?: (params: TickectAllFilter) => string;
  }) {
    const res = await httpClient.get<TickectAll>(GET_TICKETS, {
      params,
      paramsSerializer: (params: Record<string, null>) =>
        qs.stringify(params, { arrayFormat: 'repeat' }),
    });
    return res.data;
  },

  async saveTickets({ ticket }: { ticket: number }) {
    const res = await httpClient.post(SAVE_TICKETS, { ticket });
    return res;
  },

  async removeTickets({ id }: { id: number }) {
    const res = await httpClient.delete(`${SAVE_TICKETS}${id}/`);
    return res;
  },
};

export const hotel_meal_plan = async (): Promise<
  AxiosResponse<HotelMealPlan>
> => {
  const res = await httpClient.get(HOTEL_MEAL_PLAN);
  return res;
};

export default Ticket_Api;
