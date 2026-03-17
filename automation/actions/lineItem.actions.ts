import {
  getLineItemProperties as legacyGetLineItemProperties,
  resolveLineItemIds as legacyResolveLineItemIds,
  isLineItemInOrderPipeline as legacyIsLineItemInOrderPipeline,
} from "../line-item/hubspot-client";
import type { BaseRequest } from "../client/baseRequest";

/**
 * Line item–related actions used by line-item-calc-qa.
 * These are thin wrappers around the existing hubspot-client so behaviour
 * remains unchanged while tests move to the API Action Pattern.
 */

export async function getLineItemPropertiesAction(
  _req: BaseRequest,
  lineItemId: string,
): Promise<Record<string, string | null>> {
  return legacyGetLineItemProperties(lineItemId);
}

export async function resolveLineItemIdsAction(
  _req: BaseRequest,
  dealId: string,
): Promise<string[]> {
  return legacyResolveLineItemIds(dealId);
}

export async function isLineItemInOrderPipelineAction(
  _req: BaseRequest,
  lineItemId: string,
): Promise<boolean> {
  return legacyIsLineItemInOrderPipeline(lineItemId);
}

