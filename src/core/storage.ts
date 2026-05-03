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
