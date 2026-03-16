import { test, expect } from "@playwright/test";
import {
  getLineItemProperties,
  resolveLineItemIds,
  isLineItemInOrderPipeline,
} from "./hubspot-client";
import { resolveProductType } from "./hubdb-tables";
import { calculate, type CalculationResult } from "./calculators";

// ---------------------------------------------------------------------------
// Resolve line item IDs: DEAL_ID > LINE_ITEM_IDS > demo fallback
// ---------------------------------------------------------------------------

const DEMO_IDS = [
  "434866761962", // Radio Spots
  "434866761965", // Digital Spots
  "434866761964", // Audio Production
  "434866761963", // Radio Sponsoring
];

async function getLineItemIds(): Promise<string[]> {
  if (process.env.DEAL_ID) {
    console.log(`Resolving line items from Deal ${process.env.DEAL_ID}…`);
    return resolveLineItemIds(process.env.DEAL_ID);
  }
  if (process.env.LINE_ITEM_IDS) {
    return process.env.LINE_ITEM_IDS.split(",").map((s) => s.trim());
  }
  return DEMO_IDS;
}

// Playwright needs test names at parse time, so we resolve eagerly via a
// synchronous wrapper that blocks on the first test.beforeAll invocation.
let resolvedIds: string[] | null = null;

// ---------------------------------------------------------------------------
// Single top-level describe that resolves IDs once, then runs per-item tests
// ---------------------------------------------------------------------------

test.describe("Line Item Calculation QA", () => {
  test.beforeAll(async () => {
    resolvedIds = await getLineItemIds();
    console.log(`Testing ${resolvedIds.length} line item(s): ${resolvedIds.join(", ")}`);
  });

  test("all line items pass calculation checks", async () => {
    expect(resolvedIds).not.toBeNull();
    const ids = resolvedIds!;
    expect(ids.length).toBeGreaterThan(0);

    const failures: string[] = [];

    for (const lineItemId of ids) {
      console.log(`\n── Line Item ${lineItemId} ──`);
      const props = await getLineItemProperties(lineItemId);
      const name = props.name ?? "(unknown)";
      console.log(`  Name: ${name}`);

      const productType = resolveProductType(props.name);
      if (!productType) {
        console.log(`  SKIP – unrecognised product name "${name}"`);
        continue;
      }

      let expected: CalculationResult;
      try {
        expected = await calculate(props);
      } catch (err) {
        failures.push(`${lineItemId} (${name}): calculator error – ${err}`);
        continue;
      }

      console.log("  Expected:", JSON.stringify(expected, null, 2));
      console.log("  Actual  :", JSON.stringify(pickActual(props, productType), null, 2));

      const skipQuantityForOrderPipeline =
        productType === "radioSpots" &&
        (await isLineItemInOrderPipeline(lineItemId));
      if (skipQuantityForOrderPipeline) {
        console.log("  (Deal in Order-Pipeline: skipping quantity assertion for Radio Spots)");
      }

      const itemFailures = assertMatch(
        lineItemId,
        name,
        props,
        expected,
        productType,
        skipQuantityForOrderPipeline,
      );
      failures.push(...itemFailures);
    }

    if (failures.length > 0) {
      const msg = `${failures.length} assertion(s) failed:\n  • ${failures.join("\n  • ")}`;
      console.error(`\n${msg}`);
      expect(failures, msg).toHaveLength(0);
    }
  });
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function pickActual(
  props: Record<string, string | null>,
  productType: string,
): Record<string, any> {
  const out: Record<string, any> = {
    price: props.price != null ? Number(props.price) : null,
    quantity: props.quantity != null ? Number(props.quantity) : null,
    description: props.description ?? null,
    internal_orders: props.internal_orders ?? null,
    revenue_accounts: props.revenue_accounts ?? null,
  };
  if (productType === "digitalSpots") {
    out.count_of_targetings =
      props.count_of_targetings != null
        ? Number(props.count_of_targetings)
        : null;
  }
  return out;
}

function assertMatch(
  lineItemId: string,
  name: string,
  props: Record<string, string | null>,
  expected: CalculationResult,
  productType: string,
  skipQuantityAssertion: boolean,
): string[] {
  const fails: string[] = [];
  const tag = `${lineItemId} (${name})`;

  function cmp(field: string, actual: any, exp: any) {
    if (exp === null || exp === undefined) return;
    const actualNum = typeof actual === "string" ? Number(actual) : actual;
    const expNum = typeof exp === "number" ? exp : exp;

    if (typeof expNum === "number" && typeof actualNum === "number") {
      if (Math.abs(actualNum - expNum) > 0.01) {
        fails.push(`${tag}: ${field} → actual ${actualNum}, expected ${expNum}`);
      }
    } else if (String(actual ?? "") !== String(exp ?? "")) {
      fails.push(`${tag}: ${field} → actual "${actual}", expected "${exp}"`);
    }
  }

  cmp("price", props.price, expected.expected_price);
  if (!skipQuantityAssertion) {
    cmp("quantity", props.quantity, expected.expected_quantity);
  }
  cmp("description", props.description, expected.expected_description);
  cmp("internal_orders", props.internal_orders, expected.expected_internal_orders);
  cmp("revenue_accounts", props.revenue_accounts, expected.expected_revenue_accounts);

  if (productType === "digitalSpots" && expected.expected_count_of_targetings != null) {
    cmp(
      "count_of_targetings",
      props.count_of_targetings,
      expected.expected_count_of_targetings,
    );
  }

  return fails;
}
