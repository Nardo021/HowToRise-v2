import { Locale, PublishStatus } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { markdownToHtml } from "@/server/content/markdown";
import type { TutorialUpsertInput } from "@/server/content/schemas";

export async function upsertTutorial(payload: TutorialUpsertInput) {
  const status = payload.status as PublishStatus;
  const categorySlug = payload.categorySlug?.trim().toLowerCase();
  const category = categorySlug
    ? await prisma.category.upsert({
        where: { slug: categorySlug },
        create: { slug: categorySlug },
        update: {}
      })
    : null;
  if (category) {
    await prisma.categoryTranslation.upsert({
      where: { categoryId_locale: { categoryId: category.id, locale: Locale.zh } },
      create: { categoryId: category.id, locale: Locale.zh, name: categorySlug ?? "default" },
      update: {}
    });
    await prisma.categoryTranslation.upsert({
      where: { categoryId_locale: { categoryId: category.id, locale: Locale.en } },
      create: { categoryId: category.id, locale: Locale.en, name: categorySlug ?? "default" },
      update: {}
    });
  }

  const tutorial = await prisma.tutorial.upsert({
    where: { slug: payload.slug },
    update: {
      status,
      categoryId: category?.id ?? null,
      youtubeUrl: payload.youtubeUrl || null,
      publishedAt: status === PublishStatus.published ? new Date() : null
    },
    create: {
      slug: payload.slug,
      status,
      categoryId: category?.id ?? null,
      youtubeUrl: payload.youtubeUrl || null,
      publishedAt: status === PublishStatus.published ? new Date() : null
    }
  });

  const tagSlugs = (payload.tagSlugs ?? []).map((x) => x.trim().toLowerCase()).filter(Boolean);
  await prisma.tutorialTag.deleteMany({ where: { tutorialId: tutorial.id } });
  if (tagSlugs.length) {
    for (const slug of tagSlugs) {
      const tag = await prisma.tag.upsert({
        where: { slug },
        create: { slug },
        update: {}
      });
      await prisma.tagTranslation.upsert({
        where: { tagId_locale: { tagId: tag.id, locale: Locale.zh } },
        create: { tagId: tag.id, locale: Locale.zh, name: slug },
        update: {}
      });
      await prisma.tagTranslation.upsert({
        where: { tagId_locale: { tagId: tag.id, locale: Locale.en } },
        create: { tagId: tag.id, locale: Locale.en, name: slug },
        update: {}
      });
      await prisma.tutorialTag.upsert({
        where: { tutorialId_tagId: { tutorialId: tutorial.id, tagId: tag.id } },
        create: { tutorialId: tutorial.id, tagId: tag.id },
        update: {}
      });
    }
  }

  await prisma.tutorialTranslation.upsert({
    where: { tutorialId_locale: { tutorialId: tutorial.id, locale: Locale.zh } },
    create: {
      tutorialId: tutorial.id,
      locale: Locale.zh,
      title: payload.zh.title,
      summary: payload.zh.summary,
      contentMd: payload.zh.contentMd,
      contentHtml: markdownToHtml(payload.zh.contentMd),
      seoTitle: payload.zh.seoTitle,
      seoDesc: payload.zh.seoDesc
    },
    update: {
      title: payload.zh.title,
      summary: payload.zh.summary,
      contentMd: payload.zh.contentMd,
      contentHtml: markdownToHtml(payload.zh.contentMd),
      seoTitle: payload.zh.seoTitle,
      seoDesc: payload.zh.seoDesc
    }
  });

  await prisma.tutorialTranslation.upsert({
    where: { tutorialId_locale: { tutorialId: tutorial.id, locale: Locale.en } },
    create: {
      tutorialId: tutorial.id,
      locale: Locale.en,
      title: payload.en.title,
      summary: payload.en.summary,
      contentMd: payload.en.contentMd,
      contentHtml: markdownToHtml(payload.en.contentMd),
      seoTitle: payload.en.seoTitle,
      seoDesc: payload.en.seoDesc
    },
    update: {
      title: payload.en.title,
      summary: payload.en.summary,
      contentMd: payload.en.contentMd,
      contentHtml: markdownToHtml(payload.en.contentMd),
      seoTitle: payload.en.seoTitle,
      seoDesc: payload.en.seoDesc
    }
  });

  return tutorial;
}

export async function getAdminTutorialList() {
  return prisma.tutorial.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      translations: true
    }
  });
}
