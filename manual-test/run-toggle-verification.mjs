import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const builtContentScript = path.join(root, ".output", "chrome-mv3", "content-scripts", "content.js");
const staticPage = path.join(root, "manual-test", "ai-vocabulary-static.html");
const outputDir = path.join(root, "manual-test", "screenshots");
const realUrl = "https://huggingface.co/blog/sensenova/neo-unify";

if (!fs.existsSync(builtContentScript)) {
  throw new Error("Build the extension first with npm run build.");
}

fs.mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch();

try {
  const staticResult = await verifyPage({
    url: `file:///${staticPage.replaceAll("\\", "/")}`,
    name: "static-ai-vocabulary",
    waitForText: "提示词工程"
  });

  const realResult = await verifyPage({
    url: realUrl,
    name: "huggingface-neo-unify",
    waitForText: "模型"
  });

  console.log(JSON.stringify({ staticResult, realResult }, null, 2));
} finally {
  await browser.close();
}

async function verifyPage({ url, name, waitForText }) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const screenshots = {
    enabled: path.join(outputDir, `${name}-enabled.png`),
    disabled: path.join(outputDir, `${name}-disabled.png`),
    reenabled: path.join(outputDir, `${name}-reenabled.png`)
  };

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await installMockExtensionRuntime(page);
    await page.addScriptTag({ content: fs.readFileSync(builtContentScript, "utf8") });
    await page.waitForFunction((text) => document.body.textContent?.includes(text), waitForText, {
      timeout: 10_000
    });
    await page.screenshot({ path: screenshots.enabled, fullPage: true });
    const enabledText = await page.locator("body").innerText();

    await dispatchSetEnabledMessage(page, false);
    await page.waitForFunction((text) => !document.body.textContent?.includes(text), waitForText, {
      timeout: 10_000
    });
    await page.screenshot({ path: screenshots.disabled, fullPage: true });
    const disabledText = await page.locator("body").innerText();

    await dispatchSetEnabledMessage(page, true);
    await page.waitForFunction((text) => document.body.textContent?.includes(text), waitForText, {
      timeout: 10_000
    });
    await page.screenshot({ path: screenshots.reenabled, fullPage: true });
    const reenabledText = await page.locator("body").innerText();

    return {
      ok: true,
      url,
      screenshots,
      markers: {
        enabledContainsMarker: enabledText.includes(waitForText),
        disabledContainsMarker: disabledText.includes(waitForText),
        reenabledContainsMarker: reenabledText.includes(waitForText)
      },
      sampleText: firstInterestingLines(reenabledText)
    };
  } catch (error) {
    await page.screenshot({ path: path.join(outputDir, `${name}-failure.png`), fullPage: true }).catch(() => {});
    return {
      ok: false,
      url,
      screenshots,
      error: error instanceof Error ? error.message : String(error)
    };
  } finally {
    await page.close();
  }
}

async function installMockExtensionRuntime(page) {
  await page.evaluate(() => {
    const store = {};
    const messageListeners = [];
    const area = {
      async get(keys) {
        if (!keys) return { ...store };
        const requested = Array.isArray(keys) ? keys : [keys];
        return Object.fromEntries(requested.map((key) => [key, store[key]]));
      },
      async set(values) {
        Object.assign(store, values);
      },
      async remove(keys) {
        for (const key of Array.isArray(keys) ? keys : [keys]) {
          delete store[key];
        }
      },
      onChanged: {
        addListener() {},
        removeListener() {}
      }
    };

    Object.assign(globalThis, {
      chrome: {
        runtime: {
          id: "kw-translator-manual",
          onMessage: {
            addListener(listener) {
              messageListeners.push(listener);
            },
            removeListener(listener) {
              const index = messageListeners.indexOf(listener);
              if (index >= 0) messageListeners.splice(index, 1);
            }
          }
        },
        storage: {
          local: area,
          session: area,
          sync: area,
          managed: area
        }
      },
      __kwTranslatorDispatchMessage(message) {
        return Promise.all(
          messageListeners.map(
            (listener) =>
              new Promise((resolve) => {
                const returned = listener(message, {}, resolve);
                if (!returned) resolve(undefined);
              })
          )
        );
      }
    });
  });
}

async function dispatchSetEnabledMessage(page, enabled) {
  await page.evaluate(
    (nextEnabled) =>
      globalThis.__kwTranslatorDispatchMessage({
        type: "KW_TRANSLATOR_SET_ENABLED",
        enabled: nextEnabled
      }),
    enabled
  );
}

function firstInterestingLines(text) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.includes("(") && line.includes(")"))
    .slice(0, 8);
}
