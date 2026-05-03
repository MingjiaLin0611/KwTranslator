import { runPageTranslation } from "../src/core/runtime";
import { createBrowserTranslatorStorage } from "../src/core/storage";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    void runPageTranslation(document, createBrowserTranslatorStorage());
  }
});
