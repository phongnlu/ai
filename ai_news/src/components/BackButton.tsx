'use client';
import { useRouter } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => window.history.length > 1 ? router.back() : router.push('/')}
      className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
    >
      ← Back to Feed
    </button>
  );
}
