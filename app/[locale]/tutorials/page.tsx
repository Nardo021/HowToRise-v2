import type { Metadata } from "next";
import Link from "next/link";
import { ensureLocale } from "@/lib/locale";
import { getPublishedTutorialList } from "@/server/content/repository";
import { AnalyticsBeacon } from "@/components/analytics-beacon";

export const revalidate = 300;
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const locale = ensureLocale((await params).locale);
  return {
    title: locale === "zh" ? "教程列表" : "Tutorials",
    alternates: {
      canonical: `/${locale}/tutorials`,
      languages: {
        "zh-CN": "/zh/tutorials",
        en: "/en/tutorials"
      }
    }
  };
}

export default async function TutorialsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = ensureLocale((await params).locale);
  const tutorials = await getPublishedTutorialList(locale);

  return (
    <main>
      <AnalyticsBeacon locale={locale} />
      <h1>{locale === "zh" ? "教程列表" : "Tutorials"}</h1>
      {tutorials.map((item) => (
        <article className="card" key={item.id}>
          <h3>
            <Link href={`/${locale}/tutorials/${item.slug}`}>{item.title}</Link>
          </h3>
          <p>{item.summary}</p>
        </article>
      ))}
    </main>
  );
}
