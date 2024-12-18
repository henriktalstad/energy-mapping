import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { AdapterUser } from "next-auth/adapters"
import prisma from "./db";
import { User } from ".prisma/client";
import { signInSchema } from "./zodSchemas";
import { ZodError } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const { email, password } = await signInSchema.parseAsync(credentials);
          
          const user = await getUserFromDb(email, password);
  
          if (!user) {
            console.log("Invalid credentials");
            return null;
          }
  
          return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName };
        } catch (error) {
          if (error instanceof ZodError) {
            console.error("Validation error:", error.errors);
          } else {
            console.error("Authentication error:", error);
          }
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as AdapterUser & User;
      return session;
    },
  },
});

async function getUserFromDb(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { 
        email,
        password, 
      },
    });
    return user;
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}

