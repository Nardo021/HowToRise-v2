import { revalidateTag } from "next/cache";
import type { AppLocale } from "@/lib/constants";

export function tutorialTag(slug: string, locale: AppLocale) {
  return `tutorial:${slug}:${locale}`;
}

export function tutorialListTag(locale: AppLocale) {
  return `tutorial-list:${locale}`;
}

export function homeTag(locale: AppLocale) {
  return `home:${locale}`;
}

export function tagsForTutorialInvalidation(slug: string) {
  return (["zh", "en"] as const).flatMap((locale) => [
    tutorialTag(slug, locale),
    tutorialListTag(locale),
    homeTag(locale)
  ]);
}

export function revalidateTutorialContent(slug: string) {
  tagsForTutorialInvalidation(slug).forEach((tag) => revalidateTag(tag));
}
