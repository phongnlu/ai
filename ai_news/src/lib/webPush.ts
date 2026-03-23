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

const LANG_CODES: Record<string, string> = { zh: 'zh-CN', vi: 'vi' };

async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const data = await res.json();
    return (data[0] as [string][]).map(([t]) => t).join('') || text;
  } catch {
    return text;
  }
}

async function translatePayload(payload: PushPayload, language: string): Promise<PushPayload> {
  const lang = LANG_CODES[language];
  if (!lang) return payload;
  const [title, body] = await Promise.all([
    translateText(payload.title, lang),
    translateText(payload.body, lang),
  ]);
  return { ...payload, title, body };
}

export async function sendPushToAll(payload: PushPayload): Promise<void> {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.warn('[webPush] VAPID keys not set — skipping push');
    return;
  }

  const subs = await loadSubscriptions();
  if (subs.length === 0) return;

  // Cache translated payloads per language to avoid duplicate translation calls
  const cache = new Map<string, PushPayload>();

  const results = await Promise.allSettled(
    subs.map(async (s) => {
      const lang = s.language ?? 'en';
      if (!cache.has(lang)) {
        cache.set(lang, await translatePayload(payload, lang));
      }
      const data = JSON.stringify(cache.get(lang));
      return webpush.sendNotification(
        { endpoint: s.endpoint, keys: s.keys } as PushSubscriptionRecord & { endpoint: string },
        data
      );
    })
  );

  const failed = results.filter((r) => r.status === 'rejected').length;
  console.log(`[webPush] Sent to ${subs.length - failed}/${subs.length} subscribers`);
}
