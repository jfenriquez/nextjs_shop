import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import prisma from "./lib/prisma";
import bcryptjs from "bcryptjs";

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
    newUser: "/auth/new-account",
  },

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log({ auth });
      return true;
    },

    jwt({ token, user }) {
      console.log({ token, user });
      if (user) {
        token.data = user;
      }
      return token;
    },

    session({ session, token, user }) {
      session.user = token.data as unknown as typeof session.user;
      return session;
    },
  },

  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        console.log(email, password);

        // Buscar usuario por email
        const user = await prisma.user.findUnique({
          where: { email: email.toLocaleLowerCase() },
        });

        if (!user) {
          return null;
        }

        // Comparar contraseñas
        if (!bcryptjs.compareSync(password, user.password)) {
          return null;
        }
        /* if (!user.emailVerified) {
          throw new Error("Debes verificar tu cuenta antes de iniciar sesión");
        } */

        // Retornar user sin la contraseña
        const { password: _, ...rest } = user;
        console.log(rest);
        return rest;
      },
    }),
  ],

  trustHost: true,
};

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);
