import { test, expect } from "@playwright/test";
import path from "path";
import {
  PHASE2_DEAL_PROPERTIES,
  PHASE2_LINE_ITEM_PROPERTIES,
} from "../helpers/crm-schema";
import {
  readPhase1GoldenRecord,
  writePhase2DealArtifact,
  type Phase2DealArtifact,
} from "../helpers/phase2-golden-record";
import {
  getDealLineItemsTotal,
  getDealProperties,
  listDealPipelines,
} from "../hubspot";
import { waitForCondition } from "../helpers/polling";

test.describe.serial("Phase 2: Deal + Line Items (design)", () => {
  const e2eDir = __dirname;
  const golden = readPhase1GoldenRecord(e2eDir);

  test("design: create deal from Golden Record and verify Phase 2 prerequisites", async () => {
    // Placeholder: this test will be implemented to:
    // - create a Sales Pipeline deal associated to Phase 1 company/contact
    // - add line items for radio_spots and at least one non-radio product
    // - assert WF 1026 / 1027 / 1030 behavior and n8n line item sync

    // Schema sanity check using live pipeline/props (read-only)
    const pipelines = await listDealPipelines();
    expect(pipelines.length).toBeGreaterThan(0);

    // Example of how assertions will later use PHASE2_* constants
    expect(PHASE2_DEAL_PROPERTIES).toContain("billing_cycle");
    expect(PHASE2_LINE_ITEM_PROPERTIES).toContain("product_group");

    // This call shape will be reused once createDeal exists
    // const dealId = await createDeal({...});
    const fakeDealId = "0"; // placeholder to keep design file compiling

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

    // Placeholder artifact wiring for Phase 3
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

