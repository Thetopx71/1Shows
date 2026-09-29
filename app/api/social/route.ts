import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    discordUrl: process.env.DISCORD_INVITE_URL?.trim() || 'https://discord.com',
    telegramUrl: process.env.TELEGRAM_INVITE_URL?.trim() || 'https://t.me',
  });
}
