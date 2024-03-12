import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    name: string;
    email: string;
    image: string;
    access_token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
  }
}
