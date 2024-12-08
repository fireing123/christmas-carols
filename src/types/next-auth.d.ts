import NextAuth, { DefaultSession } from "next-auth";

    // this process is know as module augmentation
declare module "next-auth" {
    interface Session {
        user: {
            userId: string;
        } & DefaultSession["user"];
    }
}