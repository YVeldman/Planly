import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    familyId: string;
    role: string;
    color: string;
  }

  interface Session {
    user: {
      id: string;
      familyId: string;
      role: string;
      color: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    familyId?: string;
    role?: string;
    color?: string;
  }
}
