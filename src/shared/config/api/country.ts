import { AxiosResponse } from 'axios';
import httpClient from './httpClient';
import { COUNTRIES } from './URLs';

export interface CountryList {
  status: boolean;
  data: {
    id: number;
    name: string;
    regions: {
      id: number;
      name: string;
    }[];
  }[];
}

export interface CountryListData {
  id: number;
  name: string;
  regions: {
    id: number;
    name: string;
  }[];
}

export interface CountryDetail {
  status: boolean;
  data: {
    id: number;
    name: string;
    regions: {
      id: number;
      name: string;
    }[];
  };
}

export const country_api = {
  async list(): Promise<AxiosResponse<CountryList>> {
    const res = await httpClient.get(COUNTRIES);
    return res;
  },

  async detail(id: number): Promise<AxiosResponse<CountryDetail>> {
    const res = await httpClient.get(`${COUNTRIES}${id}/`);
    return res;
  },
};
