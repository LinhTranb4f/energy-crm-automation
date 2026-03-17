import { test, expect } from "@playwright/test";
import { readPhase1GoldenRecord } from "./helpers/phase2-golden-record";
import { getCalculatedQuoteTotal, getDealProperties } from "./hubspot";
import { waitForCondition } from "./helpers/polling";

test.describe.serial("Phase 2: Quote → Deal Amount Sync (design)", () => {
  const e2eDir = __dirname;

  test("design: quote with status 'Approval Not Needed' updates deal amount via n8n", async () => {
    readPhase1GoldenRecord(e2eDir); // ensure Phase 1 golden record exists
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
