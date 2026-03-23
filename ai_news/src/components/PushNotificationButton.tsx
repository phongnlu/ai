'use client';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import NavTooltip from './NavTooltip';

interface Props {
  showTooltip?: boolean;
  onTooltipAdvance?: () => void;
}

export default function PushNotificationButton({ showTooltip = false, onTooltipAdvance }: Props) {
  const { state, loading, subscribe, unsubscribe } = usePushNotifications();

  if (state === 'unsupported') return null;

  if (state === 'denied') {
    return (
      <NavTooltip label="Notifications blocked" show={showTooltip} onAdvance={onTooltipAdvance}>
        <span className="p-2 text-lg leading-none text-gray-400 dark:text-gray-500">🔕</span>
      </NavTooltip>
    );
  }

  const isSubscribed = state === 'subscribed';
  const tooltipLabel = isSubscribed ? 'Tap to unsubscribe' : 'Tap to get notified';

  return (
    <NavTooltip label={tooltipLabel} show={showTooltip} onAdvance={onTooltipAdvance}>
      <button
        onClick={isSubscribed ? unsubscribe : subscribe}
        disabled={loading}
        aria-label={isSubscribed ? 'Unsubscribe from notifications' : 'Get notified of new articles'}
        className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-lg leading-none">{loading ? '…' : isSubscribed ? '🔔' : '🔕'}</span>
      </button>
    </NavTooltip>
  );
}
