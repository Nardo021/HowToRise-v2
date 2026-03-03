export type AnalyticsEventPayload = {
  eventType: "page_view" | "tutorial_view" | "duration";
  path: string;
  locale: "zh" | "en";
  tutorialSlug?: string;
  durationSec?: number;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

export function sendAnalyticsEvent(payload: AnalyticsEventPayload) {
  const url = "/api/analytics/collect";
  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(url, blob);
    return;
  }
  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  });
}
