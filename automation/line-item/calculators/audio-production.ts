import { getHubDbRows } from "../hubspot-client";
import { HUBDB } from "../hubdb-tables";
import type { CalculationResult, LineItemProps } from "./types";

export async function calculateAudioProduction(
  props: LineItemProps,
): Promise<CalculationResult> {
  const { tableId } = HUBDB.audioProduction;
  const filters: Record<string, string> = {};
  for (const col of HUBDB.audioProduction.filterColumns) {
    const val = props[col];
    if (val) filters[col] = val;
  }

  const rows = await getHubDbRows(tableId, filters);
  if (rows.length === 0) {
    console.warn(
      `[Audio Production] No HubDB match for filters: ${JSON.stringify(filters)}`,
    );
    return {
      expected_price: 0,
      expected_quantity: null,
      expected_description: null,
      expected_internal_orders: null,
      expected_revenue_accounts: null,
    };
  }

  const v = rows[0].values;
  return {
    expected_price: v.unit_price != null ? Number(v.unit_price) : null,
    expected_quantity: null,
    expected_description: v.description ?? null,
    expected_internal_orders:
      v.internal_orders != null ? String(v.internal_orders) : null,
    expected_revenue_accounts:
      v.revenue_accounts != null ? String(v.revenue_accounts) : null,
  };
}
