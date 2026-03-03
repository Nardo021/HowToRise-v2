import Link from "next/link";
import { ensureLocale } from "@/lib/locale";

export function generateStaticParams() {
  return [{ locale: "zh" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = ensureLocale(rawLocale);

  return (
    <div className="container">
      <header className="toolbar">
        <Link href={`/${locale}`}>HowToRise</Link>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link href={`/${locale}`}>Home</Link>
          <Link href={`/${locale}/tutorials`}>Tutorials</Link>
          <Link href={locale === "zh" ? `/en` : `/zh`}>
            {locale === "zh" ? "English" : "中文"}
          </Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
