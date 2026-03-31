import httpClient from '@/shared/config/api/httpClient';
import { GET_HELP_PAGE } from '@/shared/config/api/URLs';
import { AxiosResponse } from 'axios';
import { GetHelpPageData } from './type';

const getHelpPage = async (params: {
  page_type: 'privacy_policy' | 'user_agreement';
}): Promise<AxiosResponse<GetHelpPageData>> => {
  const res = await httpClient.get(GET_HELP_PAGE, { params });
  return res;
};

export { getHelpPage };
