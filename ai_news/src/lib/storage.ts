import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { Article } from '@/types/article';

const BUCKET = process.env.S3_BUCKET;
const s3 = BUCKET
  ? new S3Client({ region: process.env.AWS_REGION ?? 'us-west-2' })
  : null;

// ── Articles ──────────────────────────────────────────────────────────────────

export async function loadArticles(): Promise<Article[]> {
  if (s3 && BUCKET) {
    try {
      const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: 'articles.json' }));
      const body = await res.Body?.transformToString();
      return body ? (JSON.parse(body) as Article[]) : [];
    } catch (err: unknown) {
      if ((err as { name?: string }).name === 'NoSuchKey') return [];
      throw err;
    }
  }
  const filePath = path.join(process.cwd(), 'data', 'articles.json');
  try {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Article[];
  } catch { return []; }
}

export async function saveArticles(articles: Article[]): Promise<void> {
  if (s3 && BUCKET) {
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: 'articles.json',
      Body: JSON.stringify(articles, null, 2),
      ContentType: 'application/json',
    }));
    return;
  }
  const filePath = path.join(process.cwd(), 'data', 'articles.json');
  fs.writeFileSync(filePath, JSON.stringify(articles, null, 2), 'utf-8');
}

// ── Push Subscriptions ────────────────────────────────────────────────────────

export interface PushSubscriptionRecord {
  endpoint: string;
  keys: { p256dh: string; auth: string };
  language?: string;
}

export async function loadSubscriptions(): Promise<PushSubscriptionRecord[]> {
  if (s3 && BUCKET) {
    try {
      const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: 'subscriptions.json' }));
      const body = await res.Body?.transformToString();
      return body ? (JSON.parse(body) as PushSubscriptionRecord[]) : [];
    } catch (err: unknown) {
      if ((err as { name?: string }).name === 'NoSuchKey') return [];
      throw err;
    }
  }
  const filePath = path.join(process.cwd(), 'data', 'subscriptions.json');
  try {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as PushSubscriptionRecord[];
  } catch { return []; }
}

export async function saveSubscriptions(subs: PushSubscriptionRecord[]): Promise<void> {
  if (s3 && BUCKET) {
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: 'subscriptions.json',
      Body: JSON.stringify(subs, null, 2),
      ContentType: 'application/json',
    }));
    return;
  }
  const filePath = path.join(process.cwd(), 'data', 'subscriptions.json');
  fs.writeFileSync(filePath, JSON.stringify(subs, null, 2), 'utf-8');
}

// ── RSS Feed XML ──────────────────────────────────────────────────────────────

export async function loadFeedXml(): Promise<string | null> {
  if (s3 && BUCKET) {
    try {
      const res = await s3.send(new GetObjectCommand({ Bucket: BUCKET, Key: 'feed.xml' }));
      return (await res.Body?.transformToString()) ?? null;
    } catch (err: unknown) {
      if ((err as { name?: string }).name === 'NoSuchKey') return null;
      throw err;
    }
  }
  const filePath = path.join(process.cwd(), 'public', 'feed.xml');
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}

export async function saveFeedXml(xml: string): Promise<void> {
  if (s3 && BUCKET) {
    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: 'feed.xml',
      Body: xml,
      ContentType: 'application/rss+xml; charset=utf-8',
    }));
    return;
  }
  const filePath = path.join(process.cwd(), 'public', 'feed.xml');
  fs.writeFileSync(filePath, xml, 'utf-8');
}
