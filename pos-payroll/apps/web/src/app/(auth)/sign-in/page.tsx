'use client';

import { signIn } from 'next-auth/react';

export default function SignInPage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EEF2FF 0%, #F9FAFB 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: '#fff', borderRadius: 14,
        boxShadow: '0 4px 24px rgba(0,0,0,.08)',
        padding: '40px 36px', width: '100%', maxWidth: 380,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'var(--primary)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4,
        }}>P</div>

        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)' }}>POS Payroll</h1>
        <p style={{ fontSize: 13.5, color: 'var(--gray-500)', textAlign: 'center', marginBottom: 16 }}>
          California employee payroll management
        </p>

        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, padding: '10px 16px', borderRadius: 8,
            border: '1px solid var(--gray-200)', background: '#fff',
            fontSize: 14, fontWeight: 500, color: 'var(--gray-700)',
            boxShadow: 'var(--shadow)', cursor: 'pointer',
            transition: 'box-shadow .15s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
          onMouseOut={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow)')}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 12, textAlign: 'center' }}>
          Access restricted to authorized personnel only
        </p>
      </div>
    </main>
  );
}
