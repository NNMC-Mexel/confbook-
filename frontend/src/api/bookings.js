import { api } from './client';

export async function getBookings(filters = {}) {
  const params = new URLSearchParams();
  params.append('populate', 'room');
  params.append('sort', 'date:asc,startTime:asc');

  if (filters.date) {
    params.append('filters[date][$eq]', filters.date);
  }
  if (filters.dateFrom) {
    params.append('filters[date][$gte]', filters.dateFrom);
  }
  if (filters.dateTo) {
    params.append('filters[date][$lte]', filters.dateTo);
  }
  if (filters.roomId) {
    params.append('filters[room][id][$eq]', filters.roomId);
  }
  if (filters.userId) {
    params.append('filters[userId][$eq]', filters.userId);
  }

  const response = await api.get(`/api/bookings?${params.toString()}`);
  return response.data;
}

function toStrapiTime(time) {
  if (!time) return time;
  if (time.length === 5) return `${time}:00.000`;
  return time;
}

export async function createBooking(data) {
  const { roomId, startTime, endTime, ...fields } = data;

  const payload = {
    ...fields,
    startTime: toStrapiTime(startTime),
    endTime: toStrapiTime(endTime),
    room: { connect: [{ id: roomId }] },
  };

  const response = await api.post('/api/bookings', { data: payload });
  return response.data;
}

export async function deleteBooking(id) {
  await api.delete(`/api/bookings/${id}`);
}

export async function cancelBookingByCode(cancelCode) {
  const response = await api.get(
    `/api/bookings?filters[cancelCode][$eq]=${cancelCode}`
  );
  const bookings = response.data;
  if (bookings.length === 0) throw new Error('Бронирование не найдено');
  await api.delete(`/api/bookings/${bookings[0].documentId}`);
  return true;
}
