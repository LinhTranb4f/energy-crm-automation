import { test, expect } from "@playwright/test";
import {
  getDealBillingCycle,
  isDealEligible,
  getDealLineItemsTotal,
  getAllInvoicesForDeal,
} from "./hubspot";
import { fetchPdfBuffer, extractTotalInklMwStChf } from "./pdf";

const TOLERANCE = 0.01;

test.describe("Deal → Quote → Invoice → PDF amount validation", () => {
  test.skip(
    !process.env.HUBSPOT_ACCESS_TOKEN,
    "HUBSPOT_ACCESS_TOKEN not set – skipping"
  );

  const dealId = process.env.DEAL_ID ?? "479533550797";

  test(`Validate amounts for deal ${dealId}`, async () => {
    console.log(`\n=== Deal ${dealId} ===`);

    // 1. Eligibility check (billing_cycle)
    const billingCycle = await getDealBillingCycle(dealId);
    console.log(`  billing_cycle: "${billingCycle ?? "(empty)"}"`);
    if (!isDealEligible(billingCycle)) {
      test.skip(
        true,
        `billing_cycle="${billingCycle}" is not upfront / End of campaign / empty`
      );
      return;
    }

    // 2. Deal line items total (net, before tax)
    const dealNetTotal = await getDealLineItemsTotal(dealId);
    console.log(`  Deal line items total (net): ${dealNetTotal}`);
    expect(dealNetTotal).toBeGreaterThan(0);

    // 3. All invoices (subtotal = net, grossTotal = incl. tax)
    const invoices = await getAllInvoicesForDeal(dealId);
    expect(invoices.length).toBeGreaterThan(0);

    const invoiceNetSum = Math.round(
      invoices.reduce((s, i) => s + i.subtotal, 0) * 100
    ) / 100;
    const invoiceGrossSum = Math.round(
      invoices.reduce((s, i) => s + i.grossTotal, 0) * 100
    ) / 100;
    console.log(
      `  Invoice(s) net sum: ${invoiceNetSum}, gross sum: ${invoiceGrossSum} (${invoices.length} invoice(s))`
    );

    // 4. PDF totals (gross, inkl. MwSt.)
    let pdfGrossSum = 0;
    let pdfCount = 0;
    for (const inv of invoices) {
      if (!inv.pandadocUrl) {
        console.log(
          `  Invoice ${inv.id}: no PandaDoc URL – skipping PDF check`
        );
        continue;
      }
      console.log(`  Fetching PDF for invoice ${inv.id}...`);
      const pdfBuf = await fetchPdfBuffer(inv.pandadocUrl);
      const pdfTotal = await extractTotalInklMwStChf(pdfBuf);
      pdfGrossSum += pdfTotal;
      pdfCount++;
      console.log(`  Invoice ${inv.id} PDF gross total: ${pdfTotal}`);
    }
    pdfGrossSum = Math.round(pdfGrossSum * 100) / 100;
    console.log(`  PDF gross total sum: ${pdfGrossSum} (${pdfCount} PDF(s))`);

    // ---- Assertions ----
    console.log("\n  --- Assertions ---");

    // A) Deal net ≈ Invoice subtotal sum
    console.log(
      `  [A] Deal net (${dealNetTotal}) vs Invoice net sum (${invoiceNetSum})`
    );
    expect(
      Math.abs(dealNetTotal - invoiceNetSum),
      `Deal net total (${dealNetTotal}) should match invoice subtotal sum (${invoiceNetSum})`
    ).toBeLessThan(TOLERANCE);

    // B) Invoice gross ≈ PDF gross
    if (pdfCount > 0) {
      console.log(
        `  [B] Invoice gross sum (${invoiceGrossSum}) vs PDF gross sum (${pdfGrossSum})`
      );
      expect(
        Math.abs(invoiceGrossSum - pdfGrossSum),
        `Invoice gross sum (${invoiceGrossSum}) should match PDF gross sum (${pdfGrossSum})`
      ).toBeLessThan(TOLERANCE);
    } else {
      console.log("  [B] No PDFs found – skipping gross comparison");
    }

    console.log("\n  All assertions passed!\n");
  });
});
