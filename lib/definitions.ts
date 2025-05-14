import { Content } from "@google/genai";

export type User = {
  id: number;
  username: string;
  password: string;
};

export type Chat = {
  id: number;
  userId: number;
  title: string;
};
