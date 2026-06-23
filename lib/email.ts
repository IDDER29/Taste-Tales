import { publishJob } from "./queue";

// Transactional email via Resend. Optional: without RESEND_API_KEY, emails are
// logged instead of sent, so flows work in dev / before infra is provisioned.
// When QStash is configured, sends are dispatched async to /api/jobs/send-email;
// otherwise they run inline (best-effort).
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM =
  process.env.EMAIL_FROM || "Taste-Tales <onboarding@resend.dev>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const isEmailConfigured = (): boolean => Boolean(RESEND_API_KEY);

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

// Actually delivers the email (called inline or by the QStash worker). Never
// throws so it can't break a request or crash a job.
export async function deliverEmail(payload: EmailPayload): Promise<void> {
  const { to, subject, html } = payload;
  if (!RESEND_API_KEY) {
    console.info(`[email] (not configured) would send to ${to}: "${subject}"`);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({ from: EMAIL_FROM, to, subject, html }),
    });
    if (!res.ok) {
      console.error(
        "[email] send failed",
        res.status,
        await res.text().catch(() => "")
      );
    }
  } catch (err) {
    console.error("[email] send error", err);
  }
}

// Dispatch: enqueue via QStash when available, otherwise deliver inline.
async function dispatch(payload: EmailPayload): Promise<void> {
  try {
    const queued = await publishJob("/api/jobs/send-email", payload);
    if (queued) return;
  } catch (err) {
    console.error("[email] enqueue failed, sending inline", err);
  }
  await deliverEmail(payload);
}

const layout = (heading: string, body: string, cta: { url: string; label: string }) => `
  <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
    <h1 style="color:#ef4444;font-size:22px">Taste-Tales</h1>
    <h2 style="font-size:18px;color:#111">${heading}</h2>
    <p style="color:#444;line-height:1.5">${body}</p>
    <p style="margin:24px 0">
      <a href="${cta.url}" style="background:#ef4444;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600">${cta.label}</a>
    </p>
    <p style="color:#888;font-size:13px">If the button doesn't work, paste this link into your browser:<br>${cta.url}</p>
  </div>`;

export async function sendVerificationEmail(
  to: string,
  token: string
): Promise<void> {
  const url = `${APP_URL}/verify-email?token=${token}`;
  await dispatch({
    to,
    subject: "Verify your Taste-Tales email",
    html: layout(
      "Confirm your email",
      "Welcome! Confirm your email address to finish setting up your account.",
      { url, label: "Verify email" }
    ),
  });
}

export async function sendPasswordResetEmail(
  to: string,
  token: string
): Promise<void> {
  const url = `${APP_URL}/reset-password?token=${token}`;
  await dispatch({
    to,
    subject: "Reset your Taste-Tales password",
    html: layout(
      "Reset your password",
      "We received a request to reset your password. This link expires in 1 hour. If you didn't request it, you can ignore this email.",
      { url, label: "Reset password" }
    ),
  });
}
