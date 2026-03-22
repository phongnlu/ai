import webpush from 'web-push';
import { loadSubscriptions, PushSubscriptionRecord } from './storage';

const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_MAILTO } = process.env;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    VAPID_MAILTO ?? 'mailto:admin@onesolution365.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

export { VAPID_PUBLIC_KEY };

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

export async function sendPushToAll(payload: PushPayload): Promise<void> {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.warn('[webPush] VAPID keys not set — skipping push');
    return;
  }

  const subs = await loadSubscriptions();
  if (subs.length === 0) return;

  const data = JSON.stringify(payload);
  const results = await Promise.allSettled(
    subs.map((s) =>
      webpush.sendNotification(
        { endpoint: s.endpoint, keys: s.keys } as PushSubscriptionRecord & { endpoint: string },
        data
      )
    )
  );

  const failed = results.filter((r) => r.status === 'rejected').length;
  console.log(`[webPush] Sent to ${subs.length - failed}/${subs.length} subscribers`);
}
