# Playwright API Automation Framework — Technical Blueprint

**Role:** Senior SDET / Automation Architect (Backend Testing)  
**Scope:** NRJ Energy order pipeline — HubSpot CRM ↔ n8n ↔ Delfin/SAP/PandaDoc  
**References:** `docs/hubspot`, `docs/n8n`, [E2E Order Pipeline Testing Plan](.cursor/plans/e2e_order_pipeline_testing_ebd78c99.plan.md)

This document is a **design-only proposal**. No code changes are implied until you approve the architecture.

**Alternative designs:** [API Client Pattern](./PLAYWRIGHT_API_CLIENT_PATTERN_DRAFT.md) (single client, no classes); [API Action Pattern](./PLAYWRIGHT_API_ACTION_PATTERN_DRAFT.md) (functional/modular actions, ideal for microservices). Comparison tables in each.

---

## 1. Service Object Model (SOM) — Framework Structure

### 1.1 Why SOM Instead of Page Object Model (POM)

- **API tests have no UI.** Organizing by "pages" is meaningless; organizing by **services and endpoints** maps directly to how backend systems are consumed (HubSpot CRM API, n8n webhooks, internal REST APIs).
- **Reusability:** One service class (e.g. `HubSpotCompaniesService`) is reused across many specs (company-contact, deal setup, cleanup). Changes to the API contract are localized.
- **Traceability:** Services align with domains in your docs (`docs/hubspot`, `docs/n8n`) and with the E2E plan phases (CRM → Sales → Order Pipeline → Service Lifecycle → Invoicing → SAP).

### 1.2 Directory Tree (SOM-Based)

```
automation/
├── playwright.config.ts
├── .env / .env.example
├── package.json
│
├── src/                                    # Framework core (no tests here)
│   ├── core/
│   │   ├── base-api.client.ts              # Base class: APIRequestContext, auth, interceptors
│   │   ├── api-fixture.ts                  # Playwright fixture that injects BaseApiClient
│   │   └── types.ts                        # Shared types (Env, RequestOptions, etc.)
│   │
│   ├── services/                           # Service Object Model — one per backend “surface”
│   │   ├── hubspot/
│   │   │   ├── hubspot.api.service.ts      # Low-level: request context wrapper for api.hubapi.com
│   │   │   ├── companies.service.ts        # Companies CRUD + search
│   │   │   ├── contacts.service.ts
│   │   │   ├── deals.service.ts            # Deals, clone, stage, associations
│   │   │   ├── line-items.service.ts
│   │   │   ├── quotes.service.ts
│   │   │   ├── custom-objects.service.ts  # Invoice, Service, Project, Spot (v4/v3)
│   │   │   └── associations.service.ts    # Association types + link/unlink
│   │   │
│   │   ├── n8n/
│   │   │   ├── n8n.api.service.ts          # Base for n8n base URL + optional auth
│   │   │   └── webhooks.service.ts         # Trigger webhooks (e.g. create-project, create-invoice-document-queue)
│   │   │
│   │   └── internal/                       # Optional: SAP/Delfin/PandaDoc if you add direct API tests
│   │       └── ...
│   │
│   ├── data/                               # Data-driven assets (decoupled from tests)
│   │   ├── env/
│   │   │   ├── default.env.ts              # Typed env schema + defaults
│   │   │   └── schema.env.json             # Optional: JSON Schema for env validation
│   │   ├── payloads/
│   │   │   ├── hubspot/
│   │   │   │   ├── company.create.json
│   │   │   │   ├── contact.create.json
│   │   │   │   ├── deal.create.json
│   │   │   │   └── ...
│   │   │   └── n8n/
│   │   │       └── webhook.create-project.json
│   │   ├── schemas/                        # JSON Schema for response validation
│   │   │   ├── hubspot/
│   │   │   │   ├── company.response.schema.json
│   │   │   │   ├── deal.response.schema.json
│   │   │   │   └── ...
│   │   │   └── n8n/
│   │   │       └── execution.response.schema.json
│   │   └── builders/                       # Programmatic builders (dynamic data)
│   │       └── test-data.builders.ts       # generatePhase1TestData(UNIQUE), etc.
│   │
│   ├── validation/
│   │   ├── status-codes.ts                 # Expected status per operation
│   │   ├── json-schema.validator.ts        # Validate response against JSON Schema
│   │   └── domain/                         # Domain-specific assertions
│   │       ├── hubspot.validators.ts
│   │       └── invoice.validators.ts
│   │
│   └── reporting/                         # Optional: custom reporters / Allure hooks
│       └── allure.env.ts
│
├── tests/
│   ├── api/                                # Pure API tests (by service/feature)
│   │   ├── hubspot/
│   │   │   ├── companies.api.spec.ts
│   │   │   ├── deals.api.spec.ts
│   │   │   └── line-items.api.spec.ts
│   │   └── n8n/
│   │       └── webhooks.api.spec.ts
│   │
│   ├── e2e/                                # Phase-based E2E (order pipeline)
│   │   ├── deal-invoice-qa/                # Existing suite — migrate to use SOM + fixtures
│   │   │   ├── e2e/
│   │   │   │   ├── 01-company-contact.spec.ts
│   │   │   │   ├── 02-deal-line-items.spec.ts
│   │   │   │   └── ...
│   │   │   ├── fixtures/
│   │   │   │   └── phase-*.json
│   │   │   └── helpers/
│   │   │       ├── polling.ts
│   │   │       └── cleanup.ts
│   │   └── ...
│   │
│   └── line-item-calc-qa/                 # Existing — can consume shared services
│       └── ...
│
├── test-results/
├── playwright-report/
└── allure-results/                        # When Allure reporter is enabled
```

