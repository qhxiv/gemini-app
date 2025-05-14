"use client";

import { useState } from "react";

import { usePathname } from "next/navigation";

import { Mic, SendHorizonal } from "lucide-react";

import { createNewChat, getResponseInChat } from "@/lib/server-action";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type InformationInputProps = {
  onSend: (message: string) => void;
};

export default function InformationInput({ chatId }: { chatId?: number }) {
  const pathname = usePathname();

  const [value, setValue] = useState("");

  return (
    <div className="flex items-end justify-center gap-x-2">
      <Textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder="Ask me anything"
        className="max-h-40 min-h-auto resize-none overflow-auto break-all"
      />

      {value.trim() === "" ? (
        <Button size="icon">
          <Mic />
        </Button>
      ) : (
        <Button
          size="icon"
          onClick={() => {
            if (pathname === "/") createNewChat(value);
            else if (chatId) getResponseInChat(chatId, value);

            setValue("");
          }}
        >
          <SendHorizonal />
        </Button>
      )}
    </div>
  );
}
