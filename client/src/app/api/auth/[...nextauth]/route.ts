import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import api from '@/lib/axios';
import { ENDPOINTS } from '@/lib/endpoints';
import { CLIENT_ENV } from '@/config/env';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        usernameOrEmail: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      /**
       * Authorize user credentials
       * @param credentials - User login credentials
       * @returns User object or null
       */
      async authorize(credentials) {
        try {
          if (!credentials?.usernameOrEmail || !credentials?.password) {
            return null;
          }

          const response = await api.post(ENDPOINTS.AUTH.LOGIN, {
            usernameOrEmail: credentials.usernameOrEmail,
            password: credentials.password,
          });

          const { accessToken, user } = response.data.data;

          if (!user?.uuid) {
            console.error('User UUID is missing from API response');
            return null;
          }

          if (user && accessToken) {
            return {
              id: user.uuid,
              uuid: user.uuid,
              email: user.email,
              accessToken: accessToken,
              username: user.username,
              avatarUrl: user.avatarUrl,
              isActive: user.isActive,
              otpVerifiedAt: user.otpVerifiedAt,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
            };
          }
          return null;
        } catch (error: unknown) {
          console.error('Auth error:', error);

          if (error && typeof error === 'object' && 'response' in error) {
            const axiosError = error as {
              response: { data?: { message?: string }; status: number };
            };
            const backendMessage = axiosError.response.data?.message;
            throw new Error(
              backendMessage || `Login failed (${axiosError.response.status})`
            );
          }

          throw new Error('Cannot connect to server. Please try again later.');
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: CLIENT_ENV.SESSION_MAX_AGE,
  },
  callbacks: {
    /**
     * JWT callback to add user data to token
     * @param token - JWT token
     * @param user - User object
     * @returns Updated token
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        if (!user.uuid) {
          throw new Error('User UUID is required');
        }

        token.accessToken = user.accessToken;
        token.uuid = user.uuid;
        token.username = user.username;
        token.avatarUrl = user.avatarUrl;
        token.isActive = user.isActive;
        token.otpVerifiedAt = user.otpVerifiedAt;
        token.createdAt = user.createdAt;
        token.updatedAt = user.updatedAt;
      }
      return token;
    },
    /**
     * Session callback to add user data to session
     * @param session - User session
     * @param token - JWT token
     * @returns Updated session
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token) {
        if (!token.uuid) {
          throw new Error('Token UUID is required');
        }

        session.accessToken = token.accessToken;
        session.user.uuid = token.uuid;
        session.user.name = token.username;
        session.user.avatarUrl = token.avatarUrl;
        session.user.isActive = token.isActive;
        session.user.otpVerifiedAt = token.otpVerifiedAt;
        session.user.createdAt = token.createdAt;
        session.user.updatedAt = token.updatedAt;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  debug: CLIENT_ENV.IS_DEV,
});

export { handler as GET, handler as POST };
