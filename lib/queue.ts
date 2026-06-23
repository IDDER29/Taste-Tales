import { Client } from "@upstash/qstash";

// Optional async job queue (Upstash QStash). When QSTASH_TOKEN is unset, callers
// fall back to running work inline. QStash calls back into our /api/jobs/* routes.
const token = process.env.QSTASH_TOKEN;
const client = token ? new Client({ token }) : null;

export const isQueueConfigured = (): boolean => client !== null;

function baseUrl(): string | null {
  return (
    process.env.QSTASH_TARGET_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    null
  );
}

// Publish a job to a worker route. Returns true if enqueued, false if the queue
// isn't configured (caller should then run the work inline).
export async function publishJob(path: string, body: unknown): Promise<boolean> {
  const base = baseUrl();
  if (!client || !base) return false;
  await client.publishJSON({ url: `${base}${path}`, body });
  return true;
}
