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
      title={isSubscribed ? 'Unsubscribe from notifications' : 'Get notified of new articles'}
      className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border transition-colors
        ${isSubscribed
          ? 'border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isSubscribed ? '🔔' : '🔕'}
      <span>{loading ? '…' : isSubscribed ? 'Subscribed' : 'Notify me'}</span>
    </button>
  );
}
