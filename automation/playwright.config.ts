import { defineConfig } from "@playwright/test";
import * as dotenv from "dotenv";
import * as path from "path";

// Load single shared env file for all suites
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig({
  // Paths are now relative to the automation folder
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  timeout: 120_000,
  retries: 0,
  use: {
    baseURL: "https://api.hubapi.com",
  },
  outputDir: "./test-results",
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "./playwright-report" }],
  ],
});
