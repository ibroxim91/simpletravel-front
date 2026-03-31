import httpClient from '@/shared/config/api/httpClient';
import { GET_CONTACT } from '@/shared/config/api/URLs';
import { AxiosResponse } from 'axios';
import { GetContactData } from './data';

const getContact = async (): Promise<AxiosResponse<GetContactData>> => {
  const res = await httpClient.get(GET_CONTACT);
  return res;
};
export { getContact };
