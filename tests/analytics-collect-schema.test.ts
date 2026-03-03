import { describe, expect, it } from "vitest";
import { analyticsCollectSchema } from "../src/server/analytics/schema";

describe("analytics collect schema", () => {
  it("accepts valid tutorial_view payload", () => {
    const payload = {
      eventType: "tutorial_view",
      path: "/en/tutorials/uid",
      locale: "en",
      tutorialSlug: "uid",
      referrer: "https://google.com",
      utmSource: "google"
    };
    const parsed = analyticsCollectSchema.safeParse(payload);
    expect(parsed.success).toBe(true);
  });

  it("rejects invalid locale", () => {
    const parsed = analyticsCollectSchema.safeParse({
      eventType: "page_view",
      path: "/",
      locale: "jp"
    });
    expect(parsed.success).toBe(false);
  });
});
