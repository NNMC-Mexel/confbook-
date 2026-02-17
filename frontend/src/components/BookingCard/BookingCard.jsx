import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function BookingCard({ booking, roomName, roomIndex, onCancel, showDate = true }) {
  const colors = roomIndex === 0
    ? { bg: 'bg-room-1/5', border: 'border-room-1/20', badge: 'bg-room-1', text: 'text-room-1' }
    : { bg: 'bg-room-2/5', border: 'border-room-2/20', badge: 'bg-room-2', text: 'text-room-2' };

  return (
    <div className={`${colors.bg} ${colors.border} border rounded-xl p-4 transition-shadow hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium text-white ${colors.badge}`}>
              {roomName}
            </span>
            {showDate && (
              <span className="text-xs text-gray-500">
                {format(parseISO(booking.date), 'd MMM, EEEE', { locale: ru })}
              </span>
            )}
          </div>
          <h3 className="font-medium text-gray-900 truncate">
            {booking.topic || 'Без темы'}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
            <span>
              {booking.startTime?.slice(0, 5)} — {booking.endTime?.slice(0, 5)}
            </span>
            <span>·</span>
            <span>{booking.bookerName}</span>
            {booking.department && (
              <>
                <span>·</span>
                <span>{booking.department}</span>
              </>
            )}
          </div>
        </div>
        {onCancel && (
          <button
            onClick={() => onCancel(booking)}
            className="ml-3 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Отменить"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
