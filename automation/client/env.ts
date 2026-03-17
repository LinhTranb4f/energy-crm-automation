import * as dotenv from "dotenv";
import * as path from "path";

// Reuse the shared .env that playwright.config.ts already loads.
// This module is a typed convenience wrapper around process.env.
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

function required(key: string): string {
  const v = process.env[key];
  if (v == null || v === "") {
    throw new Error(`Missing env: ${key}`);
  }
  return v;
}

function optional(key: string, fallback: string): string {
  const v = process.env[key];
  return v == null || v === "" ? fallback : v;
}

export function getEnv() {
  return {
    HUBSPOT_ACCESS_TOKEN: required("HUBSPOT_ACCESS_TOKEN"),
    HUBSPOT_BASE_URL: optional("HUBSPOT_BASE_URL", "https://api.hubapi.com"),
    N8N_BASE_URL: optional("N8N_BASE_URL", "https://n8n.tools.energy"),
    ORDER_PIPELINE_ID: optional("ORDER_PIPELINE_ID", "3387257046"),
  } as const;
}

