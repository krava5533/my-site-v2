import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { MOCK_MODE } from "@/lib/config";

/**
 * AUTH CONFIGURATION
 * ----------------------------------------------------------------
 * MOCK_MODE=true: a single seeded admin user backed by env vars
 * (ADMIN_SEED_EMAIL / ADMIN_SEED_PASSWORD) — no database required.
 * MOCK_MODE=false: replace the `authorize` callback with a Prisma
 * lookup against the `User` model.
 * ----------------------------------------------------------------
 */

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        if (MOCK_MODE) {
          const seedEmail = process.env.ADMIN_SEED_EMAIL || "admin@luxestone.example";
          const seedPassword = process.env.ADMIN_SEED_PASSWORD || "change-me-immediately";
          if (credentials.email === seedEmail && credentials.password === seedPassword) {
            return { id: "mock-admin", name: "LuxeStone Admin", email: seedEmail };
          }
          return null;
        }

        // PRODUCTION MODE: replace with a Prisma lookup, e.g.
        // const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        // if (user && (await bcrypt.compare(credentials.password, user.password))) {
        //   return { id: user.id, name: user.name, email: user.email };
        // }
        void bcrypt; // keep import wired for production implementation
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as { id?: string }).id = token.id as string;
      return session;
    },
  },
};
