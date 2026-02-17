import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBookings } from '../hooks/useBookings';
import { useRooms } from '../hooks/useRooms';
import { deleteBooking } from '../api/bookings';
import BookingCard from '../components/BookingCard/BookingCard';
import Modal from '../components/Modal/Modal';
import { format } from 'date-fns';
import { Navigate } from 'react-router-dom';

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth();
  const { rooms } = useRooms();
  const { bookings, loading, refetch } = useBookings(
    user ? { userId: user.id } : {},
    { skip: !user }
  );
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteBooking(confirmDelete.documentId || confirmDelete.id);
      setConfirmDelete(null);
      refetch();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  }

  const today = format(new Date(), 'yyyy-MM-dd');
  const upcoming = bookings.filter((b) => b.date >= today);
  const past = bookings.filter((b) => b.date < today);

  function getRoomInfo(booking) {
    const roomId = booking.room?.id || booking.room?.data?.id;
    const roomIdx = rooms.findIndex((r) => r.id === roomId);
    const roomName = rooms[roomIdx]?.name || 'Зал';
    return { roomIdx, roomName };
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Мои бронирования</h1>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      ) : upcoming.length === 0 && past.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Нет бронирований</h3>
          <p className="text-gray-500">
            У вас пока нет бронирований. Перейдите в{' '}
            <a href="/" className="text-primary hover:underline">расписание</a>
            {' '}чтобы забронировать зал.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Предстоящие
              </h2>
              <div className="space-y-3">
                {upcoming.map((booking) => {
                  const { roomIdx, roomName } = getRoomInfo(booking);
                  return (
                    <BookingCard
                      key={booking.id || booking.documentId}
                      booking={booking}
                      roomName={roomName}
                      roomIndex={roomIdx}
                      onCancel={setConfirmDelete}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                Прошедшие
              </h2>
              <div className="space-y-3 opacity-60">
                {past.map((booking) => {
                  const { roomIdx, roomName } = getRoomInfo(booking);
                  return (
                    <BookingCard
                      key={booking.id || booking.documentId}
                      booking={booking}
                      roomName={roomName}
                      roomIndex={roomIdx}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Confirm delete modal */}
      <Modal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Отменить бронирование?"
      >
        <p className="text-gray-600 mb-6">
          Вы уверены, что хотите отменить бронирование
          {confirmDelete?.topic ? ` "${confirmDelete.topic}"` : ''}? Это действие нельзя отменить.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setConfirmDelete(null)}
            className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Нет, оставить
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {deleting ? 'Удаление...' : 'Да, отменить'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
