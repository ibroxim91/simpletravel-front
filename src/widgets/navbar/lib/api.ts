import httpClient from '@/shared/config/api/httpClient';
import { LOCATIONS } from '@/shared/config/api/URLs';
import { AxiosResponse } from 'axios';
import { LocationList } from './model';

export const location_api = {
  async location_list(): Promise<AxiosResponse<LocationList>> {
    const res = await httpClient.get(LOCATIONS);
    return res;
  },
};
