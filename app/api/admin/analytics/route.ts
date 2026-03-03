import { NextResponse } from "next/server";
import { Locale } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { requireAdmin } from "@/server/auth/session";

function getSince(range: string) {
  const now = Date.now();
  if (range === "7d") return new Date(now - 7 * 86400000);
  if (range === "30d") return new Date(now - 30 * 86400000);
  return new Date(now - 24 * 3600000);
}

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") ?? "7d";
    const locale = searchParams.get("locale") as Locale | "all";
    const since = getSince(range);
    const localeFilter = locale && locale !== "all" ? { locale } : {};

    const hourly = await prisma.analyticsAggregateHourly.findMany({
      where: {
        bucketStart: { gte: since },
        ...localeFilter
      },
      include: {
        tutorial: { select: { slug: true } }
      }
    });

    // Fallback to raw when aggregate job has not run yet.
    const rows =
      hourly.length > 0
        ? hourly.map((h) => ({
            pv: h.pv,
            uv: h.uv,
            clicks: h.clicks,
            avgDurationSec: h.avgDurationSec,
            path: h.path,
            tutorialSlug: h.tutorial?.slug ?? null,
            country: h.country,
            source: h.source,
            bucketLabel: h.bucketStart.toISOString().slice(0, 13) + ":00"
          }))
        : [];

    const pv = rows.reduce((sum, x) => sum + x.pv, 0);
    const uv = rows.reduce((sum, x) => sum + x.uv, 0);
    const avgDuration = rows.reduce((sum, x) => sum + x.avgDurationSec, 0) / Math.max(1, rows.length);

    const byPath = new Map<string, number>();
    const byTutorial = new Map<string, number>();
    const byCountry = new Map<string, number>();
    const bySource = new Map<string, number>();
    const byHour = new Map<string, number>();

    for (const item of rows) {
      byPath.set(item.path ?? "unknown", (byPath.get(item.path ?? "unknown") ?? 0) + item.pv);
      if (item.tutorialSlug) byTutorial.set(item.tutorialSlug, (byTutorial.get(item.tutorialSlug) ?? 0) + item.clicks);
      byCountry.set(item.country ?? "unknown", (byCountry.get(item.country ?? "unknown") ?? 0) + item.pv);
      bySource.set(item.source ?? "direct", (bySource.get(item.source ?? "direct") ?? 0) + item.pv);
      byHour.set(item.bucketLabel, (byHour.get(item.bucketLabel) ?? 0) + item.pv);
    }

    const topPages = [...byPath.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    const topTutorials = [...byTutorial.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    const countries = [...byCountry.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    const sources = [...bySource.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);
    const trend = [...byHour.entries()].sort((a, b) => (a[0] > b[0] ? 1 : -1));

    return NextResponse.json({
      pv,
      uv,
      avgDurationSec: Number(avgDuration.toFixed(2)),
      topPages,
      topTutorials,
      countries,
      sources,
      trend
    });
  } catch {
    return NextResponse.json({ error: "unauthorized_or_failed" }, { status: 401 });
  }
}
