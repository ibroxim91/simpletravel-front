import httpClient from '@/shared/config/api/httpClient';
import { GET_ME } from '@/shared/config/api/URLs';

interface GetMe {
  status: boolean;
  data: {
    id: number;
    last_login: string;
    is_superuser: boolean;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    is_active: boolean;
    date_joined: string;
    phone: string;
    email: string;
    username: string;
    avatar: string;
    validated_at: string;
    role: string;
    travel_agency: number;
  };
}

export const User_Api = {
  async getMe() {
    const res = await httpClient.get<GetMe>(GET_ME);
    return res;
  },
};
