"use server";

import { GoogleGenAI } from "@google/genai";
import { CreateChatParameters } from "@google/genai";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey });

export async function send(
  { model = "gemini-2.0-flash", history }: CreateChatParameters,
  message: string,
) {
  const chat = ai.chats.create({
    model,
    history,
  });

  const response = await chat.sendMessage({ message });
  return response.text;
}
