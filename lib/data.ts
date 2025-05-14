import postgres from "postgres";

import { Chat, Content, Message, Part, role } from "@/lib/definitions";

const sql = postgres({
  password: process.env.POSTGRES_PASSWORD,
  username: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
});

// Chat
export async function fetchChat() {
  try {
    const data = await sql<Chat[]>`SELECT * FROM chat`;
    return data;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch chats.");
  }
}

export async function createChat(userId: number, title: string) {
  try {
    if (!title) throw new Error("Failed to create chat");

    const chat = await sql<
      Chat[]
    >`INSERT INTO chat ("userId", "title") VALUES (${userId}, ${title}) RETURNING *`;

    return chat[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to create chat");
  }
}

// Content
export async function createContent(chatId: number, role: role) {
  try {
    const content = await sql<
      Content[]
    >`INSERT INTO content ("chatId", role) VALUES (${chatId}, ${role}) RETURNING *`;

    return content[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to create content");
  }
}

export async function getAllContents(chatId: number) {
  try {
    const contents = await sql<Content[]>`
      SELECT * FROM content
      WHERE content."chatId" = ${chatId}
    `;

    return contents;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to create content");
  }
}

export async function fetchChatContents(chatId: number): Promise<Message[]> {
  try {
    const contents = await sql<Message[]>`
      SELECT content.id AS "contentId", content.role, part.text FROM part
      INNER JOIN content ON part."contentId" = content.id
      WHERE content."chatId" = ${chatId};
    `;

    return contents;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch chat contents");
  }
}

// Part
export async function createPart(contentId: number, text: string) {
  try {
    const part = await sql<
      Part[]
    >`INSERT INTO part ("contentId", text) VALUES (${contentId}, ${text}) RETURNING *`;

    return part[0];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to create part");
  }
}

export async function getAllparts(contentId: number) {
  try {
    const parts = await sql<Part[]>`
      SELECT * FROM part
      WHERE part."contentId" = ${contentId}
    `;

    return parts;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to get all parts");
  }
}
