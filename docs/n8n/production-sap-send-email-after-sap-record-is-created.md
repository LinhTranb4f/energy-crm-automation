---
title: 'Production | SAP | Send email after SAP record is created'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623995
---

# Summary

**Workflow URL:** [https://n8n.tools.energy/workflow/hd0hxFtdSGAEpTih](https://n8n.tools.energy/workflow/hd0hxFtdSGAEpTih)
**Workflow ID:** hd0hxFtdSGAEpTih
**Workflow Name:** Production | SAP | Send email after SAP record is created
**Status:** Active

# Purpose

This workflow automates the process of sending personalized invoice emails to customers once a record is generated (typically triggered via SAP). It retrieves invoice and contact data from HubSpot, merges it with a standardized marketing email template, downloads the actual invoice PDF via PandaDoc, logs the transaction into a Google Sheet, and dispatches the email via SMTP. A secondary internal flow pushes invoice IDs to an external Redis stream queue.

# Status and Runtime Controls

*   **Timeout:** Not explicitly defined in the settings.
*   **Retry behavior:** Enabled on the "Get invoice properties" and "Get contact properties" nodes. They will retry upon failure with a 5000ms wait time between attempts.
*   **Error workflow:** In case of execution failure, the workflow triggers a dedicated error workflow with ID `Bu0X3AXE7asHOIpX`.
*   **Execution settings:** The caller policy is restricted to `workflowsFromSameOwner`, and the execution order relies on `v1`.

# Triggers & Entry Points

*   **Webhook (send-email-to-customer):** The primary entry point. A POST webhook authenticated via Header Auth. Receives a JSON payload containing an `invoiceID`.
*   **Send email to customer queue:** A secondary POST webhook authenticated via Header Auth. It receives a payload to initiate the queue-processing flow.

# Systems & Integrations

*   HubSpot CRM API (Invoices, Contacts)
*   HubSpot Marketing API (Email Templates)
*   SMTP Service (Energy)
*   Google Sheets API
*   PandaDoc (via direct document URL)
*   Internal Webhooks (Redis stream queue)

# Data Inputs & Key Fields

*   **Primary Input Fields:** `invoiceID` (provided via webhook payload).
*   **Important Invoice Properties:** `accounting_document_number`, `invoice_standard_pandadoc_url`, `hs_number`, `hs_due_date`, `amount`, `customer_number`.
*   **Important Contact Properties:** `firstname`, `lastname`, `email`, `phone`.

# Workflow Logic (Deep Analysis)

**Flow 1: Main Invoice Email Processing**

1. **Initial trigger:** The workflow begins when the `Webhook` node (`send-email-to-customer`) receives a POST request containing the `invoiceID`.
2. **Data retrieval (Invoice):** The `Get invoice properties` node makes an authenticated GET request to the HubSpot CRM API to fetch the invoice properties and associated objects (contacts, line items, taxes).
3. **Data retrieval (Contact):** Using the contact association ID extracted from the previous step, the `Get contact properties` node fetches the associated contact's profile details.
4. **Data retrieval (Template):** The `Get email template` node fetches a specific email template (ID: 310187989235) from the HubSpot Marketing API.
5. **Merge operations (Create email template):** A Code node extracts the logo and widgets from the fetched email template, replaces personalization tokens (`contact.firstname`, `contact.lastname`, `invoice.hs_due_date`, `invoice.invoice_standard_pandadoc_url`), and constructs the final HTML payload.
6. **External system call (File Download):** The `Get attachments` node performs an HTTP GET request to download the raw PDF document from the `invoice_standard_pandadoc_url`.
7. **Data formatting:** The `Prepare data for google sheet` node maps the combined HubSpot data into a flat structure appropriate for spreadsheet logging.
8. **Data creation (Logging):** The `Append row in sheet` node writes the mapped data (including invoice numbers, contact names, and precise timestamp) to a designated Google Sheet.
9. **Final action:** The `Send email` node dispatches the email via an SMTP server to the contact's email address, using the dynamically generated HTML and attaching the downloaded invoice PDF.

**Flow 2: Redis Queue Processing**

1. **Initial trigger:** The `Send email to customer queue` webhook is hit with a payload.
2. **Data validation/generation:** A Code node (`Code in JavaScript`) defines a Bearer authorization token.
3. **External system calls:** The `Send data to queue1` node makes a POST request to an external Redis stream webhook (`https://test.n8n.tools.energy/webhook/energy-redis-stream`), passing the token and a structured JSON body containing the `invoiceID` and a callback URL.

# Branch Execution Details

There are no conditional IF nodes in this workflow. Both the main email flow and the Redis queue flow execute linearly based on which respective webhook is triggered.

# External Operations

*   **API calls:** Authenticated GET requests to HubSpot CRM for invoices and contacts, and the HubSpot Marketing API for templates.
*   **Database usage:** Appends a new row to Google Spreadsheet ID `1GRNjM5gDjf52yIM42T5gw_auAyPvGVfuEJNpLO5pzm0` to serve as a persistent transaction log.
*   **Object creation:** Dispatches an SMTP email containing physical attachment data.

# Subworkflows Used

*   **Workflow ID:** `Bu0X3AXE7asHOIpX`
*   **Workflow Name:** Unspecified (Global Error Handler)
*   **Purpose:** Acts as an error handler catching execution failures triggered by runtime exceptions.
*   **Inputs:** Inherits error execution data natively from n8n.

# Database Collections

*   **Google Sheets (Sheet1):** Acts as a flat-file database to track sent invoices. It captures the accounting document numbers, HubSpot invoice numbers, customer contact details, and precise dispatch timestamps.

# Security Notes

*   **Hardcoded credentials:** The node `Code in JavaScript` contains a hardcoded Bearer token (`Bearer dd3ca330-6f3e-4f0d-9a4e-1c8e5f3e6b7a`). This should be managed securely via n8n's Credential management system instead of plaintext code.
*   **Sensitive operations:** The workflow accesses financial documents (invoices) and PII (Personal Identifiable Information) from HubSpot.

# Known Limitations / Risks

*   **Missing error handling:** There is no conditional validation to ensure the HubSpot API successfully returns a valid Contact Association ID. If an invoice lacks a linked contact, the `Get contact properties` node will fail, breaking the entire run.
*   **Hardcoded environments:** Staging URLs (`test.n8n.tools.energy`) are hardcoded in the `Send data to queue1` node, which may present environment isolation issues if pushed to a strict production system.

# Final Outputs

*   A personalized email successfully delivered to the customer, complete with a dynamically generated HTML body and an attached PDF invoice.
*   An audit row created in Google Sheets verifying the email dispatch.
*   (Secondary flow) A JSON payload containing the disposition status successfully submitted to a Redis queue endpoint.