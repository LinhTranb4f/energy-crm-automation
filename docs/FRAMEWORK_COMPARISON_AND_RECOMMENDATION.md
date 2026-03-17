# API Framework Comparison & Recommendation for NRJ Automation

**Purpose:** Compare the three proposed approaches (SOM, API Client, API Action) against this project’s context and recommend the best fit.  
**References:** [E2E Order Pipeline Plan](.cursor/plans/e2e_order_pipeline_testing_ebd78c99.plan.md), [SOM Blueprint](./PLAYWRIGHT_API_FRAMEWORK_BLUEPRINT.md), [API Client Draft](./PLAYWRIGHT_API_CLIENT_PATTERN_DRAFT.md), [API Action Draft](./PLAYWRIGHT_API_ACTION_PATTERN_DRAFT.md).

---

## 1. Project Context Summary

| Factor | This project |
|--------|------------------|
| **Backends** | HubSpot CRM (companies, contacts, deals, quotes, line items, custom objects: invoices, projects, services, spots), n8n (webhooks for line-item sync, create-project, create-service-and-spot, invoice doc, SAP), plus Delfin/SAP/PandaDoc in flows |
| **Test style** | Phase-based E2E (01–10): serial execution, golden records between phases, polling for async HubSpot/n8n workflows |
| **Existing code** | `deal-invoice-qa/hubspot.ts` — procedural helpers (`createCompany`, `createDeal`, `hubGet`/`hubPost`/…); `helpers/` (cleanup, polling, crm-schema); `line-item-calc-qa` with its own hubspot-client and calculators |
| **Planned scope** | Many distinct operations (create company/contact/deal, add line items, quote, clone to order pipeline, project/spot/service creation, service lifecycles, invoice creation/PDF/SAP/cancellation) |
| **Need** | Agility to implement pending E2E tests, traceability to `docs/hubspot` / `docs/n8n`, ability to chain steps and share state (e.g. companyId → dealId → orderDealId → invoiceId) |

---

## 2. Three-Way Comparison

| Criterion | Service Object Model (SOM) | API Client Pattern | API Action Pattern |
|----------|----------------------------|--------------------|--------------------|
| **Structure** | Base class → service classes (companies, deals, invoices, …) → fixture injects services | Single `apiClient`; specs call `client.get/post(path, body)` | Single `baseRequest` in `/client`; reusable functions in `/actions` (e.g. `createCompany(req, props)`) |
| **Setup time** | Highest (base + N services + fixture) | Lowest (one client + small lib) | Medium (client + env + one file per action domain) |
| **Maintenance** | One place per operation (service method) | Paths/bodies can duplicate across specs | One place per operation (action function) |
| **Multi-backend** | Separate service classes per backend (HubSpot, n8n) | One client per base URL or one client + path prefixes | Same client; actions can call different base URLs (HubSpot vs n8n) via options |
| **Chaining steps** | Spec calls `hubspot.companies.create()` then `hubspot.deals.create()` etc. | Spec builds paths/bodies and calls client repeatedly | Spec calls `createCompany(req, …)` then `createDeal(req, …)` — natural “steps” |
| **Fit with current code** | Would require refactor from procedural `hubspot.ts` to classes + fixture | Would replace `hubspot.ts` with client; many paths move into specs | Closest to current style: keep procedural “actions,” standardize on one client and `/actions` + `/data` |
| **Scalability (many endpoints)** | Strong (one method per endpoint) | Weak without discipline (path duplication) | Strong (one action per operation; group by domain) |
| **Readability (E2E flow)** | `hubspot.companies.create(props)` | `client.post("/crm/v3/objects/companies", body)` | `createCompany(req, props)` — reads like the business step |
| **Agility** | Heavier to add new operations (new method + possibly fixture) | Fast to add a test (call client with path) but duplication grows | Fast to add an action and reuse in many specs |

---

## 3. Why Not Pure API Client for This Project

- The E2E plan has **10 phases** and many distinct operations. Putting every path and body directly in specs would:
  - Duplicate the same paths (e.g. `/crm/v3/objects/companies`, `/crm/v3/objects/deals`) across 01, 02, 04, etc.
  - Scatter HubSpot/n8n knowledge in many spec files.
- The plan and existing code already assume **reusable helpers** (“extend hubspot.ts with full CRUD helpers”). A single client with no named operations works for small suites but does not match the intended scale.

**Verdict:** API Client alone is a good fit for **small, ad-hoc API checks**, not for the full Offer-to-Cash / order-pipeline E2E.

---

## 4. Why Not Full SOM (For Now)

- **Pros:** Clear ownership per domain, scales to many endpoints, strong traceability to “services.”
- **Cons for this project:**
  - Current code is **procedural** (`hubspot.ts` with functions). Moving to base class + multiple service classes + fixture is a larger refactor.
  - You have **two main backends** (HubSpot, n8n) and a need for **speed**: adding a new step (e.g. “create project”) should be one function, not a new class or fixture wiring.
- **When to revisit SOM:** If HubSpot becomes the dominant surface with 100+ distinct endpoints and you want a single, consistent `hubspot.deals.*`, `hubspot.invoices.*` surface, introduce a **thin SOM for HubSpot only** and keep the rest action-based.

**Verdict:** SOM is the most “enterprise” structure but is more than you need to get the E2E plan implemented quickly. Keep it as an option for a later, HubSpot-centric expansion.

