const BASE = "https://api.hubapi.com";

function token(): string {
  const t = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!t) throw new Error("HUBSPOT_ACCESS_TOKEN is not set");
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

const LINE_ITEM_PROPERTIES = [
  "name",
  "quantity",
  "price",
  "amount",
  "description",
  "plattform",
  "week_type",
  "time_category",
  "spot_duration",
  "spot_count",
  "production_type",
  "rubric",
  "laufzeit",
  "kw",
  "targeting",
  "count_of_targetings",
  "internal_orders",
  "revenue_accounts",
  "product_group",
  "hs_discount_percentage",
].join(",");

export async function getLineItemProperties(
  lineItemId: string,
): Promise<Record<string, string | null>> {
  const data = await hubGet(
    `/crm/v3/objects/line_items/${lineItemId}?properties=${LINE_ITEM_PROPERTIES}`,
  );
  return data.properties ?? {};
}

export const ORDER_PIPELINE_ID = "3387257046";

export async function resolveLineItemIds(dealId: string): Promise<string[]> {
  const data = await hubGet(
    `/crm/v3/objects/deals/${dealId}/associations/line_items`,
  );
  const results: Array<{ id?: string; toObjectId?: string }> =
    data.results ?? [];
  if (results.length === 0) {
    throw new Error(`Deal ${dealId} has no associated line items`);
  }
  return results.map((r) => String(r.id ?? r.toObjectId));
}

export async function getAssociatedDealIds(
  lineItemId: string,
): Promise<string[]> {
  const data = await hubGet(
    `/crm/v4/objects/line_items/${lineItemId}/associations/deals`,
  );
  const results: Array<{ toObjectId?: string }> = data.results ?? [];
  return results.map((r) => String(r.toObjectId));
}

export async function getDealPipelineId(
  dealId: string,
): Promise<string | null> {
  const data = await hubGet(
    `/crm/v3/objects/deals/${dealId}?properties=pipeline`,
  );
  const pipeline = data.properties?.pipeline;
  return pipeline != null ? String(pipeline) : null;
}

export async function isLineItemInOrderPipeline(
  lineItemId: string,
): Promise<boolean> {
  const dealIds = await getAssociatedDealIds(lineItemId);
  if (dealIds.length === 0) return false;
  const pipelineId = await getDealPipelineId(dealIds[0]);
  return pipelineId === ORDER_PIPELINE_ID;
}

export interface HubDbRow {
  id: string;
  values: Record<string, any>;
}

export async function getHubDbRows(
  tableId: string,
  filters: Record<string, string | number>,
): Promise<HubDbRow[]> {
  const params = new URLSearchParams();
  for (const [col, val] of Object.entries(filters)) {
    if (val !== undefined && val !== null && val !== "") {
      params.append(col, String(val));
    }
  }
  const data = await hubGet(
    `/cms/v3/hubdb/tables/${tableId}/rows?${params.toString()}`,
  );
  return (data.results ?? []).map((r: any) => ({
    id: r.id,
    values: r.values ?? {},
  }));
}

