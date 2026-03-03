import { notFound } from "next/navigation";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type AppLocale } from "@/lib/constants";

export function ensureLocale(value: string): AppLocale {
  if (SUPPORTED_LOCALES.includes(value as AppLocale)) {
    return value as AppLocale;
  }
  notFound();
}

export function toLocale(value?: string): AppLocale {
  if (!value) return DEFAULT_LOCALE;
  if (SUPPORTED_LOCALES.includes(value as AppLocale)) {
    return value as AppLocale;
  }
  return DEFAULT_LOCALE;
}
