import { describe, expect, it } from "vitest";
import { createDefaultCustomDictionaryCollection, createManualKeywordEntry } from "@/core/dictionary";
import { createBrowserTranslatorStorage, defaultSettings } from "@/core/storage";
import type { CustomDictionaryCollection, KeywordDictionary } from "@/core/types";

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

  it("returns the default M3 custom dictionary collection when storage is empty", async () => {
    const storage = createBrowserTranslatorStorage(createFakeStorageArea());

    const collection = await storage.getCustomDictionaryCollection();

    expect(collection).toEqual(
      expect.objectContaining({
        schemaVersion: createDefaultCustomDictionaryCollection().schemaVersion,
        activeDictionaryId: "default-custom-dictionary",
        updatedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/)
      })
    );
    expect(collection.dictionaries[0]).toEqual(
      expect.objectContaining({
        id: "default-custom-dictionary",
        name: "我的词汇表",
        entries: []
      })
    );
  });

  it("persists the M3 custom dictionary collection", async () => {
    const storage = createBrowserTranslatorStorage(createFakeStorageArea());
    const collection: CustomDictionaryCollection = {
      schemaVersion: 1,
      activeDictionaryId: "frontend",
      updatedAt: "2026-05-11T00:00:00.000Z",
      dictionaries: [
        {
          id: "frontend",
          name: "前端术语",
          enabled: true,
          order: 0,
          entries: [
            createManualKeywordEntry({
              dictionaryId: "frontend",
              keyword: "React",
              translation: "React 框架"
            })
          ],
          createdAt: "2026-05-11T00:00:00.000Z",
          updatedAt: "2026-05-11T00:00:00.000Z"
        }
      ]
    };

    await storage.saveCustomDictionaryCollection(collection);

    await expect(storage.getCustomDictionaryCollection()).resolves.toEqual(collection);
  });

  it("does not migrate the old M2 user dictionary into the M3 collection", async () => {
    const storage = createBrowserTranslatorStorage(
      createFakeStorageArea({
        "kwTranslator.userDictionary": {
          schemaVersion: 1,
          dictionaryVersion: "user.1",
          name: "Old M2 Dictionary",
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

    const collection = await storage.getCustomDictionaryCollection();

    expect(collection.dictionaries).toHaveLength(1);
    expect(collection.dictionaries[0]).toEqual(expect.objectContaining({ name: "我的词汇表", entries: [] }));
  });

  it("falls back to the default M3 collection when stored collection shape is invalid", async () => {
    const storage = createBrowserTranslatorStorage(
      createFakeStorageArea({
        "kwTranslator.customDictionaries": {
          schemaVersion: 1,
          dictionaries: "not an array",
          activeDictionaryId: "broken",
          updatedAt: "2026-05-11T00:00:00.000Z"
        }
      })
    );

    const collection = await storage.getCustomDictionaryCollection();

    expect(collection.dictionaries[0]).toEqual(expect.objectContaining({ name: "我的词汇表", entries: [] }));
  });
});

function createFakeStorageArea(initialData: Record<string, unknown> = {}) {
  const data = new Map<string, unknown>(Object.entries(initialData));

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
