import httpClient from '@/shared/config/api/httpClient';
import { GET_TICKETS, SEND_COMMENT } from '@/shared/config/api/URLs';
import { ToursDetail } from './data';

export const TicketsDetailAPi = {
  async getTicketsDetail({ id }: { id: number | string }) {
        let url = `${GET_TICKETS}${id}/`;
    const savedData = localStorage.getItem('filterTours');
    if (savedData) {
      try {
        const filters = JSON.parse(savedData);
        filters.operator = localStorage.getItem("tourOperator")
        const params = new URLSearchParams();

        if (filters.departure) params.set('departure', filters.departure);
        if (filters.destination) params.set('destination', filters.destination);
        if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
        if (filters.dateTo) params.set('dateTo', filters.dateTo);
        if (filters.adults) params.set('adults', filters.adults);
        if (filters.children) params.set('children', filters.children);
        if (filters.operator) params.set('operator', filters.operator);

        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      } catch (e) {
        console.error('Error parsing savedData', e);
      }
    }
    

     const res = await httpClient.get<ToursDetail>(url);
    return res;
  },

  async sendCommet(body: { text: string; rating: number; ticket: number }) {
    const res = await httpClient.post(SEND_COMMENT, body);
    return res;
  },
};
