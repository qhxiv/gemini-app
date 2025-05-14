"use server";

import { GoogleGenAI } from "@google/genai";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createChat,
  createContent,
  createPart,
  getAllContents,
  getAllparts,
} from "@/lib/data";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey });
const model = "gemini-2.0-flash";

export async function generateTitle(message: string) {
  const response = await ai.models.generateContent({
    model,
    contents: `Summarize this sentence in 3-4 words: ${message}, in plain text`,
  });

  return response.text;
}

export async function getNewResponse(contents: string) {
  const response = await ai.models.generateContent({
    model,
    contents,
  });

  return response.text;
}

export async function getResponseInChat(chatId: number, message: string) {
  const sentContent = await createContent(chatId, "user");
  createPart(sentContent.id, message);

  const contents = await getAllContents(chatId);

  const history = await Promise.all(
    contents.map(async (content) => {
      const allParts = await getAllparts(content.id);
      const parts = allParts.map((part) => ({ text: part.text }));

      return {
        role: content.role,
        parts,
      };
    }),
  );

  const chat = ai.chats.create({ model, history });

  const response = await chat.sendMessage({ message });
  const responseText = response.text;
  if (!responseText) throw new Error("Failed to get response from gemini");

  const newContent = await createContent(chatId, "model");
  createPart(newContent.id, responseText);

  revalidatePath(`/chat/${chatId}`);

  return responseText;
}

export async function createNewChat(message: string) {
  const title = await generateTitle(message);
  if (!title) throw new Error("Failed to get title of the chat");

  // TODO: replace with current userId after completing the auth part
  const chat = await createChat(1, title);
  const contentSend = await createContent(chat.id, "user");
  createPart(contentSend.id, message);

  // Get new response
  const contentResponse = await createContent(chat.id, "model");

  const newResponse = await getNewResponse(message);
  if (!newResponse) throw new Error("Failed to get response from Gemini");

  console.log(newResponse);
  createPart(contentResponse.id, newResponse);

  revalidatePath("/");
  redirect(`/chat/${chat.id}`);
}
