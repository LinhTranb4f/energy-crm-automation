/**
 * Generate random Phase 1 test data (company + contact) using Google Gemini AI.
 * Constraint: country and address must be from Germany or Switzerland only.
 * Company must include all 14 mandatory fields. Use when GEMINI_API_KEY or GOOGLE_API_KEY is set.
 */

import { COMPANY_MANDATORY_FIELDS } from "./crm-schema";

const HUBSPOT_INDUSTRY_OPTIONS = [
  "MARKETING_AND_ADVERTISING",
  "MEDIA_PRODUCTION",
  "BROADCAST_MEDIA",
  "INFORMATION_TECHNOLOGY_AND_SERVICES",
  "MANAGEMENT_CONSULTING",
];

const PROMPT = `You are a test data generator. Generate exactly one company and one contact for CRM testing.

Rules:
- Country must be either "Germany" or "Switzerland" (pick one at random). Use the same for original_country.
- Address (street, city, zip) must be a realistic address in that country.
- Company industry must be exactly one of: ${HUBSPOT_INDUSTRY_OPTIONS.join(", ")}.
- For company: include name, address, city, zip, country, original_country, industry, status (use "Aktiv" or leave empty), company_number (e.g. CHE-123.456.789), company_code (e.g. 1000), customer_account_group (e.g. 1000), phone (digits only after +, e.g. +41441234567 or +493012345678, no spaces), website (https://...), e_mail (company email).
- Contact: firstname, lastname (short: 2–4 characters), email (short valid email, e.g. ab@x.co or a@b.de).
- Return ONLY valid JSON, no markdown, in this exact shape (use lowercase keys company and contact):
{"company":{"name":"...","address":"...","city":"...","zip":"...","country":"Germany or Switzerland","original_country":"Germany or Switzerland","industry":"one of the enum values","status":"Aktiv","company_number":"...","company_code":"...","customer_account_group":"...","phone":"...","website":"...","e_mail":"..."},"contact":{"firstname":"...","lastname":"...","email":"..."}}`;

export interface Phase1FakeData {
  company: Record<string, string>;
  contact: Record<string, string>;
}

/** HubSpot original_country uses enum codes (CH, DE), not full names. */
const COUNTRY_CODE: Record<string, string> = { Switzerland: "CH", Germany: "DE" };

/** Default values for mandatory company fields (Germany/Switzerland). Merged with Gemini or fallback. */
function getDefaultCompany(country: "Germany" | "Switzerland"): Record<string, string> {
  const isCH = country === "Switzerland";
  const code = COUNTRY_CODE[country] ?? "CH";
  return {
    name: isCH ? "Test Firma AG" : "Beispiel GmbH",
    address: isCH ? "Bahnhofstrasse 1" : "Hauptstraße 42",
    city: isCH ? "Zürich" : "Berlin",
    zip: isCH ? "8001" : "10115",
    country, // display name; HubSpot may accept or normalize
    original_country: code, // HubSpot requires CH/DE
    industry: "MARKETING_AND_ADVERTISING",
    status: "", // leave empty so WF 1007 sets "Aktiv"
    company_number: isCH ? "CHE-123.456.789" : "DE123456789",
    company_code: "1000",
    customer_account_group: "1000",
    phone: isCH ? "+41441234567" : "+493012345678", // HubSpot: +digits only, no spaces
    website: "https://www.example.com",
    e_mail: "info@example.com",
  };
}

/** Static fallback when Gemini is not configured or fails. All 14 mandatory company fields. */
const FALLBACK_DATA: Phase1FakeData[] = [
  {
    company: getDefaultCompany("Switzerland"),
    contact: {
      firstname: "Anna",
      lastname: "Mu",
      email: "am@x.co",
    },
  },
  {
    company: getDefaultCompany("Germany"),
    contact: {
      firstname: "Max",
      lastname: "Ko",
      email: "mk@x.co",
    },
  },
];

/** Normalize phone to HubSpot format: +digits only (e.g. +41441234567). */
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits ? `+${digits}` : phone;
}

const MAX_LASTNAME_LEN = 4;
const SHORT_EMAIL_DOMAIN = "x.co";

/** Shorten contact lastname (max 4 chars) and email (short local@x.co form) for readability. */
function shortenContact(contact: Record<string, string>): Record<string, string> {
  const lastname = (contact.lastname ?? "").trim();
  const out = { ...contact };
  if (lastname.length > MAX_LASTNAME_LEN) {
    out.lastname = lastname.slice(0, MAX_LASTNAME_LEN);
  }
  const email = (contact.email ?? "").trim();
  if (email && (email.length > 12 || !email.includes("@"))) {
    const local = email.split("@")[0]?.replace(/\W/g, "").slice(0, 2) || "u";
    out.email = `${local}@${SHORT_EMAIL_DOMAIN}`;
  }
  return out;
}

/** Ensure company has all 14 mandatory fields; fill missing with defaults. */
function ensureMandatoryCompanyFields(
  company: Record<string, string>,
  defaultCountry: "Germany" | "Switzerland" = "Switzerland",
): Record<string, string> {
  const defaults = getDefaultCompany(defaultCountry);
  const out = { ...defaults };
  for (const key of COMPANY_MANDATORY_FIELDS) {
    const v = company[key];
    if (v != null && String(v).trim() !== "") out[key] = String(v).trim();
  }
  // HubSpot phone must be +digits only
  if (out.phone) out.phone = normalizePhone(out.phone);
  return out;
}

function getApiKey(): string | undefined {
  const useSandbox =
    (process.env.HUBSPOT_ENV ?? "production").toLowerCase() === "sandbox";
  if (useSandbox && process.env.GEMINI_API_KEY_SANDBOX) {
    return process.env.GEMINI_API_KEY_SANDBOX;
  }
  return process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
}

