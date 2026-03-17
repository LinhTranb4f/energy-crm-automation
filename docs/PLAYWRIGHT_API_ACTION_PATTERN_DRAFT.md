# Playwright API Framework — API Action Pattern (Functional/Modular)

**Role:** Senior SDET / Automation Architect (Microservices Testing)  
**Purpose:** Third draft for complex microservices workflows (e.g. Offer-to-Cash). Functional, modular actions instead of classes.  
**Related:** [SOM Blueprint](./PLAYWRIGHT_API_FRAMEWORK_BLUEPRINT.md) | [API Client Pattern](./PLAYWRIGHT_API_CLIENT_PATTERN_DRAFT.md)

---

## 1. Project Structure (Action-Centered)

Directory tree centered on `/actions`, `/specs`, `/client`, and `/data`.

```
automation/
├── playwright.config.ts
├── .env
├── package.json
│
├── client/                                 # Global request & config
│   ├── baseRequest.ts                     # Auth, headers, env base URLs (Playwright request)
│   ├── env.ts                             # Typed env (tokens, base URLs per service)
│   └── types.ts                           # RequestContext type, ApiResponse, etc.
│
├── actions/                                # Reusable, independent API action functions
│   ├── index.ts                           # Re-export all actions for convenience
│   ├── auth.actions.ts                    # getToken(), ensureAuthenticated()
│   ├── order.actions.ts                  # createOrder(), getOrder(), updateOrderStatus()
│   ├── invoice.actions.ts                 # createInvoice(), validateInvoice(), getInvoiceStatus()
│   ├── company.actions.ts                # createCompany(), getCompany()
│   └── deal.actions.ts                   # createDeal(), cloneDealToOrderPipeline()
│
├── data/
│   ├── payloads/
│   │   ├── order.create.json
│   │   ├── invoice.create.json
│   │   ├── company.create.json
│   │   └── deal.create.json
│   ├── schemas/
│   │   ├── order.response.schema.json
│   │   ├── invoice.response.schema.json
│   │   └── company.response.schema.json
│   ├── loaders/
│   │   ├── payloadLoader.ts              # loadPayload(relativePath, overrides)
│   │   └── schemaValidator.ts            # validateWithSchema(schemaFile, data)
│   └── builders/
│       └── testData.ts                    # buildOrderPayload(overrides), etc.
│
├── specs/                                  # Test specifications
│   ├── api/                               # Single-domain / single-action specs
│   │   ├── order.api.spec.ts
│   │   ├── invoice.api.spec.ts
│   │   └── company.api.spec.ts
│   └── e2e/                               # End-to-end workflow specs
│       ├── offer-to-cash.spec.ts          # Auth → Create Order → Verify → Invoice
│       ├── order-pipeline.spec.ts
│       └── deal-invoice-qa/
│           ├── 01-company-contact.spec.ts
│           └── ...
│
├── test-results/
└── playwright-report/
```

**Design rationale:**

- **`/client`** — Single place for “how we talk to APIs” (base URL, auth, headers). No business logic.
- **`/actions`** — Pure functions that take request context (or a thin request helper) and parameters; return typed results. Composable and testable in isolation.
- **`/specs`** — API specs call one or a few actions; E2E specs chain many actions to simulate a business process.
- **`/data`** — Payloads and schemas stay out of actions and specs for reusability and env-specific overrides.

---

## 2. Global Request Utility (`client/baseRequest.ts`)

Single module that wraps Playwright’s request context with environment-specific base URLs, auth token injection, and global headers. Actions call this instead of raw `request`.

