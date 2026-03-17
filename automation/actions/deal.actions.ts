import type { BaseRequest } from "../client/baseRequest";
import {
  getDealProperties as legacyGetDealProperties,
  getDealBillingCycle as legacyGetDealBillingCycle,
  getDealLineItemsTotal as legacyGetDealLineItemsTotal,
} from "../tests/e2e/hubspot";

/**
 * Deal-related actions. These currently wrap the existing hubspot.ts helpers
 * so that legacy specs continue to function without modification.
 */

export async function getDealPropertiesAction(
  _req: BaseRequest,
  dealId: string,
  properties: string[],
): Promise<Record<string, string | null>> {
  return legacyGetDealProperties(dealId, properties);
}

export async function getDealBillingCycleAction(
  _req: BaseRequest,
  dealId: string,
): Promise<string | null> {
  return legacyGetDealBillingCycle(dealId);
}

export async function getDealLineItemsTotalAction(
  _req: BaseRequest,
  dealId: string,
): Promise<number> {
  return legacyGetDealLineItemsTotal(dealId);
}

