"use client";

import { useState } from "react";

import { usePathname } from "next/navigation";

import { Mic, SendHorizonal } from "lucide-react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}


import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef } from "react";

//  Hàm tách ngày và giờ
function extractDatetimeFromText(text: string) {
  // Regex khớp định dạng: từ .. giờ đến .. giờ ngày .. tháng .. năm ..
  const rangeRegex = /từ\s+(\d{1,2})\s+giờ\s+đến\s+(\d{1,2})\s+giờ.*?ngày\s+(\d{1,2})\s+tháng\s+(\d{1,2})\s+năm\s+(\d{4})/i;

  const match = text.match(rangeRegex);
  if (match) {
    const [, hourStart, hourEnd, day, month, year] = match.map(Number);
    const start = new Date(year, month - 1, day, hourStart);
    const end = new Date(year, month - 1, day, hourEnd);

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  }

  // Nếu không khớp "từ ... đến ..." thì thử với dạng đơn lẻ: "lúc 9 giờ ngày 28 tháng 5 năm 2025"
  const singleRegex = /lúc\s+(\d{1,2})\s+(?:giờ|giờ sáng|giờ chiều)?\s*(?:ngày)?\s*(\d{1,2})\s+(?:tháng)\s+(\d{1,2})\s+(?:năm)\s+(\d{4})/i;
  const match2 = text.match(singleRegex);
  if (match2) {
    const [, hour, day, month, year] = match2.map(Number);
    const start = new Date(year, month - 1, day, hour);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    return {
      start: start.toISOString(),
      end: end.toISOString(),
    };
  }

  // Nếu không khớp gì thì trả về null
  return null;
}


type ChatMessage = {
  role: "user" | "gemini";
  content: string;
};

type InformationInputProps = {
  onSend: (message: string) => void;
};

export default function InformationInput({ chatId }: { chatId?: number }) {
  const pathname = usePathname();

  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  useEffect(() => {
    if (typeof window === "undefined") return;

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
    };

    recognition.onerror = (e: any) => {
      console.error("🎤 Mic lỗi:", e.error);
    };

    recognitionRef.current = recognition;
  }, []);

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

  // ✅ Hàm gửi nội dung (phân tích và tạo lịch nếu cần)
  const handleSend = async (text: string) => {
    console.log("👉 Người dùng nói/gõ:", text);

    if (!text.trim()) return;

    const lower = text.toLowerCase();
    const isCalendar = lower.includes("lịch") && lower.includes("calendar");
    const datetime = extractDatetimeFromText(text);

    setMessages((prev) => [...prev, { role: "user", content: text }]);

    if (isCalendar && datetime) {
      try {
        const res = await fetch("/api/calendar/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            summary: "Lịch tự động",
            description: text,
            startTime: datetime.start,
            endTime: datetime.end,
          }),
        });

        const data = await res.json();

        if (data.success || data.summary) {
          setMessages((prev) => [
            ...prev,
            { role: "gemini", content: `📅 Đã tạo sự kiện trên Google Calendar: ${data.summary || "Lịch mới"}` },
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

    // ✅ Nếu không phải lịch, gửi đến Gemini API
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
    setValue("");
  };

  return (
    <div className="flex flex-col gap-y-4 max-w-2xl mx-auto w-full">
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
          <Button size="icon" onClick={() => handleSend(value)}>
            <SendHorizonal />
          </Button>
        )}
      </div>
    </div>
  );
}
