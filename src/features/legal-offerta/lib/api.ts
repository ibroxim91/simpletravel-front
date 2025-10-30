import httpClient from '@/shared/config/api/httpClient';
import { GET_OFFERTA } from '@/shared/config/api/URLs';
import { AxiosResponse } from 'axios';
import { GetOffertaData } from './type';

const getOfferta = async (params: {
  person_type: 'individual' | 'legal_entity';
}): Promise<AxiosResponse<GetOffertaData>> => {
  const res = await httpClient.get(GET_OFFERTA, { params });
  return res;
};

export { getOfferta };
