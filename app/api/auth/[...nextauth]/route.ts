import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session }) {
      // upsert user in db
      const authUser = {
        email: session.user.email,
        name: session.user.name,
      };
      await prisma.users.upsert({
        where: { email: authUser.email },
        update: { ...authUser },
        create: { ...authUser },
      });
      const dbUser = await prisma.users.findUnique({
        where: { email: authUser.email },
      });
      session.user = dbUser;

      return session
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST};