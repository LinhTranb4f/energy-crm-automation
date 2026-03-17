import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.resolve(__dirname, "..", "..", "data");

export function loadPayload<T = Record<string, unknown>>(
  relativePath: string,
  overrides?: Partial<T>,
): T {
  const fullPath = path.join(DATA_DIR, "payloads", relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const parsed = JSON.parse(raw) as T;
  return overrides ? ({ ...parsed, ...overrides } as T) : parsed;
}

