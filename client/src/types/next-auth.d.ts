declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      uuid: string; // Required, never null - primary identifier
      email: string;
      name?: string;
    };
  }

  interface User {
    uuid: string; // Required, never null - primary identifier
    email: string;
    name?: string;
    accessToken?: string;
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    uuid: string; // Required, never null
    username?: string;
  }
}

// Override NextAuth's default User type to use uuid instead of id
declare module "next-auth/adapters" {
  interface User {
    uuid: string;
    email: string;
    name?: string;
  }
}
