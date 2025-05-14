// ĐĂNG NHẬP GOOGLE – chuyển hướng đến Google OAuth
import { google } from "googleapis";
import { NextRequest, NextResponse } from "next/server";

const client_id = process.env.GOOGLE_CLIENT_ID!;
const client_secret = process.env.GOOGLE_CLIENT_SECRET!;
const redirect_uri = process.env.GOOGLE_REDIRECT_URI!;

const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);

export async function GET(req: NextRequest) {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/calendar.events"],
  });

  return NextResponse.redirect(url);
}
