import { builtinDictionary } from "../src/core/dictionary";
import { injectInlineTranslations } from "../src/core/injector";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    injectInlineTranslations(document.body, builtinDictionary.entries);
  }
});
