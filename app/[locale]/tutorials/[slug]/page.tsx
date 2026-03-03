import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ensureLocale } from "@/lib/locale";
import { getPublishedTutorialBySlug, getTutorialBySlug } from "@/server/content/repository";
import { AnalyticsBeacon } from "@/components/analytics-beacon";
import { getCurrentAdmin } from "@/server/auth/session";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeRaw, slug } = await params;
  const locale = ensureLocale(localeRaw);
  const tutorial = await getPublishedTutorialBySlug(locale, slug);
  const trans = tutorial?.translations[0];
  if (!tutorial || !trans) return {};
  return {
    title: trans.seoTitle ?? trans.title,
    description: trans.seoDesc ?? trans.summary ?? "",
    alternates: {
      canonical: `/${locale}/tutorials/${slug}`,
      languages: {
        "zh-CN": `/zh/tutorials/${slug}`,
        en: `/en/tutorials/${slug}`
      }
    }
  };
}

export default async function TutorialDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const preview = (await searchParams).preview === "1";
  const locale = ensureLocale(rawLocale);
  const admin = preview ? await getCurrentAdmin() : null;
  const tutorial = preview && admin ? await getTutorialBySlug(locale, slug) : await getPublishedTutorialBySlug(locale, slug);
  const translation = tutorial?.translations[0];
  if (!tutorial || !translation) notFound();

  return (
    <article>
      <AnalyticsBeacon locale={locale} tutorialSlug={slug} />
      <h1>{translation.title}</h1>
      <p>{translation.summary}</p>
      <section
        className="card"
        dangerouslySetInnerHTML={{ __html: translation.contentHtml }}
      />
    </article>
  );
}
