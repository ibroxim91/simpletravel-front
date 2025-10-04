import httpClient from '@/shared/config/api/httpClient';
import { GET_TICKETS } from '@/shared/config/api/URLs';
import { TickectAll, TickectAllFilter } from './types';

const Ticket_Api = {
  async GetAllTickets({ params }: { params: TickectAllFilter }) {
    const res = await httpClient.get<TickectAll>(GET_TICKETS, { params });
    return res.data;
  },
};

export default Ticket_Api;
