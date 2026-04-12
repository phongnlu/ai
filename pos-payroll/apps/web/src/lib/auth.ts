import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { connectDB } from '@repo/api/lib/db';

export const authOptions: NextAuthOptions = {
  secret: process.env['NEXTAUTH_SECRET'],
  providers: [
    GoogleProvider({
      clientId: process.env['GOOGLE_CLIENT_ID'] ?? '',
      clientSecret: process.env['GOOGLE_CLIENT_SECRET'] ?? '',
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await connectDB();
      return !!user.email;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/sign-in',
  },
};
