import { describe, expect, it } from "vitest";

import { getSafeHttpUrl, getSafeInternalPath, isSafeHttpUrl } from "./url";

describe("URL security helpers", () => {
  it.each(["https://example.com", "http://localhost:3000/path"])(
    "accepts safe web URL %s",
    (value) => expect(isSafeHttpUrl(value)).toBe(true),
  );

  it.each(["javascript:alert(1)", "data:text/html,test", "//evil.example", "not-a-url"])(
    "rejects unsafe URL %s",
    (value) => expect(isSafeHttpUrl(value)).toBe(false),
  );

  it("returns null for a non-string or unsafe redirect", () => {
    expect(getSafeHttpUrl(null)).toBeNull();
    expect(getSafeHttpUrl("javascript:alert(1)")).toBeNull();
  });

  it("allows only local application paths", () => {
    expect(getSafeInternalPath("/dashboard/links")).toBe("/dashboard/links");
    expect(getSafeInternalPath("//evil.example")).toBe("/dashboard");
    expect(getSafeInternalPath("/\\evil.example")).toBe("/dashboard");
  });
});
