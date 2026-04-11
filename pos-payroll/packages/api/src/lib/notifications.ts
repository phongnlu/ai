import Expo, { ExpoPushMessage } from 'expo-server-sdk';

const expo = new Expo();

export interface SendPushParams {
  tokens: string[];
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export async function sendPushNotifications({ tokens, title, body, data }: SendPushParams): Promise<void> {
  const messages: ExpoPushMessage[] = tokens
    .filter((token) => Expo.isExpoPushToken(token))
    .map((to) => ({ to, title, body, data }));

  const chunks = expo.chunkPushNotifications(messages);
  for (const chunk of chunks) {
    await expo.sendPushNotificationsAsync(chunk);
  }
}
