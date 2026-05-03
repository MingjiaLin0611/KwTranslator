import { describe, expect, it, vi } from "vitest";
import { runPageTranslation } from "@/core/runtime";
import { defaultSettings, type TranslatorStorage } from "@/core/storage";
import type { KeywordDictionary } from "@/core/types";

describe("runtime", () => {
  it("does not inject translations when the extension is disabled", async () => {
    document.body.innerHTML = "<p>Software Engineering</p>";

    const records = await runPageTranslation(
      document,
      createStorage({
        settings: { ...defaultSettings, enabled: false }
      })
    );

    expect(records).toEqual([]);
    expect(document.body.textContent).toBe("Software Engineering");
  });

  it("injects translations from merged builtin and user dictionaries", async () => {
    document.body.innerHTML = "<p>Software Engineering uses React.</p>";

    const records = await runPageTranslation(
      document,
      createStorage({
        userDictionary: {
          schemaVersion: 1,
          dictionaryVersion: "user.1",
          name: "User Dictionary",
          entries: [
            {
              id: "react",
              keyword: "React",
              translation: "反应式框架",
              domain: "software",
              caseSensitive: false,
              matchStrategy: "word-boundary",
              enabled: true,
              source: "user",
              version: 1
            }
          ]
        }
      })
    );

    expect(records).toContainEqual(expect.objectContaining({ success: true }));
    expect(document.body.textContent).toContain("Software Engineering(软件工程)");
    expect(document.body.textContent).toContain("React(反应式框架)");
  });

  it("safely exits when there is no body", async () => {
    const doc = document.implementation.createHTMLDocument("empty");
    doc.body.remove();

    await expect(runPageTranslation(doc, createStorage({}))).resolves.toEqual([]);
  });
});

function createStorage({
  settings = defaultSettings,
  userDictionary
}: {
  settings?: Awaited<ReturnType<TranslatorStorage["getSettings"]>>;
  userDictionary?: KeywordDictionary;
}): TranslatorStorage {
  return {
    getSettings: vi.fn(async () => settings),
    saveSettings: vi.fn(),
    getUserDictionary: vi.fn(async () => userDictionary),
    saveUserDictionary: vi.fn()
  };
}
