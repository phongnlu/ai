export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY as string;
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

if (!ANTHROPIC_API_KEY && process.env.NODE_ENV !== 'test') {
  console.warn('Warning: ANTHROPIC_API_KEY is not set.');
}
