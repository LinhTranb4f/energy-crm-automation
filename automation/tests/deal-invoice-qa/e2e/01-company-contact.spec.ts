/**
 * Phase 1 (CRM Setup): Company + Contact + Association.
 * TC-P1-1: Company created → WF 1007 sets status = "Aktiv"
 * TC-P1-2: Contact created
 * TC-P1-3: Contact associated to company
 * TC-P1-4: Golden Record shape
 * TC-P1-5: Cleanup (registry; cleanup runs from final E2E spec or when running this file with cleanup)
 *
 * Company and contact data: from Gemini AI (Germany or Switzerland only) when GEMINI_API_KEY/GOOGLE_API_KEY set; else static DE/CH fallback.
 * Stores Phase 1 Golden Record for Phase 2. Uses unique suffix for idempotent re-runs.
 */

import { test, expect } from "@playwright/test";
import {
  createCompany,
  createContact,
  getCompanyProperties,
  getContactProperties,
  associateContactToCompany,
  getContactAssociatedCompanyIds,
} from "../hubspot";
import { waitForCondition } from "../helpers/polling";
import {
  registerCompany,
  registerContact,
  runCleanup,
  getRegistry,
} from "../helpers/cleanup";
import {
  CONTACT_REQUIRED_FOR_CREATE,
  COMPANY_PROPERTIES,
  CONTACT_PROPERTIES,
  ASSOCIATION_CONTACT_TO_COMPANY_TYPE_ID,
  type Phase1GoldenRecord,
} from "../helpers/crm-schema";
import {
  generatePhase1TestData,
  logGeminiStatus,
} from "../helpers/fake-data-gemini";
import * as fs from "fs";
import * as path from "path";

