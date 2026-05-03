import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: false,
  use: {
    ...devices["Desktop Chrome"],
    trace: "retain-on-failure"
  }
});
