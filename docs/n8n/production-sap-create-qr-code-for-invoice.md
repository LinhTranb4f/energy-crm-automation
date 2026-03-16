---
title: 'Production | SAP | Create QR code for invoice'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623275
---

# Summary

**Workflow URL:** [https://n8n.tools.energy/workflow/DQgCACCXxr8jzFzH](https://n8n.tools.energy/workflow/DQgCACCXxr8jzFzH)
**Workflow ID:** DQgCACCXxr8jzFzH
**Workflow Name:** Production | SAP | Create QR code for invoice
**Status:** Active

# Purpose

The business goal of this workflow is to automatically generate a Swiss QR bill code (QR-IBAN compliant) for SAP/HubSpot invoices. It validates invoice, company, and contact details from HubSpot, generates the QR code as an SVG, converts it to a PNG image via an external API, uploads the image to HubSpot Files, and updates the HubSpot Invoice record with the generated QR code link or specific error messages if validation fails.

# Status and Runtime Controls

*   **Timeout:** No explicit timeout defined.
*   **Retry behavior:** Several HubSpot HTTP Request nodes (Get invoice properties, Get company properties, Get contact properties, Get company by Legal Entity) have "Retry on Fail" enabled with a 5000ms wait between attempts.
*   **Error workflow:** Configured to trigger error workflow ID `Bu0X3AXE7asHOIpX` upon unhandled failures.
*   **Execution settings:** Execution order is set to `v1`, time saved mode is `fixed`, and the caller policy restricts to `workflowsFromSameOwner`.

# Triggers & Entry Points

*   **Webhook Node (Callback get invoice data):** This is the single entry point. It listens for a `POST` request at the endpoint `callback-get-invoice-data-to-create-qr`. It requires Header Authentication and expects a JSON payload containing an `invoiceID`.

# Systems & Integrations

*   **HubSpot CRM API:** Used to fetch invoice, company, and contact properties, search for legal entities, and patch invoice records.
*   **HubSpot Files API:** Used to host the generated PNG file.
*   **External API:** A custom internal endpoint (`https://api-energy.business4you.ch/convert`) is used to convert SVG data to PNG.
*   **Node.js Utilities:** The `swissqrbill/svg` library is used inside a Code node to generate the mathematical and graphical representation of the Swiss QR Code.

# Data Inputs & Key Fields

*   **Primary input fields:** `invoiceID` provided via the webhook trigger payload.
*   **Important properties used in the workflow:**
    *   _Invoice:_ `hs_number`, `amount`, `hs_amount_billed`, `hs_currency`, `legal_entity`, `invoice_amount`.
    *   _Company:_ `iban`, `company_number`, `customer_account_group`, `name`, `address`, `zip`, `city`, `original_country`.
    *   _Contact:_ `firstname`, `lastname`, `salutation`.

# Workflow Logic (Deep Analysis)

1. **Initial trigger:** The workflow is triggered by an external POST webhook containing the `invoiceID`.
2. **Data retrieval:** It makes an API call to HubSpot (`Get invoice properties`) to retrieve specific properties and associations using the provided invoice ID.
3. **Conditional logic:** It checks if the invoice contains a `legal_entity` value.
4. **Further Data retrieval:** If the legal entity exists, it fetches the associated company and contact properties, then performs a search across all HubSpot companies to find the matching creditor by legal entity.
5. **Branch execution (Search Check):** It checks if the creditor company search yielded any results (`total > 0`).
6. **Data validation & QR Code Creation:** A custom Code node executes comprehensive validation (checking currencies, IBAN format, required address fields). If a QR-IBAN is detected, it generates a 27-digit Mod10 QR Reference. It uses the `swissqrbill` library to create an SVG payload and returns a status of SUCCESS, ERROR, or EXCEPTION.
7. **Branch execution (Status Check):** The workflow evaluates the returned `validationStatus`.
8. **External system calls:** If successful, it sends the SVG Base64 data to an external API to convert it to a PNG file, then uploads this file to HubSpot's file manager.
9. **Final updates:** It updates the HubSpot invoice. On success, it patches the invoice with the file URL, IBAN, and marks generation as true. On failure, it patches the invoice to mark generation as false and includes the exact error reason.
10. **Webhook Response:** If successful, a final success JSON payload is returned to the original webhook caller.

# Branch Execution Details

*   **If Node (Legal Entity Check):**
    *   **Condition logic:** `properties.legal_entity` is not empty.
    *   **TRUE path:** Moves forward to fetch associated company properties.
    *   **FALSE path:** The workflow silently terminates. No actions are taken.
*   **If1 Node (Company Search Check):**
    *   **Condition logic:** Company search result `total > 0`.
    *   **TRUE path:** Moves forward to generate the QR Code.
    *   **FALSE path:** The workflow silently terminates. No actions are taken.
*   **If2 Node (Validation Status Check):**
    *   **Condition logic:** `validationStatus` equals `SUCCESS`.
    *   **TRUE path:** Executes `PNG Converter`, `Update image to Files1`, `Update to invoice`, and `Respond to Webhook`.
    *   **FALSE path:** Executes `Update to invoice1` to write the error message directly to the invoice record.

# External Operations

*   **Database usage:** None detected.
*   **API calls:**
    *   Multiple standard HTTP requests to HubSpot CRM objects (Invoices, Companies, Contacts).
    *   An HTTP POST call to an external converter API to convert image formats.
*   **Object creation:** Uploads and creates a new File object in HubSpot via the HubSpot Files API.
*   **Object updates:** Patches the origin HubSpot Invoice record to attach the newly created QR Code image URL or to log validation failure messages.

# Subworkflows Used

*   **Workflow name:** Global Error Handler (Implied)
*   **Workflow ID:** `Bu0X3AXE7asHOIpX`
*   **Purpose:** Set globally as the fallback Error Workflow to capture any uncaught system or API errors.
*   **Inputs:** Standard n8n error payload.

# Database Collections

*   No database collections are used. All state and reference data are queried directly from the HubSpot CRM system.

# Security Notes

*   **Credentials:** Secure credential objects (`N8N Company scope`, `N8N Invoice Scope`, `N8N Contact scope`, `Header Auth to connect private app`) are utilized rather than hardcoded tokens.
*   **Sensitive operations:** Generation of banking records (IBANs, payment references) and direct updates to financial invoice objects in the CRM.
*   **Hardcoded values:** A HubSpot folder ID (`369874021618`) is hardcoded in the file upload node.

# Known Limitations / Risks

*   **Unprocessed branches:** If the initial invoice lacks a `legal_entity` or if the company search returns 0 results, the workflow stops completely. It does not respond to the webhook or update the invoice with a failure state, potentially causing timeouts or lack of feedback on the requesting side.
*   **Missing error handling:** While HubSpot nodes have a retry setup, if the `PNG Converter` API goes offline, the workflow will fail to an unhandled exception state relying solely on the global error workflow.
*   **Data Integrity Risk:** Missing required address fields in HubSpot will trigger custom validation logic rejecting the QR code, requiring CRM users to ensure data cleanliness.

# Final Outputs

When successful, the workflow produces a publicly indexable PNG file containing a Swiss QR Code hosted in HubSpot. It updates the parent invoice with `qr_code_generated = true`, attaches the `qr_code` URL, and outputs a JSON success response back to the webhook caller containing the parsed IBAN and generated references.