import { z } from "zod";

export const analyticsCollectSchema = z.object({
  eventType: z.enum(["page_view", "tutorial_view", "duration"]),
  path: z.string().min(1),
  locale: z.enum(["zh", "en"]),
  tutorialSlug: z.string().optional(),
  durationSec: z.number().int().min(0).max(60 * 60 * 8).optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional()
});

export type AnalyticsCollectInput = z.infer<typeof analyticsCollectSchema>;
