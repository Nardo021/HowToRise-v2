import type { Metadata } from "next";
import Link from "next/link";
import { ensureLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
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
    title: t(locale, "homeTitle"),
    description: t(locale, "homeDesc"),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        "zh-CN": "/zh",
        en: "/en"
      }
    }
  };
}

export default async function LocaleHomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = ensureLocale((await params).locale);
  const tutorials = await getPublishedTutorialList(locale);

  return (
    <main>
      <AnalyticsBeacon locale={locale} />
      <h1>{t(locale, "homeTitle")}</h1>
      <p>{t(locale, "homeDesc")}</p>
      <section>
        {tutorials.slice(0, 6).map((item) => (
          <article className="card" key={item.id}>
            <h3>
              <Link href={`/${locale}/tutorials/${item.slug}`}>{item.title}</Link>
            </h3>
            <p>{item.summary}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
