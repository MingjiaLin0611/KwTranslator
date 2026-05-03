import { expect, test, chromium } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

test("browser harness injects inline translations on a real page", async ({ page }) => {
  const builtContentScript = path.resolve(".output/chrome-mv3/content-scripts/content.js");
  test.skip(!fs.existsSync(builtContentScript), "Run npm run build before npm run test:e2e.");

  await page.setContent("<main><p>This documentation is focusing on Software Engineering.</p><code>API</code></main>");
  await installMockExtensionStorage(page);
  await page.addScriptTag({ content: fs.readFileSync(builtContentScript, "utf8") });

  await expect(page.locator("body")).toContainText("Software Engineering(软件工程)");
  await expect(page.locator("code")).toHaveText("API");
});

test("browser harness skips inline translations when disabled", async ({ page }) => {
  const builtContentScript = path.resolve(".output/chrome-mv3/content-scripts/content.js");
  test.skip(!fs.existsSync(builtContentScript), "Run npm run build before npm run test:e2e.");

  await page.setContent("<main><p>This documentation is focusing on Software Engineering.</p></main>");
  await installMockExtensionStorage(page, {
    "kwTranslator.settings": {
      enabled: false,
      inlineInjection: true,
      dictionaryVersion: "m1.0.0"
    }
  });
  await page.addScriptTag({ content: fs.readFileSync(builtContentScript, "utf8") });

  await expect(page.locator("body")).not.toContainText("软件工程");
});

test("browser harness injects imported user dictionary translations", async ({ page }) => {
  const builtContentScript = path.resolve(".output/chrome-mv3/content-scripts/content.js");
  test.skip(!fs.existsSync(builtContentScript), "Run npm run build before npm run test:e2e.");

  await page.setContent("<main><p>React improves Software Engineering workflows.</p></main>");
  await installMockExtensionStorage(page, {
    "kwTranslator.userDictionary": {
      schemaVersion: 1,
      dictionaryVersion: "user.1",
      name: "User Dictionary",
      entries: [
        {
          id: "react",
          keyword: "React",
          translation: "反应式框架",
          domain: "software",
          caseSensitive: false,
          matchStrategy: "word-boundary",
          enabled: true,
          source: "user",
          version: 1
        }
      ]
    }
  });
  await page.addScriptTag({ content: fs.readFileSync(builtContentScript, "utf8") });

  await expect(page.locator("body")).toContainText("React(反应式框架)");
  await expect(page.locator("body")).toContainText("Software Engineering(软件工程)");
});

test("built extension injects inline translations on a real page", async () => {
  const extensionPath = path.resolve(".output/chrome-mv3");
  test.skip(!fs.existsSync(extensionPath), "Run npm run build before npm run test:e2e.");
  const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? findLocalPlaywrightChromium();
  const loadedExtensionPath = copyExtensionToAsciiTemp(extensionPath);

  const userDataDir = makeAsciiTempDir("kw-translator-e2e-");
  let context;

  try {
    context = await chromium.launchPersistentContext(userDataDir, {
      executablePath,
      headless: false,
      ignoreDefaultArgs: ["--disable-extensions"],
      args: [
        `--disable-extensions-except=${loadedExtensionPath}`,
        `--load-extension=${loadedExtensionPath}`,
        "--no-first-run",
        "--no-default-browser-check"
      ]
    });
  } catch (error) {
    throw new Error(
      `Unable to launch Chromium for extension E2E. Run "npx playwright install chromium" or set PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH. Cause: ${String(error)}`
    );
  }

  const page = await context.newPage();
  await page.route("http://kw-translator.test/harness", async (route) => {
    await route.fulfill({
      contentType: "text/html",
      body: "<main><p>This documentation is focusing on Software Engineering.</p><code>API</code></main>"
    });
  });
  await page.goto("http://kw-translator.test/harness");
  await page.waitForFunction(() => document.body.textContent?.includes("软件工程"));

  await expect(page.locator("body")).toContainText("Software Engineering(软件工程)");
  await expect(page.locator("code")).toHaveText("API");

  await context.close();
});

function copyExtensionToAsciiTemp(extensionPath: string): string {
  const target = makeAsciiTempDir("kw-extension-");
  copyDirectory(extensionPath, target);
  return target;
}

async function installMockExtensionStorage(page: { evaluate: (fn: (initialData?: Record<string, unknown>) => void, data?: Record<string, unknown>) => Promise<void> }, initialData: Record<string, unknown> = {}): Promise<void> {
  await page.evaluate((data) => {
    const store = { ...data };
    const area = {
      async get(keys?: string | string[]) {
        if (!keys) return { ...store };
        const requested = Array.isArray(keys) ? keys : [keys];
        return Object.fromEntries(requested.map((key) => [key, store[key]]));
      },
      async set(values: Record<string, unknown>) {
        Object.assign(store, values);
      },
      async remove(keys: string | string[]) {
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
        runtime: { id: "kw-translator-e2e" },
        storage: {
          local: area,
          session: area,
          sync: area,
          managed: area
        }
      }
    });
  }, initialData);
}

function findLocalPlaywrightChromium(): string | undefined {
  const roots = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, "ms-playwright") : undefined
  ].filter((root): root is string => !!root && fs.existsSync(root));

  for (const root of roots) {
    const candidates = fs
      .readdirSync(root)
      .filter((name) => name.startsWith("chromium-"))
      .sort()
      .reverse()
      .flatMap((name) => [
        path.join(root, name, "chrome-win", "chrome.exe"),
        path.join(root, name, "chrome-win64", "chrome.exe")
      ]);

    const found = candidates.find((candidate) => fs.existsSync(candidate));
    if (found) return found;
  }

  return undefined;
}

function makeAsciiTempDir(prefix: string): string {
  const root = fs.existsSync("C:\\") ? "C:\\" : os.tmpdir();
  return fs.mkdtempSync(path.join(root, prefix));
}

function copyDirectory(source: string, target: string): void {
  fs.mkdirSync(target, { recursive: true });

  for (const name of fs.readdirSync(source)) {
    const sourcePath = path.join(source, name);
    const targetPath = path.join(target, name);
    const stats = fs.statSync(sourcePath);

    if (stats.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
  }
}
