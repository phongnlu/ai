'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '▦' },
  { href: '/employees', label: 'Employees', icon: '👤' },
  { href: '/payroll', label: 'Payroll', icon: '💵' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 220,
      minHeight: '100vh',
      background: '#fff',
      borderRight: '1px solid var(--gray-200)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--gray-100)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'var(--primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff',
          }}>P</div>
          <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--gray-900)' }}>POS Payroll</span>
        </div>
      </div>

      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: 9,
              padding: '7px 10px', borderRadius: 6, marginBottom: 2,
              fontSize: 13.5, fontWeight: active ? 600 : 400,
              color: active ? 'var(--primary)' : 'var(--gray-700)',
              background: active ? 'var(--primary-light)' : 'transparent',
              transition: 'background .15s',
            }}>
              <span style={{ fontSize: 14 }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--gray-100)', fontSize: 12, color: 'var(--gray-400)' }}>
        California Payroll System
      </div>
    </aside>
  );
}
