'use client';

import { signOut, useSession } from 'next-auth/react';

export function Header() {
  const { data: session } = useSession();
  const name = session?.user?.name ?? '';
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header style={{
      height: 52,
      background: '#fff',
      borderBottom: '1px solid var(--gray-200)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 20px',
      gap: 12,
      flexShrink: 0,
    }}>
      {name && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--primary-light)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700,
          }}>{initials}</div>
          <span style={{ fontSize: 13, color: 'var(--gray-700)', fontWeight: 500 }}>{name}</span>
        </div>
      )}
      <button
        onClick={() => signOut({ callbackUrl: '/sign-in' })}
        style={{
          fontSize: 12.5, padding: '5px 12px',
          borderRadius: 6, border: '1px solid var(--gray-200)',
          background: '#fff', color: 'var(--gray-700)', fontWeight: 500,
        }}
      >
        Sign out
      </button>
    </header>
  );
}
