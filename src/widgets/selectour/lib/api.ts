import httpClient from '@/shared/config/api/httpClient';
import httpClientTickets from '@/shared/config/api/httpClientTickets';
import {
  GET_TICKETS,
  POPULAR_DESTINATIONS,
  GET_TICKETS_FROM_GO,
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

  async GetPopularDestination(){
    const res = await httpClient.get(POPULAR_DESTINATIONS);
    return res.data;
  },
  
  async GetAllTickets({
    params,
  }: {
    params: TickectAllFilter;
    paramsSerializer?: (params: TickectAllFilter) => string;
  }) {
   
    const res = await httpClientTickets.get<TickectAll>(GET_TICKETS_FROM_GO, {
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


