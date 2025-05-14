"use client";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import { testSend } from "@/app/server-action";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function InformationInput() {
  const [value, setValue] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);


  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  // ae thay bằng key của ae chỗ your api key
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=your_api_key`;
  
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Trình duyệt không hỗ trợ mic.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "vi-VN";
    recognition.interimResults = false;

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      console.log("🗣️ Bạn nói:", transcript);
      setValue(transcript);

      // Gửi đến Gemini API
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: transcript }] }],
        }),
      });

      const data = await res.json();
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "(Không có phản hồi)";
      console.log("🤖 Gemini trả lời:", reply);
    };

    recognition.onerror = (e:any) => {
      console.error("🎤 Mic lỗi:", e.error);
    };

    recognitionRef.current = recognition;
  }, []);

  // Xử lý khi nhấn nút Mic
  const toggleMic = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (listening) {
      recognition.stop();
      setListening(false);
    } else {
      recognition.start();
      setListening(true);
    }
  };

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
        <Button size="icon" onClick={toggleMic}>
          <Mic />
        </Button>
      ) : (
        <Button size="icon" onClick={() => testSend(value)}>
          <SendHorizonal />
        </Button>
      )}
    </div>
  );
}
