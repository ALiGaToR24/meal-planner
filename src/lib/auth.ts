import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/mongo";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const parsed = schema.safeParse(credentials);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        // Разрешим вход только твоему email (опционально)
        const allowed = process.env.ADMIN_EMAIL;
        if (allowed && allowed.toLowerCase() !== email.toLowerCase()) return null;

        const dbo = await db();
        const user = await dbo.collection("users").findOne({ email });
        if (!user?.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return { id: user._id.toString(), email: user.email };
      }
    })
  ],
  pages: { signIn: "/login" }
};
