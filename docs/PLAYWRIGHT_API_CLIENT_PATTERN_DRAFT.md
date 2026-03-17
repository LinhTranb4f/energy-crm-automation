# Playwright API Framework — API Client Pattern (Lightweight & Functional)

**Role:** Senior SDET / Automation Architect  
**Purpose:** Second draft for comparison with the [Service Object Model (SOM) Blueprint](./PLAYWRIGHT_API_FRAMEWORK_BLUEPRINT.md).  
**Approach:** Single centralized client + functional specs; no service classes.

---

## 1. Project Structure (Streamlined)

Minimal directory tree: one client, shared data/schemas, and specs that call the client directly.

```
automation/
├── playwright.config.ts
├── .env
├── package.json
│
├── lib/                                    # Thin framework layer
│   ├── apiClient.ts                        # Single centralized client (see §2)
│   ├── env.ts                              # Typed env (base URLs, tokens)
│   ├── payloadLoader.ts                    # Load JSON payloads + overrides
│   └── schemaValidator.ts                  # AJV-based JSON Schema validation
│
├── data/                                   # Data-driven assets
│   ├── payloads/
│   │   ├── company.create.json
│   │   ├── deal.create.json
│   │   └── contact.create.json
│   └── schemas/
│       ├── company.response.schema.json
│       └── deal.response.schema.json
│
├── tests/
│   ├── api/                                # Functional API specs (use apiClient directly)
│   │   ├── hubspot-companies.spec.ts
│   │   ├── hubspot-deals.spec.ts
│   │   └── hubspot-line-items.spec.ts
│   ├── e2e/
│   │   └── deal-invoice-qa/
│   │       ├── 01-company-contact.spec.ts
│   │       └── ...
│   └── line-item-calc-qa/
│       └── ...
│
├── test-results/
└── playwright-report/
```

**Design choices:**

- **No `src/`:** Use `lib/` for a small set of utilities; tests live in `tests/` and import from `lib/`.
- **No service classes:** Specs call `apiClient.get/post/patch/delete` (or thin helpers) with paths and bodies.
- **Single client:** One `apiClient.ts` encapsulates request context, auth, base URL, and logging.

---

## 2. Centralized API Client (`lib/apiClient.ts`)

One module that wraps Playwright’s `request` context with global headers, env-based config, auth injection, and detailed logging on failure.

```typescript
// lib/apiClient.ts

import { APIRequestContext, APIResponse } from "@playwright/test";
import { getConfig } from "./env";

export interface ApiClientOptions {
  baseURL: string;
  token?: string;
  defaultHeaders?: Record<string, string>;
  timeoutMs?: number;
  /** Log full request/response on non-2xx (for failed test debugging). */
  logOnFailure?: boolean;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: string,
    public readonly request?: { method: string; url: string; body?: unknown }
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function createApiClient(
  request: APIRequestContext,
  options?: Partial<ApiClientOptions>
) {
  const config = getConfig();
  const baseURL = (options?.baseURL ?? config.HUBSPOT_BASE_URL).replace(/\/$/, "");
  const token = options?.token ?? config.HUBSPOT_ACCESS_TOKEN;
  const timeoutMs = options?.timeoutMs ?? 30_000;
  const logOnFailure = options?.logOnFailure ?? true;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options?.defaultHeaders,
  };

  async function handleResponse<T>(
    response: APIResponse,
    method: string,
    url: string,
    requestBody?: unknown
  ): Promise<T> {
    const status = response.status();
    const text = await response.text();

    if (status >= 400) {
      if (logOnFailure) {
        console.error("[API FAILURE]", {
          method,
          url,
          status,
          requestBody: requestBody !== undefined ? JSON.stringify(requestBody).slice(0, 500) : undefined,
          responseBody: text.slice(0, 1000),
        });
      }
      throw new ApiError(
        `${method} ${url} → ${status}: ${text.slice(0, 200)}`,
        status,
        text,
        { method, url, body: requestBody }
      );
    }

    if (text.length === 0) return undefined as T;
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new ApiError(`Invalid JSON: ${method} ${url}`, status, text, { method, url, body: requestBody });
    }
  }

  return {
    async get<T = unknown>(path: string, params?: Record<string, string | number>): Promise<T> {
      const url = params
        ? `${baseURL}${path}?${new URLSearchParams(params as Record<string, string>)}`
        : `${baseURL}${path}`;
      const response = await request.get(url, {
        headers: defaultHeaders,
        timeout: timeoutMs,
      });
      return handleResponse<T>(response, "GET", url);
    },

    async post<T = unknown>(path: string, body: unknown): Promise<T> {
      const url = `${baseURL}${path}`;
      const response = await request.post(url, {
        headers: defaultHeaders,
        data: body,
        timeout: timeoutMs,
      });
      return handleResponse<T>(response, "POST", url, body);
    },

    async patch<T = unknown>(path: string, body: unknown): Promise<T> {
      const url = `${baseURL}${path}`;
      const response = await request.patch(url, {
        headers: defaultHeaders,
        data: body,
        timeout: timeoutMs,
      });
      return handleResponse<T>(response, "PATCH", url, body);
    },

    async delete(path: string): Promise<void> {
      const url = `${baseURL}${path}`;
      const response = await request.delete(url, {
        headers: defaultHeaders,
        timeout: timeoutMs,
      });
      if (response.status() !== 204) {
        const text = await response.text();
        if (logOnFailure) {
          console.error("[API FAILURE]", { method: "DELETE", url, status: response.status(), responseBody: text.slice(0, 500) });
        }
        throw new ApiError(`DELETE ${url} → ${response.status()}`, response.status(), text, { method: "DELETE", url });
      }
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
```

