export const SUPPORTED_LOCALES = ["zh", "en"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";
export const ANALYTICS_DEDUPE_WINDOW_SECONDS = 30;
