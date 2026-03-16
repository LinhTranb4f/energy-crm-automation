const BASE = "https://api.hubapi.com";

/** production (default) or sandbox */
export function getHubSpotEnv(): "production" | "sandbox" {
  const v = (process.env.HUBSPOT_ENV ?? "production").toLowerCase();
  return v === "sandbox" ? "sandbox" : "production";
}

function token(): string {
  const env = getHubSpotEnv();
  const t =
    env === "sandbox" && process.env.HUBSPOT_ACCESS_TOKEN_SANDBOX
      ? process.env.HUBSPOT_ACCESS_TOKEN_SANDBOX
      : process.env.HUBSPOT_ACCESS_TOKEN;
  if (!t) throw new Error("HUBSPOT_ACCESS_TOKEN is not set (or HUBSPOT_ACCESS_TOKEN_SANDBOX when HUBSPOT_ENV=sandbox)");
  return t;
}

function headers() {
  return {
    Authorization: `Bearer ${token()}`,
    "Content-Type": "application/json",
  };
}

async function hubGet(path: string): Promise<any> {
  const res = await fetch(`${BASE}${path}`, { headers: headers() });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`HubSpot GET ${path} → ${res.status}: ${body}`);
  }
  return res.json();
}

async function hubPost(path: string, body: any): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot POST ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

async function hubPatch(path: string, body: any): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot PATCH ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

async function hubPut(path: string, body: any): Promise<any> {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HubSpot PUT ${path} → ${res.status}: ${text}`);
  }
  return res.json();
}

async function hubDelete(path: string): Promise<void> {
  const res = await fetch(`${BASE}${path}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(`HubSpot DELETE ${path} → ${res.status}: ${text}`);
  }
}

// ---------------------------------------------------------------------------
// Company (Phase 1)
// ---------------------------------------------------------------------------

export async function createCompany(
  properties: Record<string, string>,
): Promise<string> {
  const data = await hubPost("/crm/v3/objects/companies", {
    properties: Object.fromEntries(
      Object.entries(properties).filter(([, v]) => v != null && v !== ""),
    ),
  });
  return data.id;
}

export async function getCompanyProperties(
  companyId: string,
  properties: string[],
): Promise<Record<string, string | null>> {
  const qs = properties.map((p) => `properties=${p}`).join("&");
  const data = await hubGet(`/crm/v3/objects/companies/${companyId}?${qs}`);
  return data.properties ?? {};
}

// ---------------------------------------------------------------------------
// Contact (Phase 1)
// ---------------------------------------------------------------------------

export async function createContact(
  properties: Record<string, string>,
): Promise<string> {
  const data = await hubPost("/crm/v3/objects/contacts", {
    properties: Object.fromEntries(
      Object.entries(properties).filter(([, v]) => v != null && v !== ""),
    ),
  });
  return data.id;
}

export async function getContactProperties(
  contactId: string,
  properties: string[],
): Promise<Record<string, string | null>> {
  const qs = properties.map((p) => `properties=${p}`).join("&");
  const data = await hubGet(`/crm/v3/objects/contacts/${contactId}?${qs}`);
  return data.properties ?? {};
}

// ---------------------------------------------------------------------------
// Associations (Phase 1: Contact ↔ Company)
// ---------------------------------------------------------------------------

/** Create association from contact to company. Uses HubSpot v4 associations. */
export async function associateContactToCompany(
  contactId: string,
  companyId: string,
  associationTypeId: number = 1,
): Promise<void> {
  await hubPut(
    `/crm/v4/objects/contacts/${contactId}/associations/companies/${companyId}`,
    [
      {
        associationCategory: "HUBSPOT_DEFINED",
        associationTypeId,
      },
    ],
  );
}

/** Get company IDs associated to a contact. */
export async function getContactAssociatedCompanyIds(
  contactId: string,
): Promise<string[]> {
  const data = await hubGet(
    `/crm/v4/objects/contacts/${contactId}/associations/companies`,
  );
  const results = data.results ?? [];
  return results.map((r: { toObjectId: string | number }) =>
    String(r.toObjectId),
  );
}

