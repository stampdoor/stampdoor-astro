import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  // Cloudflare Workers の環境変数は locals.runtime.env から取得
  const env = (locals as any).runtime?.env ?? {};

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: 'invalid_body' }, 400);
  }

  // ハニーポット（ボット対策）
  const website = formData.get('website') ?? '';
  if (website) {
    return json({ ok: false }, 200);
  }

  const name    = String(formData.get('name')    ?? '').trim();
  const email   = String(formData.get('email')   ?? '').trim();
  const subject = String(formData.get('subject') ?? '').trim() || '（件名なし）';
  const message = String(formData.get('message') ?? '').trim();
  const privacy = formData.get('privacy');

  if (!name || !email || !message || !privacy) {
    return json({ ok: false, error: 'validation' }, 400);
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return json({ ok: false, error: 'invalid_email' }, 400);
  }

  const resendKey = env.RESEND_API_KEY;
  const fromEmail = env.FROM_EMAIL ?? 'noreply@stampdoor.com';
  const toEmail   = env.TO_EMAIL   ?? 'info@stampdoor.com';

  if (!resendKey) {
    return json({ ok: false, error: 'config' }, 500);
  }

  const body = [
    `お名前: ${name}`,
    `メール: ${email}`,
    '',
    message,
  ].join('\n');

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `stampdoor <${fromEmail}>`,
      to:   [toEmail],
      reply_to: email,
      subject: `[お問い合わせ] ${subject}`,
      text: body,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Resend error:', err);
    return json({ ok: false, error: 'send_failed' }, 500);
  }

  return json({ ok: true });
};

function json(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
