import "dotenv/config";
import { prisma } from "../server/db/client";

function startOfHour(date: Date) {
  const d = new Date(date);
  d.setUTCMinutes(0, 0, 0);
  return d;
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

async function run() {
  const since = new Date(Date.now() - 48 * 3600 * 1000);
  const rows = await prisma.analyticsRawEvent.findMany({
    where: { createdAt: { gte: since } },
    select: {
      locale: true,
      path: true,
      tutorialId: true,
      country: true,
      utmSource: true,
      sessionId: true,
      eventType: true,
      durationSec: true,
      createdAt: true
    }
  });

  const hourly = new Map<string, { pv: number; clicks: number; sessions: Set<string>; durationTotal: number; durationCount: number; locale: "zh" | "en"; path: string | null; tutorialId: string | null; country: string | null; source: string | null; bucketStart: Date }>();
  const daily = new Map<string, { pv: number; clicks: number; sessions: Set<string>; durationTotal: number; durationCount: number; locale: "zh" | "en"; path: string | null; tutorialId: string | null; country: string | null; source: string | null; bucketDate: Date }>();

  for (const row of rows) {
    const source = row.utmSource ?? "direct";
    const h = startOfHour(row.createdAt);
    const d = startOfDay(row.createdAt);
    const hk = [h.toISOString(), row.locale, row.path, row.tutorialId, row.country, source].join("|");
    const dk = [d.toISOString(), row.locale, row.path, row.tutorialId, row.country, source].join("|");

    if (!hourly.has(hk)) {
      hourly.set(hk, {
        pv: 0,
        clicks: 0,
        sessions: new Set(),
        durationTotal: 0,
        durationCount: 0,
        locale: row.locale,
        path: row.path,
        tutorialId: row.tutorialId,
        country: row.country,
        source,
        bucketStart: h
      });
    }
    if (!daily.has(dk)) {
      daily.set(dk, {
        pv: 0,
        clicks: 0,
        sessions: new Set(),
        durationTotal: 0,
        durationCount: 0,
        locale: row.locale,
        path: row.path,
        tutorialId: row.tutorialId,
        country: row.country,
        source,
        bucketDate: d
      });
    }

    const hBucket = hourly.get(hk)!;
    const dBucket = daily.get(dk)!;
    hBucket.sessions.add(row.sessionId);
    dBucket.sessions.add(row.sessionId);
    if (row.eventType === "page_view") {
      hBucket.pv += 1;
      dBucket.pv += 1;
    }
    if (row.eventType === "tutorial_view") {
      hBucket.clicks += 1;
      dBucket.clicks += 1;
    }
    if (row.eventType === "duration" && row.durationSec) {
      hBucket.durationTotal += row.durationSec;
      dBucket.durationTotal += row.durationSec;
      hBucket.durationCount += 1;
      dBucket.durationCount += 1;
    }
  }

  for (const b of hourly.values()) {
    await prisma.analyticsAggregateHourly.deleteMany({
      where: {
        bucketStart: b.bucketStart,
        locale: b.locale,
        path: b.path,
        tutorialId: b.tutorialId,
        country: b.country,
        source: b.source
      }
    });
    await prisma.analyticsAggregateHourly.create({
      data: {
        bucketStart: b.bucketStart,
        locale: b.locale,
        path: b.path,
        tutorialId: b.tutorialId,
        country: b.country,
        source: b.source,
        pv: b.pv,
        uv: b.sessions.size,
        clicks: b.clicks,
        avgDurationSec: b.durationCount ? b.durationTotal / b.durationCount : 0
      }
    });
  }

  for (const b of daily.values()) {
    await prisma.analyticsAggregateDaily.deleteMany({
      where: {
        bucketDate: b.bucketDate,
        locale: b.locale,
        path: b.path,
        tutorialId: b.tutorialId,
        country: b.country,
        source: b.source
      }
    });
    await prisma.analyticsAggregateDaily.create({
      data: {
        bucketDate: b.bucketDate,
        locale: b.locale,
        path: b.path,
        tutorialId: b.tutorialId,
        country: b.country,
        source: b.source,
        pv: b.pv,
        uv: b.sessions.size,
        clicks: b.clicks,
        avgDurationSec: b.durationCount ? b.durationTotal / b.durationCount : 0
      }
    });
  }

  const retention = Number(process.env.ANALYTICS_RAW_RETENTION_DAYS ?? "90");
  const expireBefore = new Date(Date.now() - retention * 86400000);
  await prisma.analyticsRawEvent.deleteMany({ where: { createdAt: { lt: expireBefore } } });
  console.log("Aggregation done");
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