```typescript
// client/baseRequest.ts

import { APIRequestContext, APIResponse } from "@playwright/test";
import { getEnv } from "./env";

export type RequestOptions = {
  baseURL?: string;      // Override per call if needed (e.g. n8n vs HubSpot)
  token?: string;        // Override token (e.g. for negative tests)
  headers?: Record<string, string>;
  timeoutMs?: number;
};

export class RequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: string,
    public readonly requestInfo?: { method: string; url: string; body?: unknown }
  ) {
    super(message);
    this.name = "RequestError";
  }
}

/**
 * Creates a request utility bound to Playwright's request context.
 * Uses env for default base URL and token; options override per call.
 */
export function createBaseRequest(request: APIRequestContext, options?: RequestOptions) {
  const env = getEnv();
  const defaultBaseURL = options?.baseURL ?? env.HUBSPOT_BASE_URL;
  const baseURL = defaultBaseURL.replace(/\/$/, "");
  const token = options?.token ?? env.HUBSPOT_ACCESS_TOKEN;
  const timeoutMs = options?.timeoutMs ?? 30_000;
  const extraHeaders = options?.headers ?? {};

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };

  async function handleResponse<T>(
    response: APIResponse,
    method: string,
    url: string,
    body?: unknown
  ): Promise<T> {
    const status = response.status();
    const text = await response.text();

    if (status >= 400) {
      console.error("[baseRequest FAILURE]", { method, url, status, body: body != null ? JSON.stringify(body).slice(0, 300) : undefined, responseBody: text.slice(0, 500) });
      throw new RequestError(
        `${method} ${url} → ${status}: ${text.slice(0, 200)}`,
        status,
        text,
        { method, url, body }
      );
    }

    if (text.length === 0) return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new RequestError(`Invalid JSON: ${method} ${url}`, status, text, { method, url, body });
    }
  }

  return {
    async get<T = unknown>(path: string, params?: Record<string, string | number>): Promise<T> {
      const url = path.startsWith("http") ? path : params
        ? `${baseURL}${path}?${new URLSearchParams(params as Record<string, string>)}`
        : `${baseURL}${path}`;
      const response = await request.get(url, { headers, timeout: timeoutMs });
      return handleResponse<T>(response, "GET", url);
    },

    async post<T = unknown>(path: string, body: unknown): Promise<T> {
      const url = path.startsWith("http") ? path : `${baseURL}${path}`;
      const response = await request.post(url, { headers, data: body, timeout: timeoutMs });
      return handleResponse<T>(response, "POST", url, body);
    },

    async patch<T = unknown>(path: string, body: unknown): Promise<T> {
      const url = path.startsWith("http") ? path : `${baseURL}${path}`;
      const response = await request.patch(url, { headers, data: body, timeout: timeoutMs });
      return handleResponse<T>(response, "PATCH", url, body);
    },

    async delete(path: string): Promise<void> {
      const url = path.startsWith("http") ? path : `${baseURL}${path}`;
      const response = await request.delete(url, { headers, timeout: timeoutMs });
      if (response.status() !== 204) {
        const text = await response.text();
        console.error("[baseRequest FAILURE]", { method: "DELETE", url, status: response.status(), responseBody: text.slice(0, 500) });
        throw new RequestError(`DELETE ${url} → ${response.status()}`, response.status(), text, { method: "DELETE", url });
      }
    },
  };
}

export type BaseRequest = ReturnType<typeof createBaseRequest>;
```

**Env module:**

```typescript
// client/env.ts

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function required(key: string): string {
  const v = process.env[key];
  if (v == null || v === "") throw new Error(`Missing env: ${key}`);
  return v;
}

function optional(key: string, fallback: string): string {
  return process.env[key] ?? fallback;
}

export function getEnv() {
  return {
    HUBSPOT_ACCESS_TOKEN: required("HUBSPOT_ACCESS_TOKEN"),
    HUBSPOT_BASE_URL: optional("HUBSPOT_BASE_URL", "https://api.hubapi.com"),
    N8N_BASE_URL: optional("N8N_BASE_URL", "https://n8n.tools.energy"),
    ORDER_PIPELINE_ID: optional("ORDER_PIPELINE_ID", "3387257046"),
  };
}
```

---

## 3. Functional Actions (Reusable, Independent Functions)

Actions are stateless functions that receive the request utility (and optionally payload/schema helpers) and return typed results. No classes.

### 3.1 Auth Actions

```typescript
// actions/auth.actions.ts

import type { BaseRequest } from "../client/baseRequest";

export interface AuthResult {
  token: string;
  expiresAt?: number;
}

/**
 * Obtains a token for API calls (e.g. from auth service or env).
 * For HubSpot, token is typically from env; this can validate or refresh.
 */
export async function getToken(req: BaseRequest): Promise<AuthResult> {
  const { getEnv } = await import("../client/env");
  const env = getEnv();
  return { token: env.HUBSPOT_ACCESS_TOKEN };
}

/**
 * Ensures the request context is authenticated (e.g. call a /me or /ping endpoint).
 */
export async function ensureAuthenticated(req: BaseRequest): Promise<boolean> {
  const res = await req.get<{ user?: unknown }>("/crm/v3/objects/companies?limit=1");
  return res != null;
}
```

