import Cookies from 'js-cookie';

//access Token CRUD
export const saveToken = (token: string) => {
  Cookies.set('simple-token', token);
};

export const getToken = (): string | undefined => {
  return Cookies.get('simple-token');
};

export const removeToken = () => {
  Cookies.remove('simple-token');
};

//refresh Token CRUD
export const saveRefToken = (token: string) => {
  Cookies.set('simple-reftoken', token);
};

export const getRefToken = (): string | undefined => {
  return Cookies.get('simple-reftoken');
};

export const removeRefToken = () => {
  Cookies.remove('simple-reftoken');
};
