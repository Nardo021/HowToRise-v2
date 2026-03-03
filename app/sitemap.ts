import type { MetadataRoute } from "next";
import { prisma } from "@/server/db/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.APP_BASE_URL ?? "http://localhost:3000";
  const pages: MetadataRoute.Sitemap = [
    { url: `${base}/zh`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/en`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/zh/tutorials`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/en/tutorials`, changeFrequency: "daily", priority: 0.9 }
  ];

  try {
    const tutorials = await prisma.tutorial.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true }
    });
    for (const item of tutorials) {
      pages.push(
        {
          url: `${base}/zh/tutorials/${item.slug}`,
          lastModified: item.updatedAt,
          changeFrequency: "weekly",
          priority: 0.8
        },
        {
          url: `${base}/en/tutorials/${item.slug}`,
          lastModified: item.updatedAt,
          changeFrequency: "weekly",
          priority: 0.8
        }
      );
    }
  } catch {
    // allow sitemap render even if DB is not initialized yet
  }

  return pages;
}
