import { describe, expect, it } from "vitest";
import {
  OFFICE_ADDRESS,
  OFFICE_LAT,
  OFFICE_LNG,
  OFFICE_MAP_URL,
} from "@/lib/office";

describe("office map link", () => {
  it("points at 114 Rose Garden Road, Dar es Salaam", () => {
    expect(OFFICE_ADDRESS).toBe("114 Rose Garden Road, Dar es Salaam, Tanzania");
    expect(OFFICE_LAT).toBeCloseTo(-6.765818, 5);
    expect(OFFICE_LNG).toBeCloseTo(39.2481242, 5);
    expect(OFFICE_MAP_URL).toBe(
      "https://www.google.com/maps/search/?api=1&query=114%20Rose%20Garden%20Rd%2C%20Dar%20es%20Salaam%2C%20Tanzania",
    );
  });

  it("uses Google's permanent link form, not a share link that expires", () => {
    expect(OFFICE_MAP_URL).not.toContain("skid");
    expect(OFFICE_MAP_URL).not.toContain("maps.app.goo.gl");
    expect(OFFICE_MAP_URL).toContain("api=1");
  });
});
