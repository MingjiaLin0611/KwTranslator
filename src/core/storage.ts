import { browser } from "wxt/browser";
import { createDefaultCustomDictionaryCollection } from "./dictionary";
import type { CustomDictionaryCollection, KeywordDictionary } from "./types";

export interface TranslatorSettings {
  enabled: boolean;
  inlineInjection: boolean;
  dictionaryVersion: string;
}

export interface TranslatorStorage {
  getSettings(): Promise<TranslatorSettings>;
  saveSettings(settings: TranslatorSettings): Promise<void>;
  getUserDictionary(): Promise<KeywordDictionary | undefined>;
  saveUserDictionary(dictionary: KeywordDictionary): Promise<void>;
  getCustomDictionaryCollection(): Promise<CustomDictionaryCollection>;
  saveCustomDictionaryCollection(collection: CustomDictionaryCollection): Promise<void>;
}

export const defaultSettings: TranslatorSettings = {
  enabled: true,
  inlineInjection: true,
  dictionaryVersion: "m1.0.0"
};

interface StorageArea {
  get(keys?: string | string[]): Promise<Record<string, unknown>>;
  set(values: Record<string, unknown>): Promise<void>;
}

const SETTINGS_KEY = "kwTranslator.settings";
const USER_DICTIONARY_KEY = "kwTranslator.userDictionary";
const CUSTOM_DICTIONARIES_KEY = "kwTranslator.customDictionaries";

export function createBrowserTranslatorStorage(storageArea: StorageArea = browser.storage.local): TranslatorStorage {
  return {
    async getSettings() {
      const stored = await storageArea.get(SETTINGS_KEY);
      const settings = stored[SETTINGS_KEY];

      if (!isSettings(settings)) return defaultSettings;

      return {
        ...defaultSettings,
        ...settings
      };
    },

    async saveSettings(settings) {
      await storageArea.set({ [SETTINGS_KEY]: settings });
    },

    async getUserDictionary() {
      const stored = await storageArea.get(USER_DICTIONARY_KEY);
      const dictionary = stored[USER_DICTIONARY_KEY];
      return isDictionary(dictionary) ? dictionary : undefined;
    },

    async saveUserDictionary(dictionary) {
      await storageArea.set({ [USER_DICTIONARY_KEY]: dictionary });
    },

    async getCustomDictionaryCollection() {
      const stored = await storageArea.get(CUSTOM_DICTIONARIES_KEY);
      const collection = stored[CUSTOM_DICTIONARIES_KEY];
      return isCustomDictionaryCollection(collection) ? collection : createDefaultCustomDictionaryCollection();
    },

    async saveCustomDictionaryCollection(collection) {
      await storageArea.set({ [CUSTOM_DICTIONARIES_KEY]: collection });
    }
  };
}

function isSettings(value: unknown): value is TranslatorSettings {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as TranslatorSettings).enabled === "boolean" &&
    typeof (value as TranslatorSettings).inlineInjection === "boolean" &&
    typeof (value as TranslatorSettings).dictionaryVersion === "string"
  );
}

function isDictionary(value: unknown): value is KeywordDictionary {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as KeywordDictionary).schemaVersion === "number" &&
    typeof (value as KeywordDictionary).dictionaryVersion === "string" &&
    Array.isArray((value as KeywordDictionary).entries)
  );
}

function isCustomDictionaryCollection(value: unknown): value is CustomDictionaryCollection {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as CustomDictionaryCollection).schemaVersion === "number" &&
    Array.isArray((value as CustomDictionaryCollection).dictionaries) &&
    typeof (value as CustomDictionaryCollection).activeDictionaryId === "string" &&
    typeof (value as CustomDictionaryCollection).updatedAt === "string"
  );
}
