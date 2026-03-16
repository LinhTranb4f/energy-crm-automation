import { test, expect } from "@playwright/test";
import path from "path";
import { readPhase1GoldenRecord } from "../helpers/phase2-golden-record";
import { getCalculatedQuoteTotal, getDealProperties } from "../hubspot";
import { waitForCondition } from "../helpers/polling";

test.describe.serial("Phase 2: Quote → Deal Amount Sync (design)", () => {
  const e2eDir = __dirname;
  const golden = readPhase1GoldenRecord(e2eDir);

  test("design: quote with status 'Approval Not Needed' updates deal amount via n8n", async () => {
    // Placeholder structure only:
    // - create quote for Phase 2 deal
    // - set hs_status / hs_title to match Trigger new quote created workflow
    // - poll deal.amount until it matches getCalculatedQuoteTotal(quoteId)

    const fakeDealId = "0";
    const fakeQuoteId = "0";

    const expectedTotal = await getCalculatedQuoteTotal(fakeQuoteId).catch(
      () => 0,
    );

    await waitForCondition(
      async () => {
        const props = await getDealProperties(fakeDealId, ["amount"]);
        const current = parseFloat(props.amount ?? "0");
        if (!expectedTotal) return current > 0;
        return Math.abs(current - expectedTotal) < 0.01;
      },
      {
        timeoutMs: 120_000,
        intervalMs: 5_000,
        description:
          "Deal amount updated by n8n 'HubSpot | Update deal Amount to match new quote amount'",
      },
    );

    expect(true).toBe(true);
  });
});