---

## 5. Recommended Approach: API Action Pattern

**Best fit for this project: API Action Pattern**, with a single shared client and actions grouped by domain.

### 5.1 Why It Fits

1. **Matches the E2E flow**  
   The plan is a linear chain: Company → Contact → Deal → Line Items → Quote → Closed Won → Clone → Order Pipeline → Project/Spots → Services → Service lifecycles → Invoices → PDF → SAP → Cancellation. Actions map directly to these steps: `createCompany`, `createDeal`, `cloneDealToOrderPipeline`, `validateInvoice`, etc. Specs read like the business process.

2. **Multi-backend without extra structure**  
   One `baseRequest` (or two if you prefer separate HubSpot/n8n clients). Actions can live in `company.actions.ts`, `deal.actions.ts`, `invoice.actions.ts`, `n8n.actions.ts`. No need for a class hierarchy; n8n steps are just more actions (e.g. `triggerCreateProject(req, dealId)`).

3. **Aligns with current code**  
   `hubspot.ts` is already a set of procedural functions. Migrating to “actions” means:
   - Replace internal `hubGet`/`hubPost` with a **Playwright-backed** `baseRequest` (so you get one request context, consistent logging, and optional tracing).
   - Group those functions into `/actions` (and optionally `/client`) and feed them from `/data` (payloads, schemas).

4. **Agility**  
   Many E2E tests are still pending. Adding a new step = add one action (e.g. `createProject(req, dealId)`) and call it from the right phase spec. No fixture or base-class change.

5. **Serial E2E + golden records**  
   Phase N writes state to a golden file or shared context; phase N+1 reads it. Specs call actions in sequence and pass IDs (companyId, dealId, orderDealId, invoiceId). No need for a heavy fixture that injects many service objects.

6. **Traceability**  
   Action names and files can be aligned with `docs/hubspot` and `docs/n8n` (e.g. `invoice.actions.ts` for WF 2029/2030b/2031, `deal.actions.ts` for clone/WF 2040).

### 5.2 Suggested Layout (Aligned With Existing Repo)

Keep your current `tests/deal-invoice-qa/` and `tests/line-item-calc-qa/` layout; add a shared layer that both can use:

```
automation/
├── client/
│   ├── baseRequest.ts       # Playwright request + auth + env base URL (replace/supplement global fetch in hubspot.ts)
│   └── env.ts
├── actions/                  # Reusable, domain-focused functions
│   ├── company.actions.ts    # createCompany, getCompany (can wrap current hubspot.ts helpers)
│   ├── contact.actions.ts
│   ├── deal.actions.ts       # createDeal, cloneDealToOrderPipeline, getDealStage
│   ├── line-item.actions.ts
│   ├── invoice.actions.ts    # getInvoice, setInvoiceStage, validateInvoice (schema)
│   └── n8n.actions.ts        # optional: triggerCreateProject, etc., if you call n8n from tests
├── data/
│   ├── payloads/
│   ├── schemas/
│   └── loaders/              # payloadLoader, schemaValidator (ajv)
├── tests/
│   ├── deal-invoice-qa/      # existing
│   │   ├── e2e/              # 01–10 call actions + helpers (polling, cleanup)
│   │   └── helpers/          # keep polling, cleanup, crm-schema, golden records
│   └── line-item-calc-qa/    # existing; can import actions or keep current hubspot-client
```

- **deal-invoice-qa** E2E specs: use `createBaseRequest(request)` and call actions from `actions/`; keep `helpers/polling.ts`, `cleanup.ts`, and phase golden records as they are.
- **line-item-calc-qa**: can keep using its current `hubspot-client` or gradually switch to `baseRequest` + `line-item.actions.ts` and shared `data/` for consistency.

### 5.3 Migration Path (Minimal Disruption)

1. Add `client/baseRequest.ts` and `client/env.ts` (Playwright request context, token, base URL).
2. Add `data/loaders/payloadLoader.ts` and `data/loaders/schemaValidator.ts` (and optional payloads/schemas).
3. Introduce `actions/` and move or wrap existing `hubspot.ts` logic into action functions that take `BaseRequest` and params (e.g. `createCompany(req, properties)`). Optionally keep `hubspot.ts` as a thin wrapper that uses `baseRequest` under the hood so existing specs keep working.
4. New E2E phases (and any new specs) use actions + baseRequest; phase N writes golden record, phase N+1 reads it and continues.
5. When comfortable, refactor existing E2E specs to use actions directly and retire duplicate logic from `hubspot.ts`.

---

## 6. Final Recommendation Summary

| Question | Answer |
|----------|--------|
| **Which pattern for this project?** | **API Action Pattern** (functional, modular actions + single client + data/loaders). |
| **Use API Client only?** | Only for small, one-off API checks. Not as the main framework for the full E2E suite. |
| **Use SOM?** | Consider later if HubSpot grows to 100+ endpoints and you want a single, class-based surface. For now, actions give enough structure with less overhead. |
| **What to build next?** | Implement `client/baseRequest.ts` and `client/env.ts`, then add `actions/` (company, contact, deal, invoice, …) and `data/loaders`; migrate or wrap `hubspot.ts` so E2E specs can use actions and Playwright request context. |

This keeps the project aligned with the E2E plan, preserves agility, fits your existing procedural style, and leaves room to introduce a SOM layer for HubSpot later if the API surface grows.