// ---------------------------------------------------------------------------
// Delete (cleanup)
// ---------------------------------------------------------------------------

export async function deleteObject(
  objectType: "companies" | "contacts" | "deals",
  objectId: string,
): Promise<void> {
  await hubDelete(`/crm/v3/objects/${objectType}/${objectId}`);
}

// ---------------------------------------------------------------------------
// Portal property audit (Block A2 / B1–B4)
// ---------------------------------------------------------------------------

/** Fetch all company property definitions (for portal audit). */
export async function listCompanyProperties(): Promise<
  Array<{ name: string; label: string }>
> {
  const data = await hubGet("/crm/v3/properties/companies");
  return (data.results ?? []).map((p: any) => ({
    name: p.name,
    label: p.label ?? p.name,
  }));
}

/** Fetch all contact property definitions (for portal audit). */
export async function listContactProperties(): Promise<
  Array<{ name: string; label: string }>
> {
  const data = await hubGet("/crm/v3/properties/contacts");
  return (data.results ?? []).map((p: any) => ({
    name: p.name,
    label: p.label ?? p.name,
  }));
}

/** Fetch all deal property definitions (for Phase 2 schema audit). */
export async function listDealProperties(): Promise<
  Array<{ name: string; label: string }>
> {
  const data = await hubGet("/crm/v3/properties/deals");
  return (data.results ?? []).map((p: any) => ({
    name: p.name,
    label: p.label ?? p.name,
  }));
}

/** Fetch all line item property definitions (for Phase 2 schema audit). */
export async function listLineItemProperties(): Promise<
  Array<{ name: string; label: string }>
> {
  const data = await hubGet("/crm/v3/properties/line_items");
  return (data.results ?? []).map((p: any) => ({
    name: p.name,
    label: p.label ?? p.name,
  }));
}

/** Fetch deal pipeline and stage IDs (for Phase 2). */
export async function listDealPipelines(): Promise<
  Array<{ id: string; label: string; stages: Array<{ id: string; label: string }> }>
> {
  const data = await hubGet("/crm/v3/pipelines/deals");
  return (data.results ?? []).map((p: any) => ({
    id: p.id,
    label: p.label ?? p.id,
    stages: (p.stages ?? []).map((s: any) => ({
      id: s.id,
      label: s.label ?? s.id,
    })),
  }));
}

// ---------------------------------------------------------------------------
// Deal helpers
// ---------------------------------------------------------------------------

export async function getDealProperties(
  dealId: string,
  properties: string[],
): Promise<Record<string, string | null>> {
  const qs = properties.map((p) => `properties=${p}`).join("&");
  const data = await hubGet(`/crm/v3/objects/deals/${dealId}?${qs}`);
  return data.properties;
}

export async function getDealBillingCycle(
  dealId: string,
): Promise<string | null> {
  const props = await getDealProperties(dealId, ["billing_cycle"]);
  return props.billing_cycle ?? null;
}

export function isDealEligible(billingCycle: string | null): boolean {
  if (!billingCycle || billingCycle.trim() === "") return true;
  const lower = billingCycle.trim().toLowerCase();
  return lower === "upfront" || lower === "end_of_campaign";
}

// ---------------------------------------------------------------------------
// Deal line items total (net, before tax)
// ---------------------------------------------------------------------------

export async function getDealLineItemsTotal(dealId: string): Promise<number> {
  const assoc = await hubGet(
    `/crm/v3/objects/deals/${dealId}/associations/line_items`,
  );
  const ids: string[] = (assoc.results ?? []).map(
    (r: any) => r.id ?? r.toObjectId,
  );
  if (ids.length === 0) throw new Error(`Deal ${dealId} has no line items`);

  const batch = await hubPost("/crm/v3/objects/line_items/batch/read", {
    inputs: ids.map((id) => ({ id })),
    properties: ["amount", "price", "quantity"],
  });

  let total = 0;
  for (const item of batch.results ?? []) {
    const amount = parseFloat(item.properties.amount ?? "0");
    if (amount) {
      total += amount;
    } else {
      const price = parseFloat(item.properties.price ?? "0");
      const qty = parseFloat(item.properties.quantity ?? "1");
      total += price * qty;
    }
  }
  return Math.round(total * 100) / 100;
}

