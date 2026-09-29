import { NextRequest, NextResponse } from 'next/server';

function getRecipientEmail() {
  return process.env.CONTACT_EMAIL?.trim() || '';
}

export async function GET() {
  const recipient = getRecipientEmail();
  return NextResponse.json({
    configured: Boolean(recipient),
    recipient: recipient || null,
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
            'Contact recipient email is not configured. Please set CONTACT_EMAIL in your environment variables.',
        },
        { status: 503 }
      );
    }

    const subject = `[1Shows] ${topic} — from ${name}`;
    const plainBody = `Name: ${name}\nEmail: ${email}\nSubject: ${topic}\n\nMessage:\n${message}`;
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(plainBody)}`;

    let deliveredViaServer = false;

    // Attempt delivery via FormSubmit AJAX endpoint using CONTACT_EMAIL
    try {
      const formSubmitRes = await fetch(
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

      if (formSubmitRes.ok) {
        const data = await formSubmitRes.json().catch(() => null);
        if (data?.success === 'true' || data?.success === true) {
          deliveredViaServer = true;
        }
      }
    } catch {
      // Non-blocking fallback to mailtoUrl
    }

    return NextResponse.json({
      ok: true,
      recipient,
      deliveredViaServer,
      mailtoUrl,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process contact request.' },
      { status: 500 }
    );
  }
}
