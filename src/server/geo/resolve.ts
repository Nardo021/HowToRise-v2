import { createHash } from "crypto";
import type { NextRequest } from "next/server";

export function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim();
  return req.headers.get("x-real-ip") ?? "0.0.0.0";
}

export function hashIp(ip: string) {
  return createHash("sha256").update(ip).digest("hex");
}

export function resolveGeo(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country") ?? "unknown";
  const city = req.headers.get("x-vercel-ip-city") ?? "unknown";
  const language = req.headers.get("accept-language")?.split(",")[0] ?? "unknown";
  return { country, city, language };
}
