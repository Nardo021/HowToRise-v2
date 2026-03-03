import "dotenv/config";
import path from "path";
import { readFile } from "fs/promises";
import { marked } from "marked";
import { PublishStatus } from "@prisma/client";
import { prisma } from "../src/server/db/client";

type LegacySection = {
  sectionId: string;
  title: string;
  titleZh?: string;
  items: Array<{
    id: string;
    label: string;
    labelZh?: string;
    file: string;
    fileZh?: string;
  }>;
};

async function readMarkdownSafe(filePath: string) {
  const abs = path.join(process.cwd(), filePath);
  return readFile(abs, "utf8");
}

async function main() {
  const jsonPath = path.join(process.cwd(), "tutorials.json");
  const legacyJson = await readFile(jsonPath, "utf8");
  const sections = JSON.parse(legacyJson) as LegacySection[];

  for (const section of sections) {
    const category = await prisma.category.upsert({
      where: { slug: section.sectionId.toLowerCase() },
      create: { slug: section.sectionId.toLowerCase() },
      update: {}
    });
    await prisma.categoryTranslation.upsert({
      where: { categoryId_locale: { categoryId: category.id, locale: "en" } },
      create: { categoryId: category.id, locale: "en", name: section.title },
      update: { name: section.title }
    });
    await prisma.categoryTranslation.upsert({
      where: { categoryId_locale: { categoryId: category.id, locale: "zh" } },
      create: { categoryId: category.id, locale: "zh", name: section.titleZh ?? section.title },
      update: { name: section.titleZh ?? section.title }
    });

    for (const item of section.items) {
      const enMd = await readMarkdownSafe(item.file);
      const zhMd = await readMarkdownSafe(item.fileZh ?? item.file);
      const tutorial = await prisma.tutorial.upsert({
        where: { slug: item.id },
        create: {
          slug: item.id,
          status: PublishStatus.published,
          categoryId: category.id,
          publishedAt: new Date()
        },
        update: {
          status: PublishStatus.published,
          categoryId: category.id,
          publishedAt: new Date()
        }
      });
      await prisma.tutorialTranslation.upsert({
        where: { tutorialId_locale: { tutorialId: tutorial.id, locale: "en" } },
        create: {
          tutorialId: tutorial.id,
          locale: "en",
          title: item.label,
          summary: item.label,
          contentMd: enMd,
          contentHtml: marked.parse(enMd, { async: false }) as string
        },
        update: {
          title: item.label,
          summary: item.label,
          contentMd: enMd,
          contentHtml: marked.parse(enMd, { async: false }) as string
        }
      });
      await prisma.tutorialTranslation.upsert({
        where: { tutorialId_locale: { tutorialId: tutorial.id, locale: "zh" } },
        create: {
          tutorialId: tutorial.id,
          locale: "zh",
          title: item.labelZh ?? item.label,
          summary: item.labelZh ?? item.label,
          contentMd: zhMd,
          contentHtml: marked.parse(zhMd, { async: false }) as string
        },
        update: {
          title: item.labelZh ?? item.label,
          summary: item.labelZh ?? item.label,
          contentMd: zhMd,
          contentHtml: marked.parse(zhMd, { async: false }) as string
        }
      });
    }
  }

  console.log("Legacy content migrated.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
