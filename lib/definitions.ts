// DB data type
export type role = "user" | "model";

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

export type Content = {
  id: number;
  chatId: number;
  role: role;
};

export type Part = {
  id: number;
  contentid: number;
  text: string;
};

// Other
export type Message = {
  contentId: number;
  role: role;
  text: string;
};
