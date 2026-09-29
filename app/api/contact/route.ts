import { NextRequest, NextResponse } from 'next/server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getRecipientEmail() {
  const envEmail = process.env.CONTACT_EMAIL?.trim() || '';
  if (EMAIL_REGEX.test(envEmail)) {
    return envEmail;
  }
  return '';
}

function parseFormSubmitResponse(rawText: string): Record<string, any> | null {
  if (!rawText) return null;
  try {
    return JSON.parse(rawText);
  } catch {
    // FormSubmit sometimes concatenates two JSON objects on error, e.g. {...}{...}
    const firstObjectMatch = rawText.match(/^\{[\s\S]*?\}(?=\s*\{|$)/);
    if (firstObjectMatch) {
      try {
        return JSON.parse(firstObjectMatch[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
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
            'Contact service is not configured yet. Please set a valid CONTACT_EMAIL in environment variables.',
        },
        { status: 503 }
      );
    }
    const subject = `[1Shows] ${topic} — from ${name}`;
    const appOrigin =
      req.headers.get('origin') ||
      process.env.APP_URL?.trim() ||
      'https://1shows.im';
    const appReferer =
      req.headers.get('referer') || `${appOrigin.replace(/\/$/, '')}/privacy`;
    const userAgent =
      req.headers.get('user-agent') ||
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

    const response = await fetch(
      `https://formsubmit.co/ajax/${recipient}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Origin: appOrigin,
          Referer: appReferer,
          'User-Agent': userAgent,
        },
        body: JSON.stringify({
          name,
          email,
          _replyto: email,
          _subject: subject,
          topic,
          message,
        }),
      }
    );

    const rawText = await response.text().catch(() => '');
    const result = parseFormSubmitResponse(rawText);

    if (!result) {
      return NextResponse.json(
        { error: 'Unable to reach the mail relay service. Please try again.' },
        { status: 502 }
      );
    }

    const isSuccess = result.success === true || result.success === 'true';
    const rawMsg = String(result.message || '');
    const needsActivation =
      rawMsg.toLowerCase().includes('activation') ||
      rawMsg.toLowerCase().includes('activate form');

    if (isSuccess) {
      return NextResponse.json({
        ok: true,
        status: 'sent',
        message:
          'Thank you for reaching out. Our administrative team has received your inquiry and will respond to your email shortly.',
      });
    }

    if (needsActivation) {
      return NextResponse.json({
        ok: true,
        status: 'activation_required',
        message:
          "We just sent a one-time 'Activate Form' confirmation email to your inbox (check Spam/Promotions too). Click 'Activate Form' in that email once, and all future messages will arrive directly!",
      });
    }

    return NextResponse.json(
      {
        error:
          rawMsg ||
          'Mail service rejected the submission. Please verify CONTACT_EMAIL.',
      },
      { status: 502 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to process contact request.' },
      { status: 500 }
    );
  }
}
