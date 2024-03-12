import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SetToken } from "@/hooks/SetToken";

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
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account && !token.accessToken) {
        token.accessToken = account.access_token as string;
        SetToken.setState({ initial_token: token.accessToken });
        console.log(SetToken.getState().initial_token);
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session && user && token) {
        session.name = user.name as string;
        session.email = user.email as string;
        session.image = user.image as string;
        const initialToken = SetToken.getState().initial_token;
        console.log(initialToken);
        session.access_token = initialToken;
        console.log(session.access_token);
      }
      return session;
    },
  },
};
