import { post } from '../../utils/requests';

export const authUser = async ({ name, password }) => post({ name, password }, 'auth', (data) => {
  if (data.ok) {
    return data.data;
  }
  return null;
}, null);

export const refreshToken = async (token) => post({}, 'refresh', (data) => data.data?.token ?? null, null, token);
