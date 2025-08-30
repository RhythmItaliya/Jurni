import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { CLIENT_ENV } from "@/config/env";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const response = await axios.post(`${CLIENT_ENV.API_URL}/auth/login`, {
            email: credentials.email,
            password: credentials.password,
          });

          const { accessToken, user } = response.data;

          // Ensure UUID is never null
          if (!user?.uuid) {
            console.error('User UUID is missing from API response');
            return null;
          }

          if (user && accessToken) {
            return {
              id: user.uuid, 
              uuid: user.uuid,
              email: user.email,
              name: user.username,
              accessToken: accessToken,
              username: user.username,
            };
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: CLIENT_ENV.SESSION_MAX_AGE, // Use environment variable
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        // Ensure UUID is always present
        if (!user.uuid) {
          throw new Error('User UUID is required');
        }
        
        token.accessToken = user.accessToken;
        token.uuid = user.uuid;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        // Ensure UUID is always present
        if (!token.uuid) {
          throw new Error('Token UUID is required');
        }
        
        session.accessToken = token.accessToken;
        session.user.uuid = token.uuid; // Use UUID directly
        session.user.name = token.username;
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
