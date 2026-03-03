import { unstable_cache } from "next/cache";
import { PublishStatus } from "@prisma/client";
import type { AppLocale } from "@/lib/constants";
import { prisma } from "@/server/db/client";
import { homeTag, tutorialListTag, tutorialTag } from "@/server/cache/revalidate";

export const getPublishedTutorialList = (locale: AppLocale) =>
  unstable_cache(
    async () => {
      const tutorials = await prisma.tutorial.findMany({
        where: { status: PublishStatus.published },
        orderBy: { updatedAt: "desc" },
        include: {
          translations: {
            where: { locale },
            select: { title: true, summary: true, seoTitle: true }
          },
          category: {
            include: { translations: { where: { locale }, select: { name: true } } }
          }
        }
      });
      return tutorials.map((item) => ({
        id: item.id,
        slug: item.slug,
        title: item.translations[0]?.title ?? item.slug,
        summary: item.translations[0]?.summary ?? "",
        category: item.category?.translations[0]?.name ?? ""
      }));
    },
    [`tutorial-list-${locale}`],
    {
      tags: [tutorialListTag(locale), homeTag(locale)],
      revalidate: 300
    }
  )();

export const getPublishedTutorialBySlug = (locale: AppLocale, slug: string) =>
  unstable_cache(
    async () => {
      return prisma.tutorial.findFirst({
        where: { slug, status: PublishStatus.published },
        include: {
          translations: { where: { locale } }
        }
      });
    },
    [`tutorial-${locale}-${slug}`],
    {
      tags: [tutorialTag(slug, locale)],
      revalidate: 300
    }
  )();

export async function getTutorialBySlug(locale: AppLocale, slug: string) {
  return prisma.tutorial.findFirst({
    where: { slug },
    include: {
      translations: { where: { locale } }
    }
  });
}
