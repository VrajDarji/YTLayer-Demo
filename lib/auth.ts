import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.channel-memberships.creator https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtubepartner https://www.googleapis.com/auth/youtubepartner-channel-audit",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account && token) {
        token.accessToken = account.access_token as string;
        console.log(account.id_token);
        console.log(token.accessToken);
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session && user && token) {
        session.user = user;
        session.token = token.accessToken;
        console.log(session.token);
      }
      return session;
    },
  },
};
