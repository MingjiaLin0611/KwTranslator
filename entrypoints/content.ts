import { browser } from "wxt/browser";
import { isSetEnabledMessage, type SetEnabledResponse } from "../src/core/messages";
import { createPageTranslationController } from "../src/core/runtime";
import { createBrowserTranslatorStorage } from "../src/core/storage";

export default defineContentScript({
  matches: ["<all_urls>"],
  main() {
    const controller = createPageTranslationController(document, createBrowserTranslatorStorage());

    void controller.enableTranslation();

    browser.runtime.onMessage.addListener((message: unknown, _sender, sendResponse) => {
      if (!isSetEnabledMessage(message)) return false;

      void controller
        .applyEnabledState(message.enabled)
        .then((records) => sendResponse({ ok: true, records } satisfies SetEnabledResponse))
        .catch((error) =>
          sendResponse({
            ok: false,
            error: error instanceof Error ? error.message : String(error)
          } satisfies SetEnabledResponse)
        );

      return true;
    });
  }
});
