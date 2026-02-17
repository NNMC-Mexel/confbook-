import { api } from './client';

export async function getRooms() {
  const response = await api.get('/api/rooms?sort=name:asc');
  return response.data;
}

export async function getRoom(id) {
  const response = await api.get(`/api/rooms/${id}`);
  return response.data;
}
