import { chromium } from "@playwright/test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const extensionPath = path.join(root, ".output", "chrome-mv3");
const pagePath = path.join(root, "manual-test", "ai-vocabulary-static.html");
const screenshotPath = path.join(root, "manual-test", "ai-vocabulary-static.png");

if (!fs.existsSync(extensionPath)) {
  throw new Error("Build the extension first with npm run build.");
}

const loadedExtensionPath = copyExtensionToAsciiTemp(extensionPath);
const userDataDir = makeAsciiTempDir("kw-translator-manual-");
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? findLocalPlaywrightChromium();

const context = await chromium.launchPersistentContext(userDataDir, {
  executablePath,
  headless: false,
  ignoreDefaultArgs: ["--disable-extensions"],
  args: [
    `--disable-extensions-except=${loadedExtensionPath}`,
    `--load-extension=${loadedExtensionPath}`,
    "--allow-file-access-from-files",
    "--no-first-run",
    "--no-default-browser-check"
  ]
});

try {
  const page = await context.newPage();
  await page.goto(`file:///${pagePath.replaceAll("\\", "/")}`);
  await page.waitForFunction(() => document.body.textContent?.includes("提示词工程"));
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const bodyText = await page.locator("body").innerText();
  console.log(JSON.stringify({ screenshotPath, bodyText }, null, 2));
} finally {
  await context.close();
}

function copyExtensionToAsciiTemp(source) {
  const target = makeAsciiTempDir("kw-extension-");
  copyDirectory(source, target);
  return target;
}

function findLocalPlaywrightChromium() {
  const roots = [
    process.env.PLAYWRIGHT_BROWSERS_PATH,
    process.env.LOCALAPPDATA ? path.join(process.env.LOCALAPPDATA, "ms-playwright") : undefined
  ].filter((root) => root && fs.existsSync(root));

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

function makeAsciiTempDir(prefix) {
  const tempRoot = fs.existsSync("C:\\") ? "C:\\" : os.tmpdir();
  return fs.mkdtempSync(path.join(tempRoot, prefix));
}

function copyDirectory(source, target) {
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
