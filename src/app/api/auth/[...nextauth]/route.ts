import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: 'jwt' as const,
    maxAge: 90 * 24 * 60 * 60, // 90 days
    updateAge: 24 * 60 * 60,   // refresh cookie daily on activity
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // If this is the first time signing in, create or update user in database
      if (account && profile?.email) {
        try {
          // First, try to find existing user
          let user = await prisma.users.findUnique({
            where: { user_email: profile.email },
          });

          if (user) {
            // Update existing user
            user = await prisma.users.update({
              where: { user_email: profile.email },
              data: {
                user_name: profile.name || '',
                updated_at: new Date(),
              },
            });
          } else {
            // Create new user
            user = await prisma.users.create({
              data: {
                user_email: profile.email,
                user_name: profile.name || '',
                password_hash: '', // Not used for OAuth
                created_at: new Date(),
                updated_at: new Date(),
                scopes: ['user'], // Default scope
              },
            });
          }
          
          token.userId = user.user_id;
          token.scopes = user.scopes;
        } catch (error) {
          console.error('Error creating/updating user:', error);
          token.scopes = ['user']; // Fallback
        }
      } else if (token.email) {
        // For subsequent requests, fetch current scopes
        try {
          const user = await prisma.users.findUnique({
            where: { user_email: token.email },
            select: { user_id: true, scopes: true },
          });
          
          if (user) {
            token.userId = user.user_id;
            token.scopes = user.scopes;
          }
        } catch (error) {
          console.error('Error fetching user scopes:', error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.userId as number;
        session.user.scopes = token.scopes as string[];
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };