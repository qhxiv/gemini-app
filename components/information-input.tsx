"use client";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

import { createNewChat, getResponseInChat } from "@/lib/server-action";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, SendHorizonal } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

type ChatMessage = {
  role: "user" | "gemini";
  content: string;
};

type InformationInputProps = {
  onSend: (message: string) => void;
};

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });


export default function InformationInput({ chatId }: { chatId?: number }) {
  const pathname = usePathname();

  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);// lưu lại các tin nhắn
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  // ae thay bằng key của ae chỗ your api key
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=` + apiKey;

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Kiểm tra xem trình duyệt có hỗ trợ Web Speech API không
    // Nếu không hỗ trợ thì thông báo cho người dùng
    // Nếu có thì khởi tạo đối tượng SpeechRecognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

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
      handleSend(transcript);


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

    recognition.onerror = (e: any) => {
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

  const handleSend = async (text: string) => {
    console.log("👉 Người dùng nói/gõ:", text);

    if (!text.trim()) return;

    const lower = text.toLowerCase();
    // 👉 Tích hợp calendar
    if (lower.includes("lịch") && lower.includes("calendar")) {
      setMessages((prev) => [...prev, { role: "user", content: text }]);

      try {
        const res = await fetch("/api/calendar/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });


        const data = await res.json();

        if (data.success) {
          setMessages((prev) => [
            ...prev,
            { role: "gemini", content: `📅 Đã tạo sự kiện trên Google Calendar: ${data.summary}` },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: "gemini", content: `❌ Không thể tạo sự kiện: ${data.error}` },
          ]);
        }
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          { role: "gemini", content: `⚠️ Không thể gọi API lịch: ${err.message}` },
        ]);
      }

      setValue("");
      return;
    }

    // ✅ Nếu không phải đặt lịch → xử lý Gemini bình thường
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setValue("");

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text }] }],
      }),
    });

    const data = await res.json();
    const reply =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "(Không có phản hồi)";
    setMessages((prev) => [...prev, { role: "gemini", content: reply }]);
  };

  return (
    <div className="flex flex-col gap-y-4 max-w-2xl mx-auto w-full">
      {/* 👇 BƯỚC 3: Thêm vùng hiển thị lịch sử chat */}
      <div className="border rounded p-4 bg-gray-50 min-h-[200px] max-h-[300px] overflow-y-auto space-y-2 mb-2 w-full">
        {messages.length === 0 && (
          <p className="text-sm text-gray-400">Chưa có cuộc trò chuyện nào...</p>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className="text-sm">
            <strong className={msg.role === "user" ? "text-blue-600" : "text-green-700"}>
              {msg.role === "user" ? "🧑 Bạn" : "🤖 Gemini"}:
            </strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex items-end justify-center gap-x-2">

        {/* Nút chọn ảnh */}
        <input
          type="file"
          accept="image/*"
          id="image-upload"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              console.log("📁 File được chọn:", file.name);
              setSelectedImage(file);
            }
          }}
        />
        <Button
          size="icon"
          variant="outline"
          onClick={() => document.getElementById("image-upload")?.click()}
          title="Chọn ảnh"
        >          📁
        </Button>



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
          <Button
            size="icon"
            onClick={async () => {
              let fileuri = null
              let fileMimeType = null
              if(selectedImage != null){
                // imageResponse(value, selectedImage)
                console.log("Da co anh")

                const file = await ai.files.upload({
                  file: selectedImage,
                  config: { mimeType: selectedImage.type },
                });

                fileuri = file.uri
                fileMimeType = file.mimeType
              }
              if (pathname === "/") createNewChat(value, fileuri, fileMimeType);
              else if (chatId) getResponseInChat(chatId, value, fileuri, fileMimeType)

              setValue("");
            }}
          >
            <SendHorizonal />
          </Button>
        )}
      </div>
    </div>
  );
}
