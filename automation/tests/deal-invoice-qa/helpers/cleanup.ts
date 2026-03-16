/**
 * Test data registry and cleanup for E2E Phase 1+.
 * Register created object IDs and delete in reverse order in afterAll.
 */

import { deleteObject } from "../hubspot";

type ObjectType = "companies" | "contacts" | "deals";

interface RegisteredId {
  type: ObjectType;
  id: string;
}

const registry: RegisteredId[] = [];

export function registerCompany(id: string): void {
  registry.push({ type: "companies", id });
}

export function registerContact(id: string): void {
  registry.push({ type: "contacts", id });
}

export function registerDeal(id: string): void {
  registry.push({ type: "deals", id });
}

/**
 * Delete all registered objects in reverse order (contacts before companies, etc.).
 * Safe to call multiple times; clears registry after run.
 */
export async function runCleanup(): Promise<void> {
  const toDelete = [...registry].reverse();
  registry.length = 0;

  for (const { type, id } of toDelete) {
    try {
      await deleteObject(type, id);
    } catch (err) {
      console.warn(`Cleanup: failed to delete ${type} ${id}:`, err);
    }
  }
}

export function getRegistry(): readonly RegisteredId[] {
  return registry;
}
