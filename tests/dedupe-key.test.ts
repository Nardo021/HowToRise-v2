import { describe, expect, it } from "vitest";
import { buildDedupeKey } from "../src/server/analytics/dedupe";

describe("analytics dedupe key", () => {
  it("builds deterministic keys", () => {
    const a = buildDedupeKey({
      sessionId: "s1",
      eventType: "page_view",
      path: "/en",
      tutorialSlug: "uid"
    });
    const b = buildDedupeKey({
      sessionId: "s1",
      eventType: "page_view",
      path: "/en",
      tutorialSlug: "uid"
    });
    expect(a).toBe(b);
  });
});