**Why this tree:**

- **`src/core`** — Single place for base HTTP behavior; all services depend on it.
- **`src/services`** — One folder per “backend” (HubSpot, n8n). Each service uses `BaseApiClient` and exposes domain methods (e.g. `createCompany(properties)`), not raw HTTP.
- **`src/data`** — Payloads and schemas live outside tests so the same JSON can be used by multiple specs and by non-Playwright tools (Postman, curl scripts).
- **`tests/api`** — Short, status + schema checks per service. **`tests/e2e`** — Long-running flow tests that orchestrate multiple services and align with the E2E plan.

---

## 2. Base API Architecture

### 2.1 Why Use Playwright’s `APIRequestContext`

- **Same runtime as E2E:** One tool (Playwright) for both API and (if needed later) UI tests; shared config, env, and reporting.
- **Built-in context:** Request context manages cookies, headers, and storage per test; supports `storageState` if you add auth that sets cookies.
- **Stability:** Playwright’s `request` fixture is well-maintained and supports interceptors via `route` for logging or mocking.

### 2.2 Why a Base Class (Not Only a Fixture)

- **Central place** for default headers, auth (Bearer/OAuth), base URL, and retries.
- **Interceptors** can log every request/response (URL, method, status, body size) for debugging and Allure attachments.
- **Consistent error handling:** Transform non-2xx into a typed error (e.g. `ApiError`) with status, body, and request id so tests and validators behave uniformly.

### 2.3 Base Class Design (Code Snippet)

```typescript
// src/core/base-api.client.ts

import { APIRequestContext, APIResponse } from "@playwright/test";

export type AuthStrategy = "bearer" | "none";

export interface BaseApiClientOptions {
  baseURL: string;
  authStrategy: AuthStrategy;
  token?: string;                    // For Bearer; or from env inside constructor
  defaultHeaders?: Record<string, string>;
  timeout?: number;
  logRequests?: boolean;              // Enable request/response logging for debugging
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: string,
    public readonly requestId?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export abstract class BaseApiClient {
  constructor(
    protected readonly request: APIRequestContext,
    protected readonly options: BaseApiClientOptions
  ) {}

  protected get baseURL(): string {
    return this.options.baseURL.replace(/\/$/, "");
  }

  protected get headers(): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...this.options.defaultHeaders,
    };
    if (this.options.authStrategy === "bearer" && this.options.token) {
      headers["Authorization"] = `Bearer ${this.options.token}`;
    }
    return headers;
  }

  /** GET with optional query params; throws ApiError on non-2xx. */
  protected async get<T = unknown>(
    path: string,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    const url = params
      ? `${this.baseURL}${path}?${new URLSearchParams(String(params) as any)}`
      : `${this.baseURL}${path}`;
    const response = await this.request.get(url, {
      headers: this.headers,
      timeout: this.options.timeout ?? 30_000,
    });
    return this.handleResponse<T>(response, "GET", url);
  }

  /** POST with JSON body. */
  protected async post<T = unknown>(path: string, body: unknown): Promise<T> {
    const url = `${this.baseURL}${path}`;
    if (this.options.logRequests) {
      console.info(`[API] POST ${url}`, typeof body === "object" ? JSON.stringify(body).slice(0, 200) : body);
    }
    const response = await this.request.post(url, {
      headers: this.headers,
      data: body,
      timeout: this.options.timeout ?? 30_000,
    });
    return this.handleResponse<T>(response, "POST", url);
  }

  /** PATCH with JSON body. */
  protected async patch<T = unknown>(path: string, body: unknown): Promise<T> {
    const url = `${this.baseURL}${path}`;
    const response = await this.request.patch(url, {
      headers: this.headers,
      data: body,
      timeout: this.options.timeout ?? 30_000,
    });
    return this.handleResponse<T>(response, "PATCH", url);
  }

  /** DELETE; returns void or parsed body. */
  protected async delete<T = unknown>(path: string): Promise<T | void> {
    const url = `${this.baseURL}${path}`;
    const response = await this.request.delete(url, {
      headers: this.headers,
      timeout: this.options.timeout ?? 30_000,
    });
    if (response.status() === 204) return;
    return this.handleResponse<T>(response, "DELETE", url);
  }

  private async handleResponse<T>(
    response: APIResponse,
    method: string,
    url: string
  ): Promise<T> {
    const status = response.status();
    const requestId = response.headers()["x-request-id"];

    if (this.options.logRequests) {
      console.info(`[API] ${method} ${url} → ${status}`);
    }

    const text = await response.text();
    if (status >= 400) {
      throw new ApiError(
        `${method} ${url} → ${status}: ${text.slice(0, 500)}`,
        status,
        text,
        requestId
      );
    }

    if (text.length === 0) return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new ApiError(
        `Invalid JSON response: ${method} ${url}`,
        status,
        text,
        requestId
      );
    }
  }
}
```

