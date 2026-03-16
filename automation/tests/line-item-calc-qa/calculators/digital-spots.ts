import { getHubDbRows, type HubDbRow } from "../hubspot-client";
import { HUBDB } from "../hubdb-tables";
import type { CalculationResult, LineItemProps } from "./types";

function countTargetings(targeting: string | null | undefined): number {
  if (!targeting || targeting.trim() === "") return 0;
  return targeting.split(";").filter((s) => s.trim() !== "").length;
}

/**
 * HubDB SELECT columns with numeric option names (like "0","1","2") confuse
 * the API filter which treats numbers as option IDs instead of names.
 * Filter client-side by matching count_of_targetings.name.
 */
function findRowByTargetingCount(
  rows: HubDbRow[],
  count: number,
): HubDbRow | undefined {
  return rows.find((r) => {
    const cot = r.values.count_of_targetings;
    if (typeof cot === "object" && cot !== null) {
      return String(cot.name) === String(count);
    }
    return String(cot) === String(count);
  });
}

export async function calculateDigitalSpots(
  props: LineItemProps,
): Promise<CalculationResult> {
  const targeting = props.targeting ?? "";
  const expectedCountOfTargetings = countTargetings(targeting);

  if (expectedCountOfTargetings > 3) {
    return {
      expected_price: 0,
      expected_quantity: null,
      expected_description: null,
      expected_internal_orders: null,
      expected_revenue_accounts: null,
      expected_count_of_targetings: expectedCountOfTargetings,
    };
  }

  const { tableId } = HUBDB.digitalSpots;
  const filters: Record<string, string> = {};
  if (props.plattform) filters.plattform = props.plattform;

  const rows = await getHubDbRows(tableId, filters);
  const matchedRow = findRowByTargetingCount(rows, expectedCountOfTargetings);

  if (!matchedRow) {
    console.warn(
      `[Digital Spots] No HubDB match for plattform=${props.plattform}, count_of_targetings=${expectedCountOfTargetings}`,
    );
    return {
      expected_price: 0,
      expected_quantity: null,
      expected_description: null,
      expected_internal_orders: null,
      expected_revenue_accounts: null,
      expected_count_of_targetings: expectedCountOfTargetings,
    };
  }

  const v = matchedRow.values;
  const baseDescription: string = v.description ?? "";

  // n8n appends targeting names to HubDB base description
  let expectedDescription = baseDescription;
  if (targeting && targeting.trim() !== "") {
    const names = targeting
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .join("; ");
    expectedDescription = `${baseDescription}: ${names}`;
  }

  return {
    expected_price: v.unit_price != null ? Number(v.unit_price) : null,
    expected_quantity: null,
    expected_description: expectedDescription,
    expected_internal_orders:
      v.internal_orders != null ? String(v.internal_orders) : null,
    expected_revenue_accounts:
      v.revenue_accounts != null ? String(v.revenue_accounts) : null,
    expected_count_of_targetings: expectedCountOfTargetings,
  };
}
