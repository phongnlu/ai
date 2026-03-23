'use client';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export default function PushNotificationButton() {
  const { state, loading, subscribe, unsubscribe } = usePushNotifications();

  if (state === 'unsupported') return null;

  if (state === 'denied') {
    return (
      <span className="text-xs text-gray-400 dark:text-gray-500" title="Notifications blocked in browser settings">
        🔔 Blocked
      </span>
    );
  }

  const isSubscribed = state === 'subscribed';

  return (
    <button
      onClick={isSubscribed ? unsubscribe : subscribe}
      disabled={loading}
      aria-label={isSubscribed ? 'Unsubscribe from notifications' : 'Get notified of new articles'}
      title={isSubscribed ? 'Unsubscribe from notifications' : 'Get notified of new articles'}
      className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <span className="text-lg leading-none">{loading ? '…' : isSubscribed ? '🔔' : '🔕'}</span>
    </button>
  );
}
