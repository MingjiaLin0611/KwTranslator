import { browser } from "wxt/browser";
import type { KeywordDictionary } from "./types";

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
