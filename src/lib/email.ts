import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM ?? "Planly <onboarding@resend.dev>";
const isConfigured = Boolean(apiKey) && apiKey !== "re_placeholder";

const resend = isConfigured ? new Resend(apiKey) : null;

function verificationEmailHtml(name: string, verifyUrl: string) {
  return `
  <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; background:#f6f3ef; padding: 32px;">
    <div style="max-width: 480px; margin: 0 auto; background:#ffffff; border-radius:16px; padding:32px; border:1px solid #e6ebe2;">
      <p style="font-size:22px; font-weight:700; color:#2f2f2f; margin:0 0 24px;">Planly</p>
      <h1 style="font-size:20px; color:#2f2f2f; margin:0 0 12px;">Hoi ${name},</h1>
      <p style="font-size:14px; line-height:1.6; color:#4a4a4a; margin:0 0 24px;">
        Bevestig je e-mailadres om jullie gezin op Planly te activeren.
      </p>
      <a href="${verifyUrl}" style="display:inline-block; background:#6b8a5c; color:#ffffff; text-decoration:none; font-size:14px; font-weight:600; padding:12px 24px; border-radius:999px;">
        E-mailadres bevestigen
      </a>
      <p style="font-size:12px; color:#767676; margin:24px 0 0;">
        Werkt de knop niet? Plak deze link in je browser:<br>
        <span style="word-break:break-all;">${verifyUrl}</span>
      </p>
      <p style="font-size:12px; color:#767676; margin:16px 0 0;">
        Deze link verloopt over 24 uur. Heb je dit niet aangevraagd? Dan kun je deze e-mail negeren.
      </p>
    </div>
  </div>`;
}

export async function sendVerificationEmail(to: string, name: string, verifyUrl: string) {
  if (!resend) {
    console.log(`[email] RESEND_API_KEY niet geconfigureerd. Verificatielink voor ${to}: ${verifyUrl}`);
    return;
  }

  await resend.emails.send({
    from,
    to,
    subject: "Bevestig je e-mailadres voor Planly",
    html: verificationEmailHtml(name, verifyUrl),
  });
}
