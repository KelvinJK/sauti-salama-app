import { describe, expect, it } from "vitest";
import { OFFICE_LAT, OFFICE_LNG, OFFICE_MAP_URL } from "@/lib/office";

describe("office map link", () => {
  it("points at the Dar es Salaam pin the team provided", () => {
    expect(OFFICE_LAT).toBe(-6.772382);
    expect(OFFICE_LNG).toBe(39.244204);
    expect(OFFICE_MAP_URL).toBe(
      "https://www.google.com/maps/search/?api=1&query=-6.772382,39.244204",
    );
  });

  it("uses Google's permanent link form, not a share link that expires", () => {
    expect(OFFICE_MAP_URL).not.toContain("skid");
    expect(OFFICE_MAP_URL).not.toContain("maps.app.goo.gl");
    expect(OFFICE_MAP_URL).toContain("api=1");
  });
});
