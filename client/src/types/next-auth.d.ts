import { AuthUser } from './user';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    user: AuthUser;
  }

  interface User extends AuthUser {
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends AuthUser {
    accessToken: string;
  }
}

declare module 'next-auth/adapters' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends AuthUser {}
}
