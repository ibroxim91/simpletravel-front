import httpClient from '@/shared/config/api/httpClient';
import { SEND_PARTNER } from '@/shared/config/api/URLs';

export interface SendPartnerBody {
  name: string;
  addres: string;
  email: string;
  phone: string;
  instagram: string;
  web_site: string;
  documents: [string];
}

export const Send_Partner = {
  async send(body: SendPartnerBody) {
    const res = await httpClient.post(SEND_PARTNER, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res;
  },
};