### 3.2 Order Actions (Example for Offer-to-Cash)

```typescript
// actions/order.actions.ts

import type { BaseRequest } from "../client/baseRequest";
import { loadPayload } from "../data/loaders/payloadLoader";
import { validateWithSchema } from "../data/loaders/schemaValidator";

export interface CreateOrderInput {
  dealId: string;
  pipelineId?: string;
  overrides?: Record<string, unknown>;
}

export interface OrderResult {
  id: string;
  properties: Record<string, unknown>;
}

export async function createOrder(req: BaseRequest, input: CreateOrderInput): Promise<OrderResult> {
  const body = loadPayload("order.create.json", {
    ...input.overrides,
    dealId: input.dealId,
    pipeline: input.pipelineId,
  });
  const res = await req.post<{ id: string; properties: Record<string, unknown> }>(
    "/crm/v3/objects/deals",
    { properties: body }
  );
  if (!res?.id) throw new Error("createOrder: missing id in response");
  return { id: res.id, properties: res.properties ?? {} };
}

export async function getOrder(req: BaseRequest, orderId: string, properties?: string[]): Promise<OrderResult | null> {
  const props = properties?.length ? properties.join(",") : "dealname,dealstage,pipeline";
  const res = await req.get<{ id: string; properties: Record<string, unknown> }>(
    `/crm/v3/objects/deals/${orderId}?properties=${props}`
  );
  return res ? { id: res.id, properties: res.properties ?? {} } : null;
}

export async function getOrderStatus(req: BaseRequest, orderId: string): Promise<string> {
  const order = await getOrder(req, orderId, ["dealstage"]);
  return (order?.properties?.dealstage as string) ?? "";
}

/** Validate order response against JSON Schema (use in action or in spec). */
export function validateOrderSchema(data: unknown): { valid: boolean; errors: string[] } {
  return validateWithSchema("order.response.schema.json", data);
}
```

### 3.3 Invoice Actions (with Schema Validation Inside Action)

```typescript
// actions/invoice.actions.ts

import type { BaseRequest } from "../client/baseRequest";
import { loadPayload } from "../data/loaders/payloadLoader";
import { validateWithSchema } from "../data/loaders/schemaValidator";

export interface ValidateInvoiceInput {
  invoiceId: string;
  expectedStage?: string;
}

export interface ValidateInvoiceResult {
  valid: boolean;
  errors: string[];
  data?: unknown;
}

export async function getInvoice(req: BaseRequest, invoiceId: string): Promise<Record<string, unknown> | null> {
  const res = await req.get<{ id: string; properties: Record<string, unknown> }>(
    `/crm/v3/objects/0-162/${invoiceId}?properties=invoice_stage,amount,gross_total`
  );
  return res?.properties ?? null;
}

/**
 * Fetches invoice and validates response against JSON Schema.
 * Returns validation result so the spec can assert or chain further.
 */
export async function validateInvoice(
  req: BaseRequest,
  input: ValidateInvoiceInput
): Promise<ValidateInvoiceResult> {
  const data = await getInvoice(req, input.invoiceId);
  if (!data) return { valid: false, errors: ["Invoice not found"] };

  const schemaResult = validateWithSchema("invoice.response.schema.json", { id: input.invoiceId, properties: data });
  const stageOk = !input.expectedStage || (data.invoice_stage === input.expectedStage);
  const errors = stageOk ? schemaResult.errors : [...schemaResult.errors, `Expected stage ${input.expectedStage}, got ${data.invoice_stage}`];

  return {
    valid: schemaResult.valid && stageOk,
    errors,
    data,
  };
}
```

### 3.4 Action Index (Re-export)

```typescript
// actions/index.ts

export * from "./auth.actions";
export * from "./order.actions";
export * from "./invoice.actions";
export * from "./company.actions";
export * from "./deal.actions";
```

---

## 4. End-to-End Workflow: Chaining Actions in One Spec

Single test script that simulates a business process: Auth → Create Order → Verify Status → (optional) Validate Invoice.

