import { ANALYTICS_DEDUPE_WINDOW_SECONDS } from "@/lib/constants";
import { prisma } from "@/server/db/client";

export function buildDedupeKey(input: {
  sessionId: string;
  eventType: string;
  path: string;
  tutorialSlug?: string;
}) {
  return `analytics:dedupe:${input.sessionId}:${input.eventType}:${input.path}:${input.tutorialSlug ?? "-"}`;
}

export async function shouldCountEvent(dedupeKey: string) {
  const windowStart = new Date(
    Date.now() - ANALYTICS_DEDUPE_WINDOW_SECONDS * 1000
  );
  const exists = await prisma.analyticsRawEvent.findFirst({
    where: {
      dedupeKey,
      createdAt: { gte: windowStart }
    },
    select: { id: true }
  });
  return !exists;
}
