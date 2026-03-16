import { getHubDbRows } from "../hubspot-client";
import { HUBDB } from "../hubdb-tables";
import type { CalculationResult, LineItemProps } from "./types";

/**
 * Parses the integer from a laufzeit value (e.g. "40" -> 40, "15" -> 15).
 * HubSpot stores just the number as a string.
 */
function parseLaufzeit(laufzeit: string | null | undefined): number | null {
  if (!laufzeit) return null;
  const match = laufzeit.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Strips the "KW " prefix from the kw field value.
 * HubSpot stores e.g. "KW 2"; the description uses just "2".
 */
function parseKw(kw: string | null | undefined): string {
  if (!kw) return "";
  return kw.replace(/^KW\s*/i, "").trim();
}

export async function calculateRadioSponsoring(
  props: LineItemProps,
): Promise<CalculationResult> {
  const laufzeitRaw = props.laufzeit ?? "";
  const laufzeitNumber = parseLaufzeit(laufzeitRaw);
  const expectedQuantity = laufzeitNumber;

  const { tableId } = HUBDB.radioSponsoring;
  const filters: Record<string, string> = {};
  for (const col of HUBDB.radioSponsoring.filterColumns) {
    const val = props[col];
    if (val) filters[col] = val;
  }

  const rows = await getHubDbRows(tableId, filters);
  if (rows.length === 0) {
    console.warn(
      `[Radio Sponsoring] No HubDB match for filters: ${JSON.stringify(filters)}`,
    );
    return {
      expected_price: 0,
      expected_quantity: expectedQuantity,
      expected_description: null,
      expected_internal_orders: null,
      expected_revenue_accounts: null,
    };
  }

  const v = rows[0].values;

  let basePrice = v.unit_price != null ? Number(v.unit_price) : 0;
  if (laufzeitRaw === "2" || laufzeitRaw === "2 Wochen") {
    basePrice = basePrice * 1.3;
  }
  const expectedPrice = Math.round(basePrice * 100) / 100;

  const weeklyMentions =
    v.weekly_mentions != null ? Number(v.weekly_mentions) : 0;
  const expectedNennungen =
    laufzeitNumber != null ? weeklyMentions * laufzeitNumber : null;

  // n8n builds the description from HubDB base + nennungen/kw/laufzeit
  const baseDescription: string = v.description ?? "";
  const kwNumber = parseKw(props.kw);
  let expectedDescription: string | null = null;
  if (baseDescription && expectedNennungen != null && kwNumber && laufzeitNumber) {
    expectedDescription =
      `${baseDescription} | ${expectedNennungen} Nennungen | ab KW ${kwNumber} für ${laufzeitNumber} Wochen`;
  }

  return {
    expected_price: expectedPrice,
    expected_quantity: expectedQuantity,
    expected_description: expectedDescription,
    expected_internal_orders:
      v.internal_orders != null ? String(v.internal_orders) : null,
    expected_revenue_accounts:
      v.revenue_accounts != null ? String(v.revenue_accounts) : null,
  };
}
