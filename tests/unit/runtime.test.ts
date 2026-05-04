import { describe, expect, it, vi } from "vitest";
import { createPageTranslationController, runPageTranslation } from "@/core/runtime";
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

  it("restores translated text when disabled and translates again when re-enabled", async () => {
    document.body.innerHTML = "<p>Prompt Engineering helps Agents use RAG.</p><code>RAG</code>";
    const controller = createPageTranslationController(document, createStorage({}));

    await controller.applyEnabledState(true);

    expect(document.querySelector("p")?.textContent).toContain("Prompt Engineering(提示词工程)");
    expect(document.querySelector("p")?.textContent).toContain("Agents(智能体)");
    expect(document.querySelector("p")?.textContent).toContain("RAG(检索增强生成)");
    expect(document.querySelector("code")?.textContent).toBe("RAG");

    await controller.applyEnabledState(false);

    expect(document.querySelector("p")?.textContent).toBe("Prompt Engineering helps Agents use RAG.");
    expect(document.querySelector("code")?.textContent).toBe("RAG");

    await controller.applyEnabledState(true);

    expect(document.querySelector("p")?.textContent).toContain("Prompt Engineering(提示词工程)");
    expect(document.querySelector("p")?.textContent).not.toContain("提示词工程)(提示词工程");
  });

  it("skips removed text nodes while restoring disabled state", async () => {
    document.body.innerHTML = "<p>Software Engineering</p>";
    const paragraph = document.querySelector("p");
    const controller = createPageTranslationController(document, createStorage({}));

    await controller.applyEnabledState(true);
    paragraph?.remove();

    await expect(controller.applyEnabledState(false)).resolves.toEqual([
      expect.objectContaining({ success: false, skipReason: "node-removed" })
    ]);
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