**Supporting env module (minimal):**

```typescript
// lib/env.ts

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

export function getConfig() {
  return {
    HUBSPOT_ACCESS_TOKEN: required("HUBSPOT_ACCESS_TOKEN"),
    HUBSPOT_BASE_URL: optional("HUBSPOT_BASE_URL", "https://api.hubapi.com"),
    ORDER_PIPELINE_ID: optional("ORDER_PIPELINE_ID", "3387257046"),
  };
}
```

---

## 3. Functional Test Spec (No Service Classes)

Specs use the client directly: build paths and bodies in the test (or via payload loader), then assert on status and response shape.

```typescript
// tests/api/hubspot-companies.spec.ts

import { test, expect } from "@playwright/test";
import { createApiClient, ApiError } from "../../lib/apiClient";
import { loadPayload } from "../../lib/payloadLoader";
import { validateWithSchema } from "../../lib/schemaValidator";

test.describe("HubSpot Companies API", () => {
  test("create company returns 201 and valid response shape", async ({ request }) => {
    const client = createApiClient(request);
    const body = loadPayload("company.create.json", {
      name: `E2E-Company-${Date.now()}`,
    });

    const res = await client.post<{ id: string; properties: Record<string, unknown> }>(
      "/crm/v3/objects/companies",
      { properties: body }
    );

    expect(res).toBeDefined();
    expect(res!.id).toBeDefined();
    expect(res!.properties?.name).toBe(body.name);

    const schemaResult = validateWithSchema("company.response.schema.json", res);
    expect(schemaResult.valid, schemaResult.errors.join("; ")).toBe(true);
  });

  test("get company returns 200", async ({ request }) => {
    const client = createApiClient(request);
    const createBody = loadPayload("company.create.json", { name: `E2E-Get-${Date.now()}` });
    const created = await client.post<{ id: string }>("/crm/v3/objects/companies", {
      properties: createBody,
    });

    const company = await client.get<{ id: string; properties: Record<string, unknown> }>(
      `/crm/v3/objects/companies/${created!.id}?properties=name,domain`
    );

    expect(company?.properties?.name).toBe(createBody.name);

    await client.delete(`/crm/v3/objects/companies/${created!.id}`);
  });

  test("invalid token returns 401", async ({ request }) => {
    const client = createApiClient(request, { token: "invalid-token" });
    await expect(
      client.get("/crm/v3/objects/companies/1")
    ).rejects.toThrow(ApiError);

    const err = await client.get("/crm/v3/objects/companies/1").catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(401);
  });
});
```

**Why this is “functional”:** No `CompaniesService` class; the test composes `createApiClient(request)` + `loadPayload(...)` + `client.post/get/delete` with explicit paths. Easy to read for a single domain; repetition can be reduced with small helper functions (e.g. `hubspotPath("companies", id)`) if needed.

---

## 4. Data-Driven + JSON Schema Validation

### 4.1 Payload Loader

```typescript
// lib/payloadLoader.ts

import * as fs from "fs";
import * as path from "path";

const DATA_DIR = path.resolve(process.cwd(), "data");

export function loadPayload<T = Record<string, unknown>>(
  relativePath: string,
  overrides?: Partial<T>
): T {
  const fullPath = path.join(DATA_DIR, "payloads", relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  const parsed = JSON.parse(raw) as T;
  return overrides ? { ...parsed, ...overrides } : parsed;
}
```

