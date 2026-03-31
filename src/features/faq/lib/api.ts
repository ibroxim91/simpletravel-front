import httpClient from '@/shared/config/api/httpClient';
import { FAQ } from '@/shared/config/api/URLs';

export interface FaqData {
  id: boolean;
  name: string;
  faqs: {
    id: number;
    title: string;
    text: string;
  }[];
}

export const Faq_Api = {
  async getFaq() {
    const res = await httpClient.get<FaqData[]>(FAQ);
    return res;
  },
};
