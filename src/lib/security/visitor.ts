import "server-only";

import { createHmac } from "node:crypto";

export function createDailyVisitorHash(request: Request, scope: string) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const address = forwardedFor || request.headers.get("x-real-ip") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  const day = new Date().toISOString().slice(0, 10);
  const secret = process.env.APP_SECRET;

  if (!secret || secret.length < 32) {
    return null;
  }

  return createHmac("sha256", secret)
    .update(`${scope}:${day}:${address}:${userAgent}`)
    .digest("hex");
}