**Example payload:** `data/payloads/company.create.json`

```json
{
  "name": "Test Company",
  "domain": "test.example.com",
  "country": "Switzerland",
  "industry": "Energy"
}
```

### 4.2 JSON Schema Validator (AJV)

```typescript
// lib/schemaValidator.ts

import Ajv from "ajv";
import addFormats from "ajv-formats";
import * as fs from "fs";
import * as path from "path";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

const schemaCache = new Map<string, ReturnType<typeof ajv.compile>>();

export function validateWithSchema(
  schemaFileName: string,
  data: unknown
): { valid: boolean; errors: string[] } {
  const schemaPath = path.join(process.cwd(), "data", "schemas", schemaFileName);
  if (!schemaCache.has(schemaPath)) {
    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
    schemaCache.set(schemaPath, ajv.compile(schema));
  }
  const validate = schemaCache.get(schemaPath)!;
  const valid = validate(data);
  const errors = (validate.errors ?? []).map(
    (e) => `${e.instancePath} ${e.message}`
  );
  return { valid: !!valid, errors };
}
```

**Example schema:** `data/schemas/company.response.schema.json`

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["id", "properties"],
  "properties": {
    "id": { "type": "string" },
    "properties": {
      "type": "object",
      "required": ["name"],
      "properties": {
        "name": { "type": "string" },
        "domain": { "type": "string" }
      }
    }
  }
}
```

**Integration in spec:** Shown in §3 — `validateWithSchema("company.response.schema.json", res)` and assert `valid` and `errors`.

---

## 5. Comparison: API Client Pattern vs Service Object Model (SOM)

| Criterion | API Client Pattern (this draft) | Service Object Model (SOM) |
|----------|----------------------------------|----------------------------|
| **Initial setup time** | **Faster.** One `apiClient.ts` + small `lib/` (env, payloadLoader, schemaValidator). No service classes or fixture wiring. New tests only need `createApiClient(request)` and paths. | **Slower.** Requires base class, per-domain service classes (companies, deals, line-items, …), and fixture that injects each service. More files and abstractions before the first test runs. |
| **Maintenance effort** | **Endpoint-level.** When an API path or contract changes, you update the spec(s) that call that path and/or the shared payload/schema. No service method signature to change, but the same path may be duplicated across many specs. | **Localized.** Change is in one service method (e.g. `createCompany`). All specs using that method get the fix. Downside: you must touch the right service file and keep method signatures in sync with API. |
| **Scalability (500+ endpoints)** | **Weaker.** Specs tend to repeat paths and body shapes. Without discipline, you get large spec files or many similar helpers. Scaling requires introducing shared “path builders” or small functional modules (e.g. `hubspotPaths.ts`) and strict conventions. | **Stronger.** Each endpoint (or group) lives in one service method. 500 endpoints → many methods in a few service files or many small service modules. Clear place to add retries, mapping, or logging per operation. |
| **Readability (new developers)** | **Easier for small suites.** “One client, call get/post with a path and body” is easy to grasp. No inheritance or fixture wiring. For large suites, readability can degrade if paths and bodies are duplicated and not grouped. | **Steeper at first.** Newcomers must understand base class → service class → fixture. Once learned, “create a company” is a single call (`hubspot.companies.create(props)`), which is very readable and discoverable. |
| **Boilerplate** | **Low.** Few files; no class hierarchy. | **Higher.** Base class + N service classes + fixture. |
| **Test style** | **Functional:** tests compose client + data + validation explicitly. | **Object-oriented:** tests call service methods that hide HTTP details. |
| **Best fit** | Small to medium API surface; fast delivery; team prefers minimal abstraction. | Large API surface; long-term maintenance; need for clear ownership per domain and traceability to backend services. |

---

## 6. Summary

- **API Client Pattern:** Single `apiClient.ts` (with optional `lib/env.ts`, `lib/payloadLoader.ts`, `lib/schemaValidator.ts`), streamlined tree, and functional specs that use the client directly. **Pros:** quick start, low boilerplate, easy to read for small suites. **Cons:** path/body duplication at scale; scaling to 500+ endpoints needs conventions or thin helpers.
- **SOM:** Base client + service classes + fixture; tests use domain methods. **Pros:** better scalability and maintenance when many endpoints and domains; change in one place. **Cons:** more setup and more concepts for new developers.

Use the **comparison table** above to choose based on your team size, API size, and preference for “minimal vs structured” design.
