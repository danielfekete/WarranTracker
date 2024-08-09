import Credentials from "next-auth/providers/credentials";
import NextAuth, { DefaultSession } from "next-auth";
import { authConfig } from "./auth.config";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./app/lib/db";
import { getUserByEmail, getUserById } from "./app/data/user";
import { loginSchema } from "./app/schemas/login";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
} from "./routes";
// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { JWT } from "next-auth/jwt";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      role: "ADMIN" | "USER";
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    role?: UserRole;
  }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }
        const { email, password } = validatedFields.data;

        const user = await getUserByEmail(email);

        if (!user || !user.password) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(password, user.password);

        if (passwordMatches) {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth;

      const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
      const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
      const isAuthRoute = authRoutes.includes(nextUrl.pathname);

      if (isApiAuthRoute) {
        return true;
      }

      if (isAuthRoute) {
        if (isLoggedIn) {
          // Redirect to home
          return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return true;
      }

      return isLoggedIn || isPublicRoute;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        // Logged out
        return token;
      }

      const user = await getUserById(token.sub);

      if (!user) {
        return token;
      }

      console.log(user);

      token.role = user.role;
      return token;
    },
    async signIn({ user: { id }, account }) {
      // Enable OAuth sign in without email verification
      if (account?.provider !== "credentials") {
        return true;
      }

      const user = await getUserById(id);

      // Prevent sign in without email verification
      if (!user || !user.emailVerified) {
        return false;
      }

      // TODO: ADD 2FA check

      return true;
    },
  },
});
