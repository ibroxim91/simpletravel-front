import httpClient from '@/shared/config/api/httpClient';
import { GET_BLOGS, GET_TAGS } from '@/shared/config/api/URLs';
import {
  All_Blogs_Type,
  Detail_Blogs_Type,
  Get_Tags_Date,
  Get_Tags_Detail,
} from './data';

export const News_Api = {
  async getAllNews({ page, page_size }: { page: number; page_size: number }) {
    const res = await httpClient.get<All_Blogs_Type>(GET_BLOGS, {
      params: { page, page_size },
    });
    return res;
  },
  async getNewsDetail({ id }: { id: number }) {
    const res = await httpClient.get<Detail_Blogs_Type>(`${GET_BLOGS}${id}/`);
    return res;
  },
  async getTags({ page, page_size }: { page: number; page_size: number }) {
    const res = await httpClient.get<Get_Tags_Date>(GET_TAGS, {
      params: { page, page_size },
    });
    return res;
  },
  async getTagDetail({ id }: { id: number }) {
    const res = await httpClient.get<Get_Tags_Detail>(`${GET_TAGS}${id}`);
    return res;
  },
};
