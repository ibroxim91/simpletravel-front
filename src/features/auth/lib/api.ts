import httpClient from '@/shared/config/api/httpClient';
import {
  EMAIL_CONFIRM_RESET_PASS,
  EMAIL_CONFIRMOTP,
  EMAIL_LOGIN,
  EMAIL_RESEND_OTP,
  EMAIL_RESEND_PASSWORD,
  EMAIL_RESET_PASS,
  EMAIL_SENDOTP,
  EMAIL_SET_PASSWORD,
  NEW_PASSWORD,
  PHONE_CONFIRM_RESET_PASS,
  PHONE_CONFIRMOTP,
  PHONE_LOGIN,
  PHONE_RESEND_OTP,
  PHONE_RESET_PASS,
  PHONE_RESTER_PASSWORD,
  PHONE_SENDOTP,
  PHONE_SET_PASSWORD,
  UPDATE_USER,
} from '@/shared/config/api/URLs';

interface PhoneBody {
  phone: string;
}

interface SetPasswordRes {
  data: {
    detail: string;
    token: {
      access: string;
      refresh: string;
    };
  };
  status: boolean;
}

interface Login {
  access: string;
  refresh: string;
}

export const Auth_Api = {
  //register phone
  async registerPhone({ phone }: PhoneBody) {
    const res = await httpClient.post(PHONE_SENDOTP, { phone });
    return res;
  },
  async resetPasswordPhone({ phone }: PhoneBody) {
    const res = await httpClient.post(PHONE_RESTER_PASSWORD, { phone });
    return res;
  },
  async loginPhone({ phone, password }: { phone: string; password: string }) {
    const res = await httpClient.post<Login>(PHONE_LOGIN, { phone, password });
    return res;
  },
  async confirmPhone({ code, phone }: { code: string; phone: string }) {
    const res = await httpClient.post(PHONE_CONFIRMOTP, { phone, code });
    return res;
  },
  async confirmResetPassPhone({
    code,
    phone,
  }: {
    code: string;
    phone: string;
  }) {
    const res = await httpClient.post<{
      status: boolean;
      data: { token: string };
    }>(PHONE_CONFIRM_RESET_PASS, {
      phone,
      code,
    });
    return res;
  },
  async resendPhone({ phone }: { phone: string }) {
    const res = await httpClient.post(PHONE_RESEND_OTP, { phone });
    return res;
  },

  async PasswordPhone({
    password,
    phone,
  }: {
    password: string;
    phone: string;
  }) {
    const res = await httpClient.post<SetPasswordRes>(PHONE_SET_PASSWORD, {
      phone,
      password,
    });
    return res;
  },

  async resetPass({ password, token }: { password: string; token: string }) {
    const res = await httpClient.post(PHONE_RESET_PASS, { password, token });
    return res;
  },

  //register e-mail
  async resetPassEmail({
    password,
    token,
  }: {
    password: string;
    token: string;
  }) {
    const res = await httpClient.post(EMAIL_RESET_PASS, { password, token });
    return res;
  },
  async loginEmail({ email, password }: { email: string; password: string }) {
    const res = await httpClient.post<Login>(EMAIL_LOGIN, { email, password });
    return res;
  },
  async registerEmail({ email }: { email: string }) {
    const res = await httpClient.post(EMAIL_SENDOTP, { email });
    return res;
  },
  async resetPasswordEmail({ email }: { email: string }) {
    const res = await httpClient.post(EMAIL_RESEND_PASSWORD, { email });
    return res;
  },
  async confirmEmail({ code, email }: { code: string; email: string }) {
    const res = await httpClient.post(EMAIL_CONFIRMOTP, { email, code });
    return res;
  },
  async resetPassConfirmEmail({
    code,
    email,
  }: {
    code: string;
    email: string;
  }) {
    const res = await httpClient.post<{
      status: boolean;
      data: { token: string };
    }>(EMAIL_CONFIRM_RESET_PASS, {
      email,
      code,
    });
    return res;
  },
  async resendEmail({ email }: { email: string }) {
    const res = await httpClient.post(EMAIL_RESEND_OTP, { email });
    return res;
  },
  async PasswordEmail({
    password,
    email,
  }: {
    password: string;
    email: string;
  }) {
    const res = await httpClient.post<SetPasswordRes>(EMAIL_SET_PASSWORD, {
      email,
      password,
    });
    return res;
  },
  async updateUser({
    first_name,
    last_name,
    avatar,
  }: {
    first_name: string;
    last_name: string;
    avatar?: File;
  }) {
    const formData = new FormData();
    formData.append('first_name', first_name);
    formData.append('last_name', last_name);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    const res = await httpClient.patch(UPDATE_USER, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res;
  },
  async newPassword({
    new_password,
    old_password,
  }: {
    old_password: string;
    new_password: string;
  }) {
    const res = await httpClient.post(NEW_PASSWORD, {
      new_password,
      old_password,
    });
    return res;
  },
};
