import "server-only";

import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(256) });
const passwordFallbackHash = "$2a$12$W25uV8XnuYddP5H5xGXPAOSeuFFo3MF5Ai4Wa97hMURyF6YwtjP0y";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET,
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  jwt: { maxAge: 60 * 60 * 8 },
  providers: [CredentialsProvider({
    name: "Administrateur",
    credentials: { email: { label: "Email", type: "email" }, password: { label: "Mot de passe", type: "password" } },
    async authorize(credentials) {
      const parsed = credentialsSchema.safeParse(credentials);
      if (!parsed.success) return null;
      try {
        const email = parsed.data.email.toLowerCase();
        const admin = await prisma.adminUser.findUnique({ where: { email } });
        const passwordMatches = await bcrypt.compare(parsed.data.password, admin?.passwordHash ?? passwordFallbackHash);
        if (!admin || !admin.active || !passwordMatches) return null;
        return { id: admin.id, email: admin.email, name: "Administrateur" };
      } catch (error) {
        console.error("Admin authentication lookup failed.", error instanceof Error ? error.message : "Unknown error");
        return null;
      }
    },
  })],
};
