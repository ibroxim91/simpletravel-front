import httpClient from '@/shared/config/api/httpClient';
import { SEND_SUPPORT } from '@/shared/config/api/URLs';

export interface Body {
  name: string;
  phone_number: string;
  travel_agency?: number | string;
}

export const Support_Api = {
  async send(body: Body) {
    const res = await httpClient.post(SEND_SUPPORT, body);
    return res;
  },
};