### 2.4 Playwright Fixture That Injects the Base Client

Services get `request` from Playwright and pass it into a HubSpot-specific client that extends `BaseApiClient`. The fixture provides a single place to read env and build options:

```typescript
// src/core/api-fixture.ts

import { test as base } from "@playwright/test";
import { APIRequestContext } from "@playwright/test";
import { BaseApiClientOptions } from "./base-api.client";
import { HubSpotApiService } from "../services/hubspot/hubspot.api.service";

type ApiFixtures = {
  hubspot: HubSpotApiService;   // Or a facade that exposes companies, deals, etc.
  // n8n: N8nWebhooksService;
};

export const test = base.extend<{ request: APIRequestContext } & ApiFixtures>({
  baseURL: process.env.HUBSPOT_BASE_URL ?? "https://api.hubapi.com",

  request: async ({ request }, use) => {
    await use(request);
  },

  hubspot: async ({ request, baseURL }, use) => {
    const token = process.env.HUBSPOT_ACCESS_TOKEN;
    if (!token) throw new Error("HUBSPOT_ACCESS_TOKEN is not set");
    const client = new HubSpotApiService(request, {
      baseURL,
      authStrategy: "bearer",
      token,
      logRequests: process.env.API_LOG_REQUESTS === "1",
    });
    await use(client);
  },
});

export { expect } from "@playwright/test";
```

**Why:** Tests use `test("...", async ({ hubspot }) => { ... })` and never touch raw `request` or tokens. New backends (n8n, internal APIs) get a new fixture entry and their own service class.

---

## 3. Data-Driven Design

### 3.1 Why Decouple Data from Scripts

- **Reuse:** Same payloads can drive API tests, Postman collections, and contract tests.
- **Environment-specific data:** Different `.env` and payload variants (e.g. `company.create.uat.json`) without changing test code.
- **Maintainability:** When HubSpot adds a required property, you update one JSON file or one builder, not dozens of specs.

### 3.2 Strategy

| Asset type        | Location                    | Use case |
|-------------------|-----------------------------|----------|
| Env / config      | `.env` + `src/data/env/default.env.ts` | Base URLs, tokens, pipeline IDs, feature flags |
| Static payloads   | `src/data/payloads/**/*.json`           | Create company/contact/deal with fixed shape; override keys in test |
| Dynamic builders  | `src/data/builders/test-data.builders.ts` | `generatePhase1TestData(UNIQUE)` — unique names, dates, IDs |
| Response schemas  | `src/data/schemas/**/*.schema.json`     | JSON Schema validation of API responses |

### 3.3 Typed Env (Example)

