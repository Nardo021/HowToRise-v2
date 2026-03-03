import { describe, expect, it } from "vitest";
import { tagsForTutorialInvalidation } from "../src/server/cache/revalidate";

describe("tutorial cache invalidation tags", () => {
  it("covers both locales for detail/list/home", () => {
    const tags = tagsForTutorialInvalidation("uid");
    expect(tags).toEqual([
      "tutorial:uid:zh",
      "tutorial-list:zh",
      "home:zh",
      "tutorial:uid:en",
      "tutorial-list:en",
      "home:en"
    ]);
  });
});