/**
 * Generate random company and contact data with Gemini AI.
 * Country and address are constrained to Germany or Switzerland.
 * Returns fallback static DE/CH data if API key is missing or the request fails.
 */
export async function generatePhase1TestData(
  uniqueSuffix: string,
): Promise<Phase1FakeData> {
  const apiKey = getApiKey();
  if (!apiKey) {
    const fallback =
      FALLBACK_DATA[Math.floor(Math.random() * FALLBACK_DATA.length)];
    return {
      company: ensureMandatoryCompanyFields(
        { ...fallback.company },
        fallback.company.country === "Germany" ? "Germany" : "Switzerland",
      ),
      contact: {
        ...fallback.contact,
        email: fallback.contact.email.replace("@", `+${uniqueSuffix}@`),
        lastname: `${fallback.contact.lastname} ${uniqueSuffix}`,
      },
    };
  }

  try {
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: PROMPT,
      config: {
        temperature: 0.8,
        maxOutputTokens: 1024,
        responseMimeType: "application/json",
      },
    });

    let text = (response as { text?: string }).text;
    if (!text || typeof text !== "string") {
      // Fallback: some SDK versions put text in candidates[0].content.parts[0]
      const res = response as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      const part = res.candidates?.[0]?.content?.parts?.[0];
      text = part?.text;
    }
    if (!text || typeof text !== "string") {
      throw new Error("Empty or invalid Gemini response");
    }

    // Strip markdown code block if present (e.g. ```json ... ```)
    let jsonStr = text.trim();
    const debugText = process.env.DEBUG_GEMINI === "1" ? text : undefined;
    const codeBlockMatch = jsonStr.match(/^```(?:json)?\s*([\s\S]*?)```$/m);
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim();
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(jsonStr) as Record<string, unknown>;
    } catch (parseErr) {
      const e = new Error("Gemini response invalid JSON: " + (parseErr instanceof Error ? parseErr.message : String(parseErr))) as Error & { debugText?: string };
      e.debugText = debugText;
      throw e;
    }
    if (typeof parsed !== "object" || parsed === null) {
      throw new Error("Gemini response is not a JSON object");
    }

    // Accept company/contact with any casing (Gemini may return Company/Contact)
    const raw = {
      company: (parsed.company ?? parsed.Company) as Record<string, string> | undefined,
      contact: (parsed.contact ?? parsed.Contact) as Record<string, string> | undefined,
    };

    if (!raw.company || typeof raw.company !== "object") {
      const e = new Error("Gemini response missing company (keys: " + Object.keys(parsed).join(", ") + ")") as Error & { debugText?: string };
      e.debugText = debugText;
      throw e;
    }
    if (!raw.contact || typeof raw.contact !== "object") {
      const e = new Error("Gemini response missing contact (keys: " + Object.keys(parsed).join(", ") + ")") as Error & { debugText?: string };
      e.debugText = debugText;
      throw e;
    }

    // Enforce country constraint; HubSpot original_country must be CH/DE
    const countryName =
      raw.company.country === "Germany" || raw.company.country === "Switzerland"
        ? (raw.company.country as "Germany" | "Switzerland")
        : raw.company.country === "CH" || raw.company.country === "DE"
          ? (raw.company.country === "CH" ? "Switzerland" : "Germany")
          : "Switzerland";
    raw.company.country = countryName;
    raw.company.original_country = COUNTRY_CODE[countryName] ?? "CH";

    // Enforce industry enum
    const industry = HUBSPOT_INDUSTRY_OPTIONS.includes(
      raw.company.industry ?? "",
    )
      ? raw.company.industry!
      : "MARKETING_AND_ADVERTISING";
    raw.company.industry = industry;

    // Ensure all 14 mandatory company fields (fill missing from defaults)
    const company = ensureMandatoryCompanyFields(
      raw.company as Record<string, string>,
      countryName,
    );

    // Shorten lastname and email, then make contact unique for this run
    const short = shortenContact(raw.contact as Record<string, string>);
    const contact = {
      ...short,
      email: (short.email ?? "").replace("@", `+${uniqueSuffix}@`),
      lastname: `${short.lastname ?? "Contact"} ${uniqueSuffix}`,
    };

    return {
      company,
      contact: contact as Record<string, string>,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(
      "Gemini test data generation failed, using fallback:",
      msg,
    );
    if (process.env.DEBUG_GEMINI === "1" && err && typeof err === "object" && "debugText" in err && typeof (err as { debugText?: string }).debugText === "string") {
      console.warn("Gemini raw response (first 500 chars):", (err as { debugText: string }).debugText.slice(0, 500));
    }
    const fallback =
      FALLBACK_DATA[Math.floor(Math.random() * FALLBACK_DATA.length)];
    return {
      company: ensureMandatoryCompanyFields(
        { ...fallback.company },
        (fallback.company.country === "Germany" ? "Germany" : "Switzerland"),
      ),
      contact: {
        ...fallback.contact,
        email: fallback.contact.email.replace("@", `+${uniqueSuffix}@`),
        lastname: `${fallback.contact.lastname} ${uniqueSuffix}`,
      },
    };
  }
}

/** Call once to verify Gemini API key and response shape (e.g. in beforeAll). Logs result. */
export function logGeminiStatus(): void {
  const key = getApiKey();
  if (!key) {
    console.log("[Gemini] No API key (GEMINI_API_KEY/GOOGLE_API_KEY); using static fallback.");
    return;
  }
  console.log("[Gemini] API key set; will attempt to generate company/contact data. On failure, static DE/CH fallback is used.");
}
