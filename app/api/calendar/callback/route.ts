// NHẬN MÃ TỪ GOOGLE – đổi lấy access_token
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
  );

  const { tokens } = await oauth2Client.getToken(code!);

  const response = NextResponse.redirect("http://localhost:3000");
  response.cookies.set("access_token", tokens.access_token!, {
    path: "/",
    httpOnly: true,
  });

  return response;
}
