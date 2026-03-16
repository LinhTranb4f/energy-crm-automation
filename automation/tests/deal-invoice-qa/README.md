# Deal → Quote → Invoice → PDF Amount QA Test

Validates end-to-end amount consistency for a HubSpot deal:

1. **Deal line items total** (sum of all line item amounts)
2. **Calculated quote total** (from quote associations: line items, discounts, plus deal tax rate)
3. **Invoice total(s)** (single invoice or sum of all for multi-legal-entity deals)
4. **PDF total(s)** (extracted "Total Betrag inkl. MwSt. in CHF" from PandaDoc PDFs)

## Setup

```bash
cp .env.example .env
# Edit .env and set your HUBSPOT_ACCESS_TOKEN
npm install
```

## Run

```bash
# Single deal (default: 479533550797)
npm test

# Specific deal
DEAL_ID=443884441825 npm test
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `HUBSPOT_ACCESS_TOKEN` | Yes | HubSpot Private App token |
| `DEAL_ID` | No | Deal ID to test (default: 479533550797) |
| `GEMINI_API_KEY` or `GOOGLE_API_KEY` | No | When set, Phase 1 E2E uses Gemini AI to generate random company/contact data (Germany or Switzerland only). Otherwise static DE/CH fallback is used. |

## Eligibility

The test only runs for deals with `billing_cycle` set to **Upfront**, **End of campaign**, or **empty**. Other billing cycles are skipped.

## Multiple Legal Entities

When a deal has line items across multiple legal entities (e.g. 1710 and 1711), HubSpot creates one invoice per entity. The test sums all invoice amounts and all PDF totals, then asserts the sums match the deal and quote totals.

---

## E2E Order Pipeline (Phase 1)

Phase 1 spec: `e2e/01-company-contact.spec.ts` — creates Company, Contact, associates them, verifies WF 1007 (company status = Aktiv), and writes the **Golden Record** to `e2e/phase1-golden-record.json` for Phase 2.

**Run Phase 1 only:**
```bash
npx playwright test e2e/01-company-contact.spec.ts
# Optional: cleanup test data after this file (so re-run leaves no orphans)
CLEANUP_AFTER_PHASE1=1 npx playwright test e2e/01-company-contact.spec.ts
```

**Idempotency / re-run:** Phase 1 verification steps (property checks, associations) are read-only and idempotent. Test creation uses unique names/emails (timestamp + random) and a shared cleanup registry. When running the full E2E suite (01–10), cleanup runs from the final spec so re-run does not leave orphan data. When running only Phase 1, set `CLEANUP_AFTER_PHASE1=1` to delete created company/contact after the spec.
