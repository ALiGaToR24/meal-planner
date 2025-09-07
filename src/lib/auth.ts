import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/mongo";

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // (опционально) пускаем только ADMIN_EMAIL
        const allowed = process.env.ADMIN_EMAIL?.toLowerCase();
        if (allowed && allowed !== email.toLowerCase()) return null;

        const dbo = await db();
        const user = await dbo.collection("users").findOne({ email });
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        // ВАЖНО: вернуть id — он уйдёт в JWT и дальше в session
        return { id: user._id.toString(), email: user.email };
      },
    }),
  ],
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      // при логине кладём id пользователя в токен
      if (user) token.uid = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      // прокидываем id в session.user.id (для server-side)
      if (session.user && token?.uid) (session.user as any).id = token.uid as string;
      return session;
    },
  },
};
