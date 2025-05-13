"use client";

import { useState } from "react";

import { Mic, SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function InformationInput() {
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
        <Button size="icon">
          <SendHorizonal />
        </Button>
      )}
    </div>
  );
}
