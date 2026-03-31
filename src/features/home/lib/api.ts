import httpClient from '@/shared/config/api/httpClient';
import { GET_BANNER } from '@/shared/config/api/URLs';
import { AxiosResponse } from 'axios';
import { GetBanner } from './data';

const getBanner = async (params: {
  page: number;
  page_size: number;
  position: 'banner1' | 'banner2' | 'banner3' | 'banner4';
}): Promise<AxiosResponse<GetBanner>> => {
  const res = await httpClient.get(GET_BANNER, { params });
  return res;
};

export { getBanner };
