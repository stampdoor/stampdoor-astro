/**
 * Cloudflare Pages Function: POST /api/contact
 *
 * 環境変数（Cloudflare Pagesダッシュボードで設定）:
 *   RESEND_API_KEY  : Resendで発行したAPIキー
 *   FROM_EMAIL      : 送信元アドレス（Resendで認証済みドメイン）
 *                     例: noreply@stampdoor.com
 *   TO_EMAIL        : 受信先アドレス
 *                     例: info@stampdoor.com
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return json({ ok: false, error: 'invalid_body' }, 400);
  }

  const website = formData.get('website') ?? '';
  if (website) {
    return json({ ok: false }, 200);
  }

  const name    = (formData.get('name')    ?? '').trim();
  const email   = (formData.get('email')   ?? '').trim();
  const subject = (formData.get('subject') ?? '').trim() || '（件名なし）';
  const message = (formData.get('message') ?? '').trim();
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
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
