# E2E Order Pipeline Specs

Serial execution order: `01` → `02` → … → `10`. Use `--workers=1` when running the full suite.

Business-facing overview: see [`BUSINESS_OVERVIEW.md`](./BUSINESS_OVERVIEW.md) for a plain-language summary of the full order journey from company creation to SAP handoff.

## Phase 1 output (handover to Phase 2)

After `01-company-contact.spec.ts` runs, it writes **`phase1-golden-record.json`** with:

- `companyId`, `contactId` — use for Deal associations in Phase 2 (`associateObjects(deal, company)`, `associateObjects(deal, contact)`).
- `company.status`, `company.name`, `contact.email` — for assertions; Phase 2 should use the same company/contact when creating the Deal.

Phase 2 should read this file and pass `companyId` and `contactId` into Deal creation and association calls so n8n (Phase 3) receives a Deal with the correct Company/Contact associations.
