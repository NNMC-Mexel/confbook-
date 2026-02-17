import { api } from './client';

export async function login(identifier, password) {
  const response = await api.post('/api/auth/local', { identifier, password });
  return response;
}

export async function register(username, email, password) {
  const response = await api.post('/api/auth/local/register', {
    username,
    email,
    password,
  });
  return response;
}

export async function getMe() {
  const response = await api.get('/api/users/me');
  return response;
}
