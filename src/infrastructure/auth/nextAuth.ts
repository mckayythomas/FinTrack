import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { Session, User } from "next-auth";
import google from "next-auth/providers/google";
import clientPromise from "../db/mongodb.connection";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session({ session, user }: { session: Session; user: User }) {
      if (session.user) {
        session.user.id = user.id!;
      }
      return session;
    },
  },
});
