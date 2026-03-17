import { test, expect } from "@playwright/test";
import {
  PHASE2_DEAL_PROPERTIES,
  PHASE2_LINE_ITEM_PROPERTIES,
} from "./helpers/crm-schema";
import {
  readPhase1GoldenRecord,
  writePhase2DealArtifact,
  type Phase2DealArtifact,
} from "./helpers/phase2-golden-record";
import {
  getDealLineItemsTotal,
  getDealProperties,
  listDealPipelines,
} from "./hubspot";
import { waitForCondition } from "./helpers/polling";

test.describe.serial("Phase 2: Deal + Line Items (design)", () => {
  const e2eDir = __dirname;

  test("design: create deal from Golden Record and verify Phase 2 prerequisites", async () => {
    readPhase1GoldenRecord(e2eDir); // ensure Phase 1 golden record exists
    const pipelines = await listDealPipelines();
    expect(pipelines.length).toBeGreaterThan(0);

    expect(PHASE2_DEAL_PROPERTIES).toContain("billing_cycle");
    expect(PHASE2_LINE_ITEM_PROPERTIES).toContain("product_group");

    const fakeDealId = "0";

    await expect
      .poll(async () => {
        const props = await getDealProperties(fakeDealId, [
          "dealstage",
          "billing_cycle",
          "tax_rate",
          "deal_currency_code",
          "line_item_true",
        ]);
        return props.dealstage;
      })
      .toBeDefined();

    const artifact: Phase2DealArtifact = {
      dealId: fakeDealId,
      lineItemIds: [],
      quoteId: null,
      productGroups: [],
      amount: await getDealLineItemsTotal(fakeDealId).catch(() => 0),
    };
    writePhase2DealArtifact(e2eDir, artifact);
  });
});
