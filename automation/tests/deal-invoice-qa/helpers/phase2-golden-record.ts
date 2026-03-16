import * as fs from "fs";
import * as path from "path";
import type { Phase1GoldenRecord } from "./crm-schema";

export interface Phase2DealArtifact {
  dealId: string;
  lineItemIds: string[];
  quoteId: string | null;
  productGroups: string[];
  amount: number;
}

const PHASE1_FILENAME = "phase1-golden-record.json";
const PHASE2_FILENAME = "phase2-deal-artifact.json";

export function readPhase1GoldenRecord(dir: string): Phase1GoldenRecord {
  const filePath = path.join(dir, PHASE1_FILENAME);
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Phase 1 golden record not found at ${filePath}. Run 01-company-contact.spec.ts first.`,
    );
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `Phase 1 golden record at ${filePath} is invalid JSON: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }

  const record = parsed as Partial<Phase1GoldenRecord>;
  if (!record.companyId || !record.contactId) {
    throw new Error(
      `Phase 1 golden record at ${filePath} is missing companyId or contactId.`,
    );
  }

  return record as Phase1GoldenRecord;
}

export function writePhase2DealArtifact(
  dir: string,
  artifact: Phase2DealArtifact,
): void {
  const filePath = path.join(dir, PHASE2_FILENAME);
  const json = JSON.stringify(artifact, null, 2);
  fs.writeFileSync(filePath, json, "utf-8");
}

