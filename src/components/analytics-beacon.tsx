"use client";

import { useEffect, useRef } from "react";
import type { AppLocale } from "@/lib/constants";
import { sendAnalyticsEvent } from "@/analytics/client";

type Props = {
  locale: AppLocale;
  tutorialSlug?: string;
};

function getUtm() {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined
  };
}

export function AnalyticsBeacon({ locale, tutorialSlug }: Props) {
  const start = useRef<number>(Date.now());

  useEffect(() => {
    const path = window.location.pathname;
    const utm = getUtm();
    sendAnalyticsEvent({
      eventType: "page_view",
      path,
      locale,
      referrer: document.referrer || undefined,
      ...utm
    });
    if (tutorialSlug) {
      sendAnalyticsEvent({
        eventType: "tutorial_view",
        path,
        locale,
        tutorialSlug,
        referrer: document.referrer || undefined,
        ...utm
      });
    }

    const sendDuration = () => {
      const durationSec = Math.max(1, Math.round((Date.now() - start.current) / 1000));
      sendAnalyticsEvent({
        eventType: "duration",
        path,
        locale,
        tutorialSlug,
        durationSec,
        referrer: document.referrer || undefined,
        ...utm
      });
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        sendDuration();
      }
    };
    window.addEventListener("beforeunload", sendDuration);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", sendDuration);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [locale, tutorialSlug]);

  return null;
}
