'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@repo/ui';

export default function SignInPage() {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 16,
      }}
    >
      <h1>POS Payroll</h1>
      <p>Sign in to manage employee payroll</p>
      <Button onPress={() => signIn('google', { callbackUrl: '/dashboard' })}>
        Sign in with Google
      </Button>
    </main>
  );
}