```typescript
// src/data/env/default.env.ts

import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function required(key: string): string {
  const v = process.env[key];
  if (v == null || v === "") throw new Error(`Missing env: ${key}`);
  return v;
}

function optional(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

export const env = {
  HUBSPOT_ACCESS_TOKEN: required("HUBSPOT_ACCESS_TOKEN"),
  HUBSPOT_BASE_URL: optional("HUBSPOT_BASE_URL", "https://api.hubapi.com"),
  ORDER_PIPELINE_ID: optional("ORDER_PIPELINE_ID", "3387257046"),
  SALES_PIPELINE_ID: optional("SALES_PIPELINE_ID", ""),
  N8N_BASE_URL: optional("N8N_BASE_URL", "https://n8n.tools.energy"),
  SKIP_CLEANUP: process.env.SKIP_CLEANUP === "1",
  API_LOG_REQUESTS: process.env.API_LOG_REQUESTS === "1",
} as const;
```

### 3.4 Loading Payloads and Overriding in Tests

```typescript
// src/data/payloads/loader.ts (conceptual)

import * as fs from "fs";
import * as path from "path";

const PAYLOADS_DIR = path.join(__dirname, "payloads");

export function loadPayload<T = Record<string, unknown>>(
  relativePath: string,
  overrides?: Partial<T>
): T {
  const fullPath = path.join(PAYLOADS_DIR, relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const parsed = JSON.parse(raw) as T;
  return overrides ? { ...parsed, ...overrides } : parsed;
}

// In a test:
// const body = loadPayload<HubSpotCompanyCreate>("hubspot/company.create.json", { name: `E2E-${UNIQUE}` });
```

---

## 4. Validation Layer

### 4.1 Why Status Code + JSON Schema

- **Status codes** are the first line of defense: wrong status immediately fails the test with a clear expectation (e.g. 201 Created, 200 OK).
- **JSON Schema** catches contract drift: new required fields, wrong types, or removed fields. Prevents tests from passing with accidentally wrong response shapes.

### 4.2 Best Practices

- **Centralize expected status** per operation (e.g. `createCompany` → 201, `getCompany` → 200, `deleteCompany` → 204). Use a small module or constant map so changing the API contract updates one place.
- **Validate only what the test cares about:** Use partial schemas or `additionalProperties: true` where you only assert a few fields (e.g. `id`, `properties.status`).
- **Domain validators** on top of schema: e.g. “invoice_stage must be one of draft | create_invoice | qa | invoice_sent | rg_storniert” (from your E2E plan). These live in `src/validation/domain/`.

### 4.3 Status Code Assertion (Inside Service or Test)

Base client already throws `ApiError` on 4xx/5xx. For explicit status assertion:

```typescript
// src/validation/status-codes.ts

export const EXPECTED_STATUS = {
  create: 201,
  get: 200,
  update: 200,
  patch: 200,
  delete: 204,
  search: 200,
} as const;

// In test or service wrapper:
// expect(response.status()).toBe(EXPECTED_STATUS.create);
// Or: Base client throws on non-2xx, so test only checks response shape.
```

### 4.4 JSON Schema Validation (Snippet)

```typescript
// src/validation/json-schema.validator.ts

import Ajv, { ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const schemaCache = new Map<string, ValidateFunction>();

export function loadSchema(schemaPath: string): ValidateFunction {
  if (!schemaCache.has(schemaPath)) {
    const fullPath = path.isAbsolute(schemaPath)
      ? schemaPath
      : path.join(__dirname, "../data/schemas", schemaPath);
    const schema = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
    schemaCache.set(schemaPath, ajv.compile(schema));
  }
  return schemaCache.get(schemaPath)!;
}

export function validateWithSchema(
  schemaPath: string,
  data: unknown
): { valid: boolean; errors: string[] } {
  const validate = loadSchema(schemaPath);
  const valid = validate(data);
  const errors = (validate.errors ?? []).map(
    (e) => `${e.instancePath} ${e.message}`
  );
  return { valid: !!valid, errors };
}
```

Tests then call `validateWithSchema("hubspot/company.response.schema.json", response)` and assert `valid` and empty `errors`.

---

## 5. Reporting & CI/CD

### 5.1 Why Allure + HTML

- **Allure:** Rich attachments (request/response bodies, env), hierarchical structure (suites → specs → steps), and trend charts. Fits API tests where each “step” is often one HTTP call.
- **HTML (Playwright):** Zero config, good for local runs and as a fallback when Allure is not installed in CI.

### 5.2 Reporter Configuration (playwright.config.ts)

