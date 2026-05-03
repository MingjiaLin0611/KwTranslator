import { describe, expect, it } from "vitest";
import { injectInlineTranslations } from "@/core/injector";
import type { KeywordEntry } from "@/core/types";

const entries: KeywordEntry[] = [
  {
    id: "software-engineering",
    keyword: "Software Engineering",
    translation: "软件工程",
    domain: "software",
    caseSensitive: false,
    matchStrategy: "phrase",
    enabled: true,
    source: "builtin",
    version: 1
  },
  {
    id: "api",
    keyword: "API",
    translation: "应用程序接口",
    domain: "software",
    caseSensitive: false,
    matchStrategy: "word-boundary",
    enabled: true,
    source: "builtin",
    version: 1
  }
];

describe("injector", () => {
  it("injects inline translations into eligible page text", () => {
    document.body.innerHTML = "<p>This documentation is focusing on Software Engineering and API design.</p>";

    const records = injectInlineTranslations(document.body, entries);

    expect(document.body.textContent).toContain("Software Engineering(软件工程)");
    expect(document.body.textContent).toContain("API(应用程序接口)");
    expect(records).toContainEqual(expect.objectContaining({ success: true }));
  });

  it("prevents duplicate injection on repeated scans", () => {
    document.body.innerHTML = "<p>Software Engineering</p>";

    injectInlineTranslations(document.body, entries);
    const secondPass = injectInlineTranslations(document.body, entries);

    expect(document.body.textContent).toBe("Software Engineering(软件工程)");
    expect(secondPass[0]).toEqual(expect.objectContaining({ duplicatePrevented: true }));
  });

  it("does not inject inside code blocks", () => {
    document.body.innerHTML = "<code>Software Engineering</code><p>API</p>";

    injectInlineTranslations(document.body, entries);

    expect(document.querySelector("code")?.textContent).toBe("Software Engineering");
    expect(document.querySelector("p")?.textContent).toBe("API(应用程序接口)");
  });
});
