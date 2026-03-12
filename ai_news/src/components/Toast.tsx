'use client';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'info' | 'error';
  onDismiss: () => void;
}

const BORDER: Record<string, string> = {
  success: 'border-l-4 border-green-500',
  info: 'border-l-4 border-blue-500',
  error: 'border-l-4 border-red-500',
};

export default function Toast({ message, type, onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-sm text-gray-800 dark:text-gray-100 animate-slide-up ${BORDER[type]}`}
    >
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} aria-label="Dismiss notification" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
