import type { BaseRequest } from "../client/baseRequest";
import {
  createCompany as legacyCreateCompany,
  getCompanyProperties as legacyGetCompanyProperties,
} from "../tests/e2e/hubspot";

/**
 * Action: create a company.
 *
 * For now this delegates to the existing hubspot.ts helper so current tests
 * keep working. The BaseRequest argument is accepted for future migration
 * to Playwright's request context but is not used yet.
 */
export async function createCompanyAction(
  _req: BaseRequest,
  properties: Record<string, string>,
): Promise<string> {
  return legacyCreateCompany(properties);
}

export async function getCompanyPropertiesAction(
  _req: BaseRequest,
  companyId: string,
  properties: string[],
): Promise<Record<string, string | null>> {
  return legacyGetCompanyProperties(companyId, properties);
}

