import NextAuth from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import GoogleProvider from "next-auth/providers/google";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const googleId = process.env.GOOGLE_ID || "";
  const googleSecret = process.env.GOOGLE_SECRET || "";
  const providers = [
    GoogleProvider({
      clientId: googleId,
      clientSecret: googleSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ];

  return await NextAuth(req, res, {
    providers,
    secret: process.env.SECRET,
    jwt: {
      secret: process.env.SECRET,
    },
    session: {
      // This is the default. The session is saved in a cookie and never persisted anywhere.
      strategy: "jwt",
    },
    // Enable debug messages in the console if you are having problems
    debug: true,

    pages: {
      signIn: "/auth/signin",
      error: "/auth/signin",
      newUser: "/auth/new-user",
    },

    callbacks: {
      async session({ session, token }) {
        // Send properties to the client, like an access_token from a provider.
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.idToken = token.idToken as string;
        session.provider = token.provider as string;
        session.id = token.id as string;
        return session;
      },
      async jwt({ token, user, account }) {
        // Persist the OAuth access_token to the token right after signin
        if (account) {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
          token.idToken = account.id_token;
          token.provider = account.provider;
        }
        if (user) {
          token.id = user.id.toString();
        }
        return token;
      },
    },
  });
}