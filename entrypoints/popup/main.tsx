import React from "react";
import { createRoot } from "react-dom/client";
import { builtinDictionary } from "../../src/core/dictionary";
import "./style.css";

function App() {
  return (
    <main>
      <h1>KW Translator</h1>
      <dl>
        <div>
          <dt>Status</dt>
          <dd>Enabled</dd>
        </div>
        <div>
          <dt>Dictionary</dt>
          <dd>{builtinDictionary.dictionaryVersion}</dd>
        </div>
        <div>
          <dt>Entries</dt>
          <dd>{builtinDictionary.entries.length}</dd>
        </div>
      </dl>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
