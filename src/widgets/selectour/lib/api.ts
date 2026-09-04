import httpClient from '@/shared/config/api/httpClient';
import httpClientTickets from '@/shared/config/api/httpClientTickets';
import {
  GET_TICKETS,
  POPULAR_DESTINATIONS,
  GET_TICKETS_FROM_GO,
  HOTEL_MEAL_PLAN,
  SAVE_TICKETS,
  HOMETICKETS,
  HOME_OFFERS,
} from '@/shared/config/api/URLs';
import { AxiosResponse } from 'axios';
import qs from 'qs';
import { HotelMealPlan, TickectAll, TickectAllFilter } from './types';

export type HomeOffersParams = {
  hot?: boolean;
  visa_required?: boolean;
  page?: number;
};

const Ticket_Api = {
  
  async GetHomeTickets() {
    
    const res = await httpClient.get(HOMETICKETS);
    return res.data;
  },

  async GetHomeOffers(params: HomeOffersParams = {}) {
    const res = await httpClientTickets.get<TickectAll>(HOME_OFFERS, {
      params: {
        ...(params.hot ? { hot: true } : {}),
        ...(typeof params.visa_required === 'boolean'
          ? { visa_required: params.visa_required }
          : {}),
        page: params.page ?? 1,
      },
    });
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


