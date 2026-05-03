import { builtinDictionary, mergeDictionaries } from "./dictionary";
import { injectInlineTranslations } from "./injector";
import type { TranslatorStorage } from "./storage";
import type { InjectionRecord } from "./types";

export async function runPageTranslation(doc: Document, storage: TranslatorStorage): Promise<InjectionRecord[]> {
  const body = doc.body;
  if (!body) return [];

  const settings = await storage.getSettings();
  if (!settings.enabled || !settings.inlineInjection) return [];

  const userDictionary = await storage.getUserDictionary();
  const dictionary = mergeDictionaries(builtinDictionary, userDictionary);
  if (dictionary.entries.length === 0) return [];

  return injectInlineTranslations(body, dictionary.entries);
}
