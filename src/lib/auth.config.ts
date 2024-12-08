import GoogleProvider from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";


export default { 
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
      async signIn({ user, account, profile, email, credentials }) {
        return true;
      },
      async session({ session, user }) {
        return session;
      }
    }
} satisfies NextAuthConfig