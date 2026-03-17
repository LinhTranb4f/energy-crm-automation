import type { BaseRequest } from "../client/baseRequest";
import {
  createContact as legacyCreateContact,
  getContactProperties as legacyGetContactProperties,
  associateContactToCompany as legacyAssociateContactToCompany,
  getContactAssociatedCompanyIds as legacyGetContactAssociatedCompanyIds,
} from "../tests/e2e/hubspot";

/**
 * Contact-related actions for Phase 1.
 * Currently delegate to the existing hubspot.ts helpers so behaviour is unchanged.
 * The BaseRequest argument is reserved for future migration to Playwright request.
 */

export async function createContactAction(
  _req: BaseRequest,
  properties: Record<string, string>,
): Promise<string> {
  return legacyCreateContact(properties);
}

export async function getContactPropertiesAction(
  _req: BaseRequest,
  contactId: string,
  properties: string[],
): Promise<Record<string, string | null>> {
  return legacyGetContactProperties(contactId, properties);
}

export async function associateContactToCompanyAction(
  _req: BaseRequest,
  contactId: string,
  companyId: string,
  associationTypeId?: number,
): Promise<void> {
  await legacyAssociateContactToCompany(contactId, companyId, associationTypeId);
}

export async function getContactAssociatedCompanyIdsAction(
  _req: BaseRequest,
  contactId: string,
): Promise<string[]> {
  return legacyGetContactAssociatedCompanyIds(contactId);
}