const UNIQUE = `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

test.describe.serial("Phase 1: CRM Setup (Company + Contact)", () => {
  let companyId: string;
  let contactId: string;
  let goldenRecord: Phase1GoldenRecord | null = null;
  let testData: Awaited<ReturnType<typeof generatePhase1TestData>>;

  test.beforeAll(async () => {
    logGeminiStatus();
    testData = await generatePhase1TestData(UNIQUE);
    // Ensure country is Germany or Switzerland
    const country = testData.company.country ?? "Switzerland";
    if (country !== "Germany" && country !== "Switzerland") {
      testData.company.country = "Switzerland";
    }
  });

  test("TC-P1-1: Company created, WF 1007 sets status to Aktiv", async () => {
    // All 14 mandatory company fields (from Gemini or fallback); unique name; status empty so WF 1007 sets "Aktiv"
    const props: Record<string, string> = { ...testData.company };
    props.name = `${testData.company.name} ${UNIQUE}`;
    props.status = ""; // omit so WF 1007 sets "Aktiv"
    companyId = await createCompany(props);
    registerCompany(companyId);

    await waitForCondition(
      async () => {
        const p = await getCompanyProperties(companyId, ["status"]);
        return p.status === "Aktiv";
      },
      {
        timeoutMs: 30_000,
        intervalMs: 2_000,
        description: "company.status === 'Aktiv' (WF 1007)",
      },
    );

    const after = await getCompanyProperties(companyId, [
      "status",
      "name",
      "country",
    ]);
    expect(after.status).toBe("Aktiv");
    expect(after.name).toBe(props.name);
    expect(["Germany", "Switzerland"]).toContain(after.country);
    expect(after.country).toBe(props.country);
  });

  test("TC-P1-2: Contact created", async () => {
    const props: Record<string, string> = {
      firstname: testData.contact.firstname ?? "E2E",
      lastname: testData.contact.lastname ?? `Contact ${UNIQUE}`,
      email: testData.contact.email ?? `e2e-${UNIQUE}@example.com`,
    };
    contactId = await createContact(props);
    registerContact(contactId);

    const p = await getContactProperties(contactId, [
      ...CONTACT_REQUIRED_FOR_CREATE,
      "hs_lifecyclestage",
    ]);
    expect(p.firstname).toBe(props.firstname);
    expect(p.lastname).toBe(props.lastname);
    expect(p.email).toBe(props.email);
  });

  test("TC-P1-3: Contact associated to company", async () => {
    await associateContactToCompany(
      contactId,
      companyId,
      ASSOCIATION_CONTACT_TO_COMPANY_TYPE_ID,
    );

    const companyIds = await getContactAssociatedCompanyIds(contactId);
    expect(companyIds).toContain(companyId);
  });

  test("TC-P1-4: Golden Record shape", async () => {
    const testInfo = test.info();
    // Fetch all company and contact properties for the report
    const [companyPropsFull, contactPropsFull] = await Promise.all([
      getCompanyProperties(companyId, [...COMPANY_PROPERTIES]),
      getContactProperties(contactId, [...CONTACT_PROPERTIES]),
    ]);

    const [companyProps, contactProps] = await Promise.all([
      getCompanyProperties(companyId, ["status", "name", "country"]),
      getContactProperties(contactId, ["hs_lifecyclestage", "email"]),
    ]);

    goldenRecord = {
      companyId,
      contactId,
      company: {
        status: companyProps.status ?? "",
        name: companyProps.name ?? "",
        country: companyProps.country ?? "",
      },
      contact: {
        lifecycle_stage: contactProps.hs_lifecyclestage ?? null,
        email: contactProps.email ?? "",
      },
    };

    expect(goldenRecord.companyId).toBe(companyId);
    expect(goldenRecord.contactId).toBe(contactId);
    expect(goldenRecord.company.status).toBe("Aktiv");
    expect(goldenRecord.company.name).toBeTruthy();
    expect(goldenRecord.contact.email).toBeTruthy();

    // Full report with all company/contact info for Phase 2 and audit
    const fullReport = {
      runAt: new Date().toISOString(),
      uniqueSuffix: UNIQUE,
      environment: process.env.HUBSPOT_ENV ?? "production",
      companyId,
      contactId,
      company: {
        id: companyId,
        ...Object.fromEntries(
          Object.entries(companyPropsFull).filter(
            ([, v]) => v != null && v !== "",
          ),
        ),
      },
      contact: {
        id: contactId,
        ...Object.fromEntries(
          Object.entries(contactPropsFull).filter(
            ([, v]) => v != null && v !== "",
          ),
        ),
      },
      goldenRecord,
    };

    const reportJson = JSON.stringify(fullReport, null, 2);

    // Persist golden record for Phase 2
    const goldenPath = path.join(__dirname, "phase1-golden-record.json");
    fs.writeFileSync(
      goldenPath,
      JSON.stringify(goldenRecord, null, 2),
      "utf-8",
    );

    // Persist full report (all company/contact info)
    const reportPath = path.join(__dirname, "phase1-test-report.json");
    fs.writeFileSync(reportPath, reportJson, "utf-8");

    // Attach full report to Playwright report so it appears in the HTML report
    await testInfo.attach("phase1-full-report.json", {
      contentType: "application/json",
      body: reportJson,
    });
    await testInfo.attach("phase1-company-contact-summary.md", {
      contentType: "text/markdown",
      body: [
        "## Phase 1 – Company & Contact (full info)",
        "",
        "### Company",
        "| Property | Value |",
        "|----------|-------|",
        ...Object.entries(companyPropsFull).map(
          ([k, v]) => `| ${k} | ${v ?? ""} |`,
        ),
        "",
        "### Contact",
        "| Property | Value |",
        "|----------|-------|",
        ...Object.entries(contactPropsFull).map(
          ([k, v]) => `| ${k} | ${v ?? ""} |`,
        ),
        "",
        "### IDs",
        `- **Company ID:** ${companyId}`,
        `- **Contact ID:** ${contactId}`,
      ].join("\n"),
    });
  });

  // TC-P1-5: Cleanup runs from the final E2E spec (e.g. 10) or when running
  // only Phase 1 with CLEANUP_AFTER_PHASE1=1. Registry is shared across specs.
  test.afterAll(async () => {
    if (process.env.CLEANUP_AFTER_PHASE1 === "1") {
      const registered = getRegistry();
      if (registered.length > 0) await runCleanup();
    }
  });
});
