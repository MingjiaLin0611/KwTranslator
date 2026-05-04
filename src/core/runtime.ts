import { builtinDictionary, mergeDictionaries } from "./dictionary";
import { injectInlineTranslations } from "./injector";
import { collectEligibleTextNodes } from "./scanner";
import type { TranslatorStorage } from "./storage";
import type { InjectionRecord, KeywordEntry } from "./types";

export interface PageTranslationController {
  enableTranslation(): Promise<InjectionRecord[]>;
  disableTranslation(): InjectionRecord[];
  applyEnabledState(enabled: boolean): Promise<InjectionRecord[]>;
}

export async function runPageTranslation(doc: Document, storage: TranslatorStorage): Promise<InjectionRecord[]> {
  return createPageTranslationController(doc, storage).enableTranslation();
}

export function createPageTranslationController(doc: Document, storage: TranslatorStorage): PageTranslationController {
  const originals = new Map<Text, string>();

  return {
    async enableTranslation() {
      const body = doc.body;
      if (!body) return [];

      const settings = await storage.getSettings();
      if (!settings.enabled || !settings.inlineInjection) return [];

      const userDictionary = await storage.getUserDictionary();
      const dictionary = mergeDictionaries(builtinDictionary, userDictionary);
      if (dictionary.entries.length === 0) return [];

      return injectAndRememberOriginals(body, dictionary.entries, originals);
    },

    disableTranslation() {
      const records: InjectionRecord[] = [];

      for (const [node, before] of originals.entries()) {
        const after = node.textContent ?? "";

        if (!node.isConnected) {
          records.push({
            before,
            after,
            success: false,
            duplicatePrevented: false,
            skipReason: "node-removed"
          });
          continue;
        }

        node.textContent = before;
        records.push({
          before: after,
          after: before,
          success: true,
          duplicatePrevented: false
        });
      }

      originals.clear();
      return records;
    },

    async applyEnabledState(enabled) {
      return enabled ? this.enableTranslation() : this.disableTranslation();
    }
  };
}

function injectAndRememberOriginals(
  root: ParentNode,
  entries: KeywordEntry[],
  originals: Map<Text, string>
): InjectionRecord[] {
  const beforeByNode = new Map<Text, string>();

  for (const node of collectEligibleTextNodes(root)) {
    beforeByNode.set(node, node.textContent ?? "");
  }

  const records = injectInlineTranslations(root, entries);

  for (const [node, before] of beforeByNode.entries()) {
    if (!originals.has(node) && node.textContent !== before) {
      originals.set(node, before);
    }
  }

  return records;
}
