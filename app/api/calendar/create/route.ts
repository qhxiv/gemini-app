import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { text, startTime, endTime } = await req.json();
  const access_token = req.cookies.get("access_token")?.value;

  if (!access_token) {
    return NextResponse.json({ success: false, error: "Chưa đăng nhập Google" });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token });

  const calendar = google.calendar({ version: "v3", auth });



const event = {
  summary: "Lịch họp tự động",
  description: text,
  start: {
    dateTime: startTime,
    timeZone: "Asia/Ho_Chi_Minh",
  },
  end: {
    dateTime: endTime,
    timeZone: "Asia/Ho_Chi_Minh",
  },
};


  try {
    const res = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return NextResponse.json({
      success: true,
      summary: res.data.summary || "Tạo sự kiện thành công",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
