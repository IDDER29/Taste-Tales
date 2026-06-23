import { NextRequest, NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { deliverEmail, type EmailPayload } from "@/lib/email";

export const runtime = "nodejs";

const currentSigningKey = process.env.QSTASH_CURRENT_SIGNING_KEY;
const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY;
const receiver =
  currentSigningKey && nextSigningKey
    ? new Receiver({ currentSigningKey, nextSigningKey })
    : null;

// QStash worker: delivers an email job. Requires a valid QStash signature, so it
// can't be invoked by anyone but the queue.
export async function POST(req: NextRequest) {
  if (!receiver) {
    return NextResponse.json(
      { error: "Email worker is not configured" },
      { status: 503 }
    );
  }

  const signature = req.headers.get("upstash-signature") ?? "";
  const body = await req.text();

  const valid = await receiver
    .verify({ signature, body })
    .catch(() => false);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body) as EmailPayload;
  await deliverEmail(payload);
  return NextResponse.json({ ok: true });
}
