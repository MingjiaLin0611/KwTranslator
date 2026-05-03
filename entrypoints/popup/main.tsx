import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  builtinDictionary,
  createDictionaryExport,
  mergeDictionaries,
  parseDictionaryImport
} from "../../src/core/dictionary";
import {
  createBrowserTranslatorStorage,
  defaultSettings,
  type TranslatorSettings,
  type TranslatorStorage
} from "../../src/core/storage";
import type { KeywordDictionary } from "../../src/core/types";
import "./style.css";

interface AppProps {
  storage?: TranslatorStorage;
}

export function App({ storage = createBrowserTranslatorStorage() }: AppProps) {
  const [settings, setSettings] = useState<TranslatorSettings>(defaultSettings);
  const [userDictionary, setUserDictionary] = useState<KeywordDictionary | undefined>();
  const [error, setError] = useState("");
  const importInputRef = useRef<HTMLInputElement>(null);
  const mergedDictionary = useMemo(() => mergeDictionaries(builtinDictionary, userDictionary), [userDictionary]);

  useEffect(() => {
    let cancelled = false;

    async function loadState() {
      const [storedSettings, storedDictionary] = await Promise.all([
        storage.getSettings(),
        storage.getUserDictionary()
      ]);

      if (!cancelled) {
        setSettings(storedSettings);
        setUserDictionary(storedDictionary);
      }
    }

    void loadState();

    return () => {
      cancelled = true;
    };
  }, [storage]);

  async function toggleEnabled() {
    const next = { ...settings, enabled: !settings.enabled };
    setSettings(next);
    await storage.saveSettings(next);
  }

  async function importDictionary(file: File | undefined) {
    if (!file) return;

    const content = await readFileText(file);
    const result = parseDictionaryImport(content);

    if (!result.valid) {
      const reason = result.rejected[0]?.reason ?? result.conflicts[0]?.keyword ?? "dictionary import failed";
      setError(reason);
      return;
    }

    const parsed = JSON.parse(content) as KeywordDictionary;
    const nextDictionary: KeywordDictionary = {
      schemaVersion: parsed.schemaVersion,
      dictionaryVersion: parsed.dictionaryVersion,
      name: parsed.name,
      entries: result.accepted
    };

    await storage.saveUserDictionary(nextDictionary);
    setUserDictionary(nextDictionary);
    setError("");
  }

  function exportDictionary() {
    if (!userDictionary) return;

    const blob = new Blob([createDictionaryExport(userDictionary)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${userDictionary.dictionaryVersion}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main>
      <h1>KW Translator</h1>
      <dl>
        <div>
          <dt>Status</dt>
          <dd data-testid="status">{settings.enabled ? "Enabled" : "Disabled"}</dd>
        </div>
        <div>
          <dt>Dictionary</dt>
          <dd>{builtinDictionary.dictionaryVersion}</dd>
        </div>
        <div>
          <dt>Builtin Entries</dt>
          <dd data-testid="builtin-count">{builtinDictionary.entries.length}</dd>
        </div>
        <div>
          <dt>User Entries</dt>
          <dd data-testid="user-count">{userDictionary?.entries.length ?? 0}</dd>
        </div>
        <div>
          <dt>Total Entries</dt>
          <dd data-testid="total-count">{mergedDictionary.entries.length}</dd>
        </div>
      </dl>

      <section className="controls" aria-label="Dictionary controls">
        <button data-testid="toggle-enabled" type="button" onClick={() => void toggleEnabled()}>
          {settings.enabled ? "Disable" : "Enable"}
        </button>
        <button type="button" onClick={() => importInputRef.current?.click()}>
          Import
        </button>
        <button type="button" onClick={exportDictionary} disabled={!userDictionary}>
          Export
        </button>
        <input
          ref={importInputRef}
          data-testid="import-file"
          type="file"
          accept="application/json"
          onChange={(event) => void importDictionary(event.currentTarget.files?.[0])}
        />
      </section>

      {error ? (
        <p className="error" data-testid="error" role="alert">
          {error}
        </p>
      ) : null}
    </main>
  );
}

async function readFileText(file: File): Promise<string> {
  if ("text" in file && typeof file.text === "function") {
    return file.text();
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error ?? new Error("unable to read file"));
    reader.readAsText(file);
  });
}

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