// ---------------------------------------------------------------------------
// Quote selection (tiered: completed → pending → published)
// ---------------------------------------------------------------------------

interface QuoteSummary {
  id: string;
  hs_sign_status: string | null;
  hs_esign_date: string | null;
  hs_lastmodifieddate: string | null;
  hs_status: string | null;
}

export async function getSelectedQuoteId(dealId: string): Promise<string> {
  const assoc = await hubGet(
    `/crm/v3/objects/deals/${dealId}/associations/quotes`,
  );
  const ids: string[] = (assoc.results ?? []).map(
    (r: any) => r.id ?? r.toObjectId,
  );
  if (ids.length === 0) throw new Error(`Deal ${dealId} has no quotes`);

  const batch = await hubPost("/crm/v3/objects/quotes/batch/read", {
    inputs: ids.map((id) => ({ id })),
    properties: [
      "hs_quote_amount",
      "hs_sign_status",
      "hs_lastmodifieddate",
      "hs_esign_date",
      "hs_status",
    ],
  });

  const quotes: QuoteSummary[] = (batch.results ?? []).map((r: any) => ({
    id: r.id,
    hs_sign_status: r.properties.hs_sign_status ?? null,
    hs_esign_date: r.properties.hs_esign_date ?? null,
    hs_lastmodifieddate: r.properties.hs_lastmodifieddate ?? null,
    hs_status: r.properties.hs_status ?? null,
  }));

  const completed = quotes.filter(
    (q) =>
      q.hs_sign_status === "ESIGN_COMPLETED" ||
      q.hs_sign_status === "MANUALLY_SIGNED",
  );
  const pending = quotes.filter((q) => q.hs_sign_status === "ESIGN_PENDING");
  const published = quotes.filter(
    (q) =>
      !q.hs_sign_status &&
      q.hs_status !== "DRAFT" &&
      q.hs_status !== "ARCHIVED",
  );

  let chosen: QuoteSummary[];
  if (completed.length > 0) {
    chosen = completed.sort((a, b) => {
      const dateA =
        a.hs_sign_status === "ESIGN_COMPLETED"
          ? a.hs_esign_date
          : a.hs_lastmodifieddate;
      const dateB =
        b.hs_sign_status === "ESIGN_COMPLETED"
          ? b.hs_esign_date
          : b.hs_lastmodifieddate;
      return new Date(dateB ?? 0).getTime() - new Date(dateA ?? 0).getTime();
    });
  } else if (pending.length > 0) {
    chosen = pending.sort(
      (a, b) =>
        new Date(b.hs_lastmodifieddate ?? 0).getTime() -
        new Date(a.hs_lastmodifieddate ?? 0).getTime(),
    );
  } else if (published.length > 0) {
    chosen = published.sort(
      (a, b) =>
        new Date(b.hs_lastmodifieddate ?? 0).getTime() -
        new Date(a.hs_lastmodifieddate ?? 0).getTime(),
    );
  } else {
    throw new Error(
      `Deal ${dealId}: no completed, pending, or published quotes found`,
    );
  }

  console.log(
    `  Selected quote ${chosen[0].id} (sign_status: ${chosen[0].hs_sign_status ?? "none"}, hs_status: ${chosen[0].hs_status})`,
  );
  return chosen[0].id;
}

// ---------------------------------------------------------------------------
// Calculated quote total (net, before tax — from line_items + discounts)
// Per n8n "HubSpot | Update deal Amount to match new quote amount"
// ---------------------------------------------------------------------------

