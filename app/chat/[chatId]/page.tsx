import { GoogleGenAI } from "@google/genai";

import UserChat from "@/components/chat/user-chat";

export default async function Page(props: {
  params: Promise<{ chatId: string }>;
}) {
  const params = await props.params;
  const chatId = params.chatId;

  return (
    <div>
      <UserChat message="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam vel, similique sapiente eaque nemo, quaerat impedit accusantium ratione excepturi veniam rerum, necessitatibus consequuntur nulla debitis optio autem tempore deleniti sed." />
    </div>
  );
}