```typescript
// playwright.config.ts (excerpt)

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  timeout: 120_000,
  retries: 0,
  fullyParallel: false,           // E2E phases are serial; API tests can be parallel
  workers: 1,                    // Serial E2E; increase for API-only runs
  use: {
    baseURL: process.env.HUBSPOT_BASE_URL ?? "https://api.hubapi.com",
    trace: "off",                // No browser; no trace needed
    video: "off",
  },
  outputDir: "./test-results",
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "./playwright-report" }],
    ["allure-playwright", { outputFolder: "./allure-results", detail: true }],
  ],
  projects: [
    { name: "api", testMatch: "**/api/**/*.spec.ts" },
    { name: "e2e", testMatch: "**/e2e/**/*.spec.ts", dependencies: [] },
  ],
});
```

### 5.3 CI/CD — Lightweight, Headless API Execution

- **No browser:** Do not install Chromium/Firefox; use `playwright install` with no browsers or rely on `@playwright/test`’s API-only usage (no browser binary required for `request`).
- **Env:** Inject `HUBSPOT_ACCESS_TOKEN` (and optional `N8N_*`) as secrets. Use a single job for API + E2E or separate jobs for “smoke” vs “full regression.”

### 5.4 Sample GitHub Actions YAML

```yaml
# .github/workflows/playwright-api.yml

name: Playwright API & E2E

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: "20"

jobs:
  api-tests:
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

      # No browser install — API-only; uncomment if you add UI tests later:
      # - name: Install Playwright browsers
      #   run: npx playwright install --with-deps chromium

      - name: Run Playwright API tests
        run: npx playwright test --project=api
        env:
          HUBSPOT_ACCESS_TOKEN: ${{ secrets.HUBSPOT_ACCESS_TOKEN }}
          HUBSPOT_BASE_URL: ${{ vars.HUBSPOT_BASE_URL || 'https://api.hubapi.com' }}

      - name: Run E2E tests (serial)
        run: npx playwright test --project=e2e --workers=1
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

      - name: Upload Allure results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: allure-results
          path: automation/allure-results
          retention-days: 14
```

### 5.5 Sample GitLab CI YAML

```yaml
# .gitlab-ci.yml (excerpt for API/E2E)

variables:
  NODE_VERSION: "20"

.playwright-base:
  image: node:${NODE_VERSION}-bookworm
  cache:
    key: npm-${CI_COMMIT_REF_SLUG}
    paths:
      - automation/node_modules
  before_script:
    - cd automation
    - npm ci

api-e2e-tests:
  extends: .playwright-base
  stage: test
  script:
    - npx playwright test --project=api
    - npx playwright test --project=e2e --workers=1
  variables:
    HUBSPOT_ACCESS_TOKEN: $HUBSPOT_ACCESS_TOKEN
  artifacts:
    when: always
    paths:
      - automation/playwright-report
      - automation/allure-results
    reports:
      junit: automation/test-results/junit.xml
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

---

## 6. Alignment With Your Docs and Plan

- **HubSpot (`docs/hubspot`):** Service classes (companies, deals, line items, custom objects, associations) map to workflows (1026, 1027, 2033, 2029, 2030b, etc.). Validators and test data can reference workflow IDs and stage names from these docs.
- **n8n (`docs/n8n`):** `webhooks.service.ts` and optional `workflows-catalog.ts` map to workflows like Line Item Sync, create-project, create-invoice-document-queue, send-invoice-to-sap-queue. E2E specs align with “Phase 2–6” flows described in the n8n docs.
- **E2E plan:** Phase numbering (01–10), serial execution, golden records (phase N → phase N+1), polling with `waitForCondition`, and cleanup with `test_gate = Yes` remain as in the plan; the blueprint only structures **where** the code lives (SOM, data, validation) and **how** it is driven (base client, fixtures, env, CI).

---

## 7. Summary

| Area              | Design choice                                      | Why |
|-------------------|----------------------------------------------------|-----|
| Structure         | SOM by service/endpoint (HubSpot, n8n)             | Matches backend boundaries; no UI. |
| Base layer        | `BaseApiClient` + Playwright `APIRequestContext`   | Single place for auth, headers, logging, error handling. |
| Data              | Env module + JSON payloads + builders              | Reuse, env-specific data, fewer code changes. |
| Validation        | Status codes + JSON Schema + domain validators     | Contract and business rules in one place. |
| Reporting         | Allure + HTML                                      | Rich API reporting; HTML as fallback. |
| CI/CD             | Single job, no browser, secrets for tokens         | Fast, headless, secure. |

This blueprint is ready for review. Once approved, implementation can proceed stepwise: core → HubSpot services → data/validation → E2E migration → n8n → reporting/CI.