export async function getCalculatedQuoteTotal(
  quoteId: string,
): Promise<number> {
  const quoteData = await hubGet(
    `/crm/v3/objects/quotes/${quoteId}?associations=line_items,discounts`,
  );

  // HubSpot returns association key as "line items" (with space) or "line_items"
  const lineItemAssocs =
    quoteData.associations?.line_items?.results ??
    quoteData.associations?.["line items"]?.results ??
    [];
  const lineItemIds: string[] = lineItemAssocs.map(
    (r: any) => r.id ?? r.toObjectId,
  );

  let subtotalBeforeDiscounts = 0;
  if (lineItemIds.length > 0) {
    const liBatch = await hubPost("/crm/v3/objects/line_items/batch/read", {
      inputs: lineItemIds.map((id) => ({ id })),
      properties: ["price", "quantity", "hs_total_discount", "amount"],
    });
    for (const item of liBatch.results ?? []) {
      const price = parseFloat(item.properties.price ?? "0");
      const qty = parseFloat(item.properties.quantity ?? "1");
      const lineDiscount = parseFloat(item.properties.hs_total_discount ?? "0");
      subtotalBeforeDiscounts += price * qty - lineDiscount;
    }
  }

  // Quote-level discounts
  const discountAssocs = quoteData.associations?.discounts?.results ?? [];
  let totalBeforeTax = subtotalBeforeDiscounts;

  if (discountAssocs.length > 0) {
    const discountIds: string[] = discountAssocs.map(
      (r: any) => r.id ?? r.toObjectId,
    );
    for (const discId of discountIds) {
      const disc = await hubGet(
        `/crm/v3/objects/discounts/${discId}?properties=hs_type,hs_value`,
      );
      const discType = disc.properties.hs_type;
      const discValue = parseFloat(disc.properties.hs_value ?? "0");
      if (discType === "PERCENT") {
        totalBeforeTax -= totalBeforeTax * (discValue / 100);
      } else {
        totalBeforeTax -= discValue;
      }
    }
  }

  const rounded = Math.round(totalBeforeTax * 100) / 100;
  console.log(
    `  Quote ${quoteId}: lineItemsSubtotal=${subtotalBeforeDiscounts.toFixed(2)}, afterDiscounts(net)=${rounded}`,
  );
  return rounded;
}

// ---------------------------------------------------------------------------
// Invoices for deal
// ---------------------------------------------------------------------------

export interface InvoiceInfo {
  id: string;
  subtotal: number;
  grossTotal: number;
  pandadocUrl: string | null;
}

export async function getAllInvoicesForDeal(
  dealId: string,
): Promise<InvoiceInfo[]> {
  const assoc = await hubGet(
    `/crm/v3/objects/deals/${dealId}/associations/invoices`,
  );
  const ids: string[] = (assoc.results ?? []).map(
    (r: any) => r.id ?? r.toObjectId,
  );
  if (ids.length === 0) throw new Error(`Deal ${dealId} has no invoices`);

  const invoices: InvoiceInfo[] = [];
  for (const id of ids) {
    const inv = await hubGet(
      `/crm/v3/objects/invoices/${id}?properties=hs_amount_billed,hs_subtotal,hs_balance_due,invoice_standard_pandadoc_url,hs_lastmodifieddate`,
    );
    const grossTotal =
      parseFloat(inv.properties.hs_amount_billed ?? "0") ||
      parseFloat(inv.properties.hs_balance_due ?? "0") ||
      0;
    const subtotal = parseFloat(inv.properties.hs_subtotal ?? "0") || 0;
    invoices.push({
      id,
      subtotal: Math.round(subtotal * 100) / 100,
      grossTotal: Math.round(grossTotal * 100) / 100,
      pandadocUrl: inv.properties.invoice_standard_pandadoc_url ?? null,
    });
  }

  console.log(
    `  Found ${invoices.length} invoice(s): ${invoices.map((i) => `${i.id} net=${i.subtotal} gross=${i.grossTotal}`).join(", ")}`,
  );
  return invoices;
}
