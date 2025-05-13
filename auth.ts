import postgres from "postgres";
import { z } from "zod";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { User } from "@/lib/definitions";

const sql = postgres({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USRENAME,
  password: process.env.POSTGRES_PASSWORD,
});

async function getUser(username: string): Promise<User | undefined> {
  try {
    const users = await sql<
      User[]
    >`SELECT * FROM user WHERE username=${username}`;
    return users[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            username: z.string(),
            password: z.string(),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const user = await getUser(username);
          if (!user) return null;
          // const passwordMatch = await bcrypt.compare(password, user.password);

          // if (passwordMatch) return user;
        }

        return null;
      },
    }),
  ],
});
