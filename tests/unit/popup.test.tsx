import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { App } from "../../entrypoints/popup/main";
import { defaultSettings, type TranslatorStorage } from "@/core/storage";
import type { KeywordDictionary } from "@/core/types";

let root: Root | undefined;
let container: HTMLDivElement | undefined;

describe("popup", () => {
  afterEach(() => {
    if (root) {
      act(() => root?.unmount());
    }
    root = undefined;
    container = undefined;
    document.body.innerHTML = "";
  });

  it("shows enabled status and dictionary counts from storage", async () => {
    await renderPopup(createFakeTranslatorStorage());

    expect(text("status")).toBe("Enabled");
    expect(text("builtin-count")).toBe("3");
    expect(text("user-count")).toBe("1");
    expect(text("total-count")).toBe("4");
  });

  it("persists enabled state changes", async () => {
    const storage = createFakeTranslatorStorage();
    await renderPopup(storage);

    await act(async () => {
      button("toggle-enabled").click();
    });

    expect(await storage.getSettings()).toEqual({ ...defaultSettings, enabled: false });
    expect(text("status")).toBe("Disabled");
  });

  it("imports a valid user dictionary and rejects invalid JSON without replacing it", async () => {
    const storage = createFakeTranslatorStorage();
    await renderPopup(storage);

    await importText(JSON.stringify(userDictionary("user.2", "Vue", "渐进式框架")));
    await waitUntil(async () => (await storage.getUserDictionary())?.dictionaryVersion === "user.2");

    expect(text("user-count")).toBe("1");
    expect(await storage.getUserDictionary()).toEqual(expect.objectContaining({ dictionaryVersion: "user.2" }));

    await importText("{bad json");
    await waitUntil(() => text("error").includes("valid JSON"));

    expect(text("error")).toContain("valid JSON");
    expect(await storage.getUserDictionary()).toEqual(expect.objectContaining({ dictionaryVersion: "user.2" }));
  });
});

async function renderPopup(storage: TranslatorStorage) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);

  await act(async () => {
    root?.render(<App storage={storage} />);
  });
}

async function importText(value: string) {
  const file = new File([value], "dictionary.json", { type: "application/json" });
  const input = container?.querySelector<HTMLInputElement>('[data-testid="import-file"]');
  if (!input) throw new Error("missing import input");

  Object.defineProperty(input, "files", { configurable: true, value: [file] });

  await act(async () => {
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

async function waitUntil(predicate: () => boolean | Promise<boolean>) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (await predicate()) return;
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  }

  throw new Error("condition was not met");
}

function text(testId: string): string {
  return container?.querySelector(`[data-testid="${testId}"]`)?.textContent ?? "";
}

function button(testId: string): HTMLButtonElement {
  const found = container?.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`);
  if (!found) throw new Error(`missing ${testId}`);
  return found;
}

function createFakeTranslatorStorage(): TranslatorStorage {
  let settings = defaultSettings;
  let dictionary: KeywordDictionary | undefined = userDictionary("user.1", "React", "反应式框架");

  return {
    async getSettings() {
      return settings;
    },
    async saveSettings(next) {
      settings = next;
    },
    async getUserDictionary() {
      return dictionary;
    },
    async saveUserDictionary(next) {
      dictionary = next;
    }
  };
}

function userDictionary(version: string, keyword: string, translation: string): KeywordDictionary {
  return {
    schemaVersion: 1,
    dictionaryVersion: version,
    name: "User Dictionary",
    entries: [
      {
        id: keyword.toLowerCase(),
        keyword,
        translation,
        domain: "software",
        caseSensitive: false,
        matchStrategy: "word-boundary",
        enabled: true,
        source: "user",
        version: 1
      }
    ]
  };
}
