import type { Metadata, Viewport } from 'next';
import './globals.css';
import PWAInstallBanner from '@/components/PWAInstallBanner';

export const metadata: Metadata = {
  title: 'AI News Feed',
  description: 'Curated AI news with Claude-powered summaries',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'AI News' },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var mq = window.matchMedia('(prefers-color-scheme: dark)');
                function applyAuto() {
                  if ((localStorage.getItem('theme') || 'system') === 'system') {
                    document.documentElement.classList.toggle('dark', mq.matches);
                  }
                }
                var t = localStorage.getItem('theme');
                if (t === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (!t || t === 'system') {
                  if (mq.matches) document.documentElement.classList.add('dark');
                  // addEventListener with addListener fallback for older iOS
                  try { mq.addEventListener('change', applyAuto); }
                  catch(e) { try { mq.addListener(applyAuto); } catch(e2) {} }
                  // Re-check when PWA is foregrounded (iOS doesn't fire change event while backgrounded)
                  document.addEventListener('visibilitychange', function() {
                    if (document.visibilityState === 'visible') applyAuto();
                  });
                }
              })();
            `,
          }}
        />
      </head>
      <body className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200">
        {children}
        <PWAInstallBanner />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
                function clearBadge() {
                  if (document.visibilityState === 'visible') {
                    navigator.serviceWorker.ready.then(function(reg) {
                      reg.active && reg.active.postMessage('clear-badge');
                    });
                    if ('clearAppBadge' in navigator) navigator.clearAppBadge();
                  }
                }
                document.addEventListener('visibilitychange', clearBadge);
                clearBadge();
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