```typescript
// specs/e2e/offer-to-cash.spec.ts

import { test, expect } from "@playwright/test";
import { createBaseRequest } from "../../client/baseRequest";
import {
  ensureAuthenticated,
  createOrder,
  getOrderStatus,
  validateInvoice,
} from "../../actions";

test.describe("E2E: Offer-to-Cash workflow", () => {
  test("Auth → Create Order → Verify Status → Validate Invoice", async ({ request }) => {
    const req = createBaseRequest(request);

    // 1. Auth
    await ensureAuthenticated(req);

    // 2. Create Order (deal in Order Pipeline)
    const order = await createOrder(req, {
      dealId: "existing-deal-id-from-fixture",
      pipelineId: process.env.ORDER_PIPELINE_ID,
      overrides: { dealname: `E2E-Order-${Date.now()}` },
    });
    expect(order.id).toBeDefined();

    // 3. Verify status (e.g. poll until stage is set by workflow)
    const status = await getOrderStatus(req, order.id);
    expect(status).toBeDefined();

    // 4. When invoice exists: validate schema and optional stage
    const invoiceId = "invoice-id-from-previous-step-or-fixture";
    const validation = await validateInvoice(req, {
      invoiceId,
      expectedStage: "qa",
    });
    expect(validation.valid, validation.errors.join("; ")).toBe(true);
  });
});
```

---

## 5. Schema Validation (AJV) in the Action / Test Layer

**Option A — Inside action:** Shown in `validateInvoice()`: the action calls `validateWithSchema()` and returns `{ valid, errors }`; the spec asserts on that.

**Option B — In spec only:** Actions return raw data; spec calls validator:

```typescript
import { validateWithSchema } from "../../data/loaders/schemaValidator";

const order = await createOrder(req, input);
const schemaResult = validateWithSchema("order.response.schema.json", order);
expect(schemaResult.valid, schemaResult.errors.join("; ")).toBe(true);
```

**Shared validator (used by actions and specs):**

```typescript
// data/loaders/schemaValidator.ts

import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const cache = new Map<string, ReturnType<typeof ajv.compile>>();

export function validateWithSchema(
  schemaFileName: string,
  data: unknown
): { valid: boolean; errors: string[] } {
  const schemaPath = path.join(process.cwd(), "data", "schemas", schemaFileName);
  if (!cache.has(schemaPath)) {
    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
    cache.set(schemaPath, ajv.compile(schema));
  }
  const validate = cache.get(schemaPath)!;
  const valid = validate(data);
  const errors = (validate.errors ?? []).map((e) => `${e.instancePath} ${e.message}`);
  return { valid: !!valid, errors };
}
```

---

## 6. Comparison: API Action Pattern vs Service Object Model (SOM)

| Criterion | API Action Pattern | Service Object Model (SOM) |
|-----------|--------------------|----------------------------|
| **Structure** | Flat functions in `/actions`; specs in `/specs`; single `/client`. | Class hierarchy: base client → service classes → fixture; tests use injected services. |
| **Composability** | High: chain any actions in any order in a spec. | High: services expose methods; orchestration in spec or in a “workflow” service. |
| **Reusability** | Per-action: import only the functions you need. | Per-service: inject one service and use many methods. |
| **Initial setup** | Moderate: client + env + one file per domain of actions. | Heavier: base class + N service classes + fixture wiring. |
| **Maintenance** | Change one action function when an endpoint/contract changes. | Change one service method; all specs using it get the fix. |
| **Scalability (many endpoints)** | Scales by adding action files/functions; can group by domain (order, invoice, auth). | Scales by adding service classes or methods; clear ownership per backend. |
| **Testability** | Actions are pure functions: easy to unit test with a mock `BaseRequest`. | Services are classes: mock the class or the request inside the service. |
| **Readability (new devs)** | “Import action, call it with req and params” — minimal OOP. | “Use fixture, call service.method()” — requires understanding of fixture and classes. |
| **Agility / speed of change** | Add or change a single function; no inheritance or fixture changes. | Add method to existing service or new service; may need fixture update. |
| **Best for** | Microservices, cross-service workflows, teams preferring functional style. | Large single-backend surfaces, strong domain boundaries, teams comfortable with OOP. |

---

## 7. Final Recommendation (Microservices + Agility)

**For a complex microservices workflow (e.g. Offer-to-Cash) and a need for agility/speed:**

