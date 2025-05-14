import { compareSync } from "bcrypt-ts";
import postgres from "postgres";
import { z } from "zod";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { User } from "@/lib/definitions";

const sql = postgres({
  password: process.env.POSTGRES_PASSWORD,
  username: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
});

async function getUser(username: string): Promise<User | undefined> {
  try {
    const user = await sql<
      User[]
    >`SELECT * FROM user WHERE username=${username}`;
    return user[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      authorize: async (credentials) => {
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

          try {
            const passwordMatch = compareSync(user.password, password);
            if (passwordMatch) return user;
          } catch (err) {
            console.log(err);
          }

          return null;
        }

        return null;
      },
    }),
  ],
});
