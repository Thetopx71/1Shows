import { NextRequest, NextResponse } from 'next/server';

function getRecipientEmail() {
  return process.env.CONTACT_EMAIL?.trim() || '';
}

export async function GET() {
  return NextResponse.json({
    discordUrl: process.env.DISCORD_INVITE_URL?.trim() || 'https://discord.com',
    telegramUrl: process.env.TELEGRAM_INVITE_URL?.trim() || 'https://t.me',
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim();
    const topic = String(body?.topic || 'General Inquiry').trim();
    const message = String(body?.message || '').trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please fill in your name, email address, and message.' },
        { status: 400 }
      );
    }

    const recipient = getRecipientEmail();
    if (!recipient) {
      return NextResponse.json(
        {
          error:
            'Contact service is not configured yet. Please set CONTACT_EMAIL in environment variables.',
        },
        { status: 503 }
      );
    }

    const subject = `[1Shows] ${topic} — from ${name}`;

    // Deliver server-side via FormSubmit AJAX endpoint using CONTACT_EMAIL (kept hidden on server)
    try {
      await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            _subject: subject,
            topic,
            message,
          }),
        }
      );
    } catch {
      // Non-blocking server-side dispatch
    }

    return NextResponse.json({
      ok: true,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process contact request.' },
      { status: 500 }
    );
  }
}
