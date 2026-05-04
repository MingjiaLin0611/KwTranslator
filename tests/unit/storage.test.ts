import { describe, expect, it } from "vitest";
import { createBrowserTranslatorStorage, defaultSettings } from "@/core/storage";
import type { KeywordDictionary } from "@/core/types";

describe("storage", () => {
  it("returns default settings when browser storage is empty", async () => {
    const storage = createBrowserTranslatorStorage(createFakeStorageArea());

    await expect(storage.getSettings()).resolves.toEqual(defaultSettings);
  });

  it("persists settings and user dictionary", async () => {
    const area = createFakeStorageArea();
    const storage = createBrowserTranslatorStorage(area);
    const dictionary: KeywordDictionary = {
      schemaVersion: 1,
      dictionaryVersion: "user.1",
      name: "User Dictionary",
      entries: [
        {
          id: "react",
          keyword: "React",
          translation: "反应式框架",
          domain: "software",
          caseSensitive: true,
          matchStrategy: "word-boundary",
          enabled: true,
          source: "user",
          version: 1
        }
      ]
    };

    await storage.saveSettings({ enabled: false, inlineInjection: true, dictionaryVersion: "custom" });
    await storage.saveUserDictionary(dictionary);

    await expect(storage.getSettings()).resolves.toEqual({
      enabled: false,
      inlineInjection: true,
      dictionaryVersion: "custom"
    });
    await expect(storage.getUserDictionary()).resolves.toEqual(dictionary);
  });
});

function createFakeStorageArea() {
  const data = new Map<string, unknown>();

  return {
    async get(keys?: string | string[]) {
      if (!keys) return Object.fromEntries(data.entries());
      const requested = Array.isArray(keys) ? keys : [keys];
      return Object.fromEntries(requested.map((key) => [key, data.get(key)]));
    },
    async set(values: Record<string, unknown>) {
      for (const [key, value] of Object.entries(values)) {
        data.set(key, value);
      }
    }
  };
}