- **Prefer the API Action Pattern** when:
  - You have **multiple backends** (HubSpot, n8n, auth, SAP) and tests **chain calls across them**. Actions map naturally to “steps” in a flow (createOrder, validateInvoice) and can live in one place per domain.
  - You want **fast iteration**: add or change one action without touching a class hierarchy or fixtures.
  - The team prefers **functional, modular** style and likes to **compose** tests from small, independent functions.

- **Consider SOM** when:
  - One backend (e.g. HubSpot) dominates and has **many endpoints** (100+); you want a single, consistent “surface” (e.g. `hubspot.deals.create`, `hubspot.invoices.get`) and are willing to invest in base class + services.
  - You need **strong traceability** from test code to backend “services” for compliance or documentation.

**Practical suggestion:** Start with the **API Action Pattern** for the Offer-to-Cash and order-pipeline E2E. Keep actions small and domain-focused (`order.actions.ts`, `invoice.actions.ts`, `auth.actions.ts`). If a single backend grows very large (e.g. 100+ HubSpot endpoints), introduce a **thin SOM layer** only for that backend (e.g. `HubSpotDealsService`) and have actions delegate to it, so the rest of the framework stays action-based and agile.

---

## 8. CI/CD Strategy (Headless, Lightweight)

Run functional API/E2E tests in CI with no browser; use a single job or separate jobs for API vs E2E.

### 8.1 GitHub Actions

```yaml
# .github/workflows/api-e2e.yml

name: API & E2E (Action Pattern)

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: "20"

jobs:
  api-e2e:
    name: API & E2E Tests
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: automation

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"
          cache-dependency-path: automation/package-lock.json

      - name: Install dependencies
        run: npm ci

      # No browser install — API-only
      - name: Run API specs
        run: npx playwright test specs/api/
        env:
          HUBSPOT_ACCESS_TOKEN: ${{ secrets.HUBSPOT_ACCESS_TOKEN }}
          HUBSPOT_BASE_URL: ${{ vars.HUBSPOT_BASE_URL || 'https://api.hubapi.com' }}

      - name: Run E2E workflow specs
        run: npx playwright test specs/e2e/ --workers=1
        env:
          HUBSPOT_ACCESS_TOKEN: ${{ secrets.HUBSPOT_ACCESS_TOKEN }}
          ORDER_PIPELINE_ID: ${{ vars.ORDER_PIPELINE_ID || '3387257046' }}

      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: automation/playwright-report
          retention-days: 14
```

### 8.2 GitLab CI

```yaml
# .gitlab-ci.yml (excerpt)

.api-tests:
  image: node:20-bookworm
  cache:
    key: npm-${{ CI_COMMIT_REF_SLUG }}
    paths:
      - automation/node_modules
  before_script:
    - cd automation && npm ci

api-specs:
  extends: .api-tests
  stage: test
  script:
    - npx playwright test specs/api/
  variables:
    HUBSPOT_ACCESS_TOKEN: $HUBSPOT_ACCESS_TOKEN

e2e-workflows:
  extends: .api-tests
  stage: test
  script:
    - npx playwright test specs/e2e/ --workers=1
  variables:
    HUBSPOT_ACCESS_TOKEN: $HUBSPOT_ACCESS_TOKEN
  artifacts:
    when: always
    paths:
      - automation/playwright-report
```

**Summary:** One Node image, no Playwright browsers; secrets for tokens; optional parallel API specs and serial E2E (`--workers=1`); store reports as artifacts.

---

## 9. Summary

| Deliverable | Location / content |
|-------------|--------------------|
| **File structure** | `/client`, `/actions`, `/specs`, `/data` with payloads, schemas, loaders. |
| **Global request** | `client/baseRequest.ts` — auth, headers, env base URL, error logging. |
| **Action examples** | `auth.actions.ts`, `order.actions.ts`, `invoice.actions.ts` — pure functions taking `BaseRequest` + params. |
| **E2E workflow** | `specs/e2e/offer-to-cash.spec.ts` — chain Auth → Create Order → Verify Status → Validate Invoice. |
| **Schema validation** | `validateWithSchema()` in `data/loaders/schemaValidator.ts`; used inside `validateInvoice()` or in specs. |
| **Pros/Cons** | Table in §6 (Action vs SOM). |
| **Recommendation** | Prefer **API Action Pattern** for microservices + agility; consider SOM for a single, very large backend. |
| **CI/CD** | GitHub Actions & GitLab CI snippets: headless, no browser, secrets for tokens, artifact reports. |
