import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { Locale, AnalyticsEventType } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { analyticsCollectSchema } from "@/server/analytics/schema";
import { buildDedupeKey, shouldCountEvent } from "@/server/analytics/dedupe";
import { isLikelyBot } from "@/server/analytics/bot";
import { getClientIp, hashIp, resolveGeo } from "@/server/geo/resolve";

const SID_COOKIE = "htr_sid";
const SID_TTL_SECONDS = 60 * 60 * 24 * 365;

export async function POST(req: NextRequest) {
  try {
    const parsed = analyticsCollectSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
    }

    const body = parsed.data;
    let sid = req.cookies.get(SID_COOKIE)?.value;
    const needSetSid = !sid;
    if (!sid) sid = randomUUID();

    const dedupeKey = buildDedupeKey({
      sessionId: sid,
      eventType: body.eventType,
      path: body.path,
      tutorialSlug: body.tutorialSlug
    });
    const countable = await shouldCountEvent(dedupeKey);
    if (!countable) {
      const response = NextResponse.json({ ok: true, deduped: true });
      if (needSetSid) {
        response.cookies.set(SID_COOKIE, sid, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: SID_TTL_SECONDS,
          path: "/"
        });
      }
      return response;
    }

    const tutorial = body.tutorialSlug
      ? await prisma.tutorial.findUnique({
          where: { slug: body.tutorialSlug },
          select: { id: true, slug: true }
        })
      : null;
    const ip = getClientIp(req);
    const geo = resolveGeo(req);
    const ua = req.headers.get("user-agent");
    await prisma.analyticsRawEvent.create({
      data: {
        eventType: body.eventType as AnalyticsEventType,
        path: body.path,
        locale: body.locale as Locale,
        tutorialId: tutorial?.id,
        tutorialSlug: tutorial?.slug,
        sessionId: sid,
        ipHash: hashIp(ip),
        userAgent: ua,
        isBot: isLikelyBot(ua),
        dedupeKey,
        country: geo.country,
        city: geo.city,
        language: geo.language,
        referrer: body.referrer,
        utmSource: body.utmSource,
        utmMedium: body.utmMedium,
        utmCampaign: body.utmCampaign,
        durationSec: body.durationSec
      }
    });

    const response = NextResponse.json({ ok: true });
    if (needSetSid) {
      response.cookies.set(SID_COOKIE, sid, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: SID_TTL_SECONDS,
        path: "/"
      });
    }
    return response;
  } catch {
    return NextResponse.json({ error: "collect_failed" }, { status: 500 });
  }
}
