# NRJ HubSpot Automation & QA

**Playwright-based API and E2E tests for the HubSpot CRM pipeline: order journey, n8n workflows, PDF validation, and HubDB line-item calculators.**

This repository validates the flow from company/contact creation through deals, line items, quotes, invoices, and PDF amounts—including integration with n8n (SAP, Delfin, PandaDoc) and HubDB-driven line-item calculation rules. The framework follows the **API Action Pattern**: a shared client, reusable action functions, and data/loaders for payloads and schema validation.

---

## What’s in this repo

| Area | Description |
|------|-------------|
| **E2E (order pipeline)** | Phase-based specs under `automation/tests/e2e/`: Phase 1 (company + contact + association), Phase 2 (deal + line items, quote → deal amount). Uses golden records between phases. |
| **Regression** | Standalone deal → quote → invoice → PDF amount validation (`tests/regression/deal-quote-invoice-pdf.spec.ts`). Not part of the serial E2E flow. |
| **Line-Item Calculation QA** | Validates HubSpot line items (Radio Spots, Digital Spots, Audio Production, Radio Sponsoring) against HubDB calculator logic (`tests/line-item-calc-qa/`). |
| **Docs** | HubSpot ↔ n8n workflow map (`docs/hs-n8n/`), business overview (`docs/BUSINESS_OVERVIEW.md`), and framework blueprints (API Action, SOM, API Client) in `docs/`. |

---

## Quick start

```bash
cd automation
# Create .env with at least:
#   HUBSPOT_ACCESS_TOKEN=pat-eu1-...
npm install
npm test
```

**Run subsets:**

```bash
npx playwright test tests/e2e/              # E2E phases 1–3
npx playwright test tests/regression/        # Deal–invoice–PDF validation
npx playwright test tests/line-item-calc-qa/ # Line-item calculation QA
```

**Optional env (see `client/env.ts`):**

- `HUBSPOT_BASE_URL` — default `https://api.hubapi.com`
- `ORDER_PIPELINE_ID` — default `3387257046`
- `CLEANUP_AFTER_PHASE1=1` — run cleanup after Phase 1 E2E when testing in isolation
- `DEAL_ID` / `LINE_ITEM_IDS` — for regression and line-item-calc (otherwise demo IDs used)
- `GEMINI_API_KEY` or `GOOGLE_API_KEY` — for Phase 1 test data generation (otherwise static DE/CH fallback)

---

## Tech stack

- **[Playwright](https://playwright.dev/)** (TypeScript) — API tests via `request` fixture; no browser required.
- **HubSpot CRM API** — Companies, contacts, deals, quotes, line items, invoices, associations.
- **n8n** — Webhooks and workflows (see `docs/hs-n8n/`, `docs/n8n/`).
- **pdf-parse** — Extract invoice totals for PDF validation.
- **AJV** — JSON Schema validation in `data/loaders/schemaValidator.ts`.

---

## Documentation

- **Framework design:** `docs/PLAYWRIGHT_API_ACTION_PATTERN_DRAFT.md`, `docs/PLAYWRIGHT_API_FRAMEWORK_BLUEPRINT.md`, `docs/PLAYWRIGHT_API_CLIENT_PATTERN_DRAFT.md`, `docs/FRAMEWORK_COMPARISON_AND_RECOMMENDATION.md`
- **HubSpot workflows:** `docs/hubspot/`
- **n8n workflows:** `docs/n8n/`
- **Business / HS–n8n:** `docs/BUSINESS_OVERVIEW.md`, `docs/hs-n8n/`
