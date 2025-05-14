import Markdown from "react-markdown";

import { fetchChatContents } from "@/lib/data";

import UserChat from "@/components/chat/user-chat";
import InformationInput from "@/components/information-input";

export default async function Page(props: {
  params: Promise<{ chatId: string }>;
}) {
  const params = await props.params;
  const chatId = params.chatId;

  const messages = await fetchChatContents(Number(chatId));

  return (
    <>
      <div className="mb-4 flex grow flex-col gap-y-4 overflow-auto">
        {messages.map((message) => (
          <div key={message.contentId}>
            {message.role === "user" ? (
              <UserChat message={message.text} />
            ) : (
              <Markdown>{message.text}</Markdown>
            )}
          </div>
        ))}
      </div>

      <InformationInput chatId={Number(chatId)} />
    </>
  );
}
