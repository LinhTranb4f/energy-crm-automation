---
title: 'Production | SAP | 3.0 | Create end of campaign invoices base on legal entity'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623175
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/601oUY0SL7UNpuLr](https://n8n.tools.energy/workflow/601oUY0SL7UNpuLr)
Workflow ID: 601oUY0SL7UNpuLr
Workflow Name: Production | SAP | 3.0 | Create end of campaign invoices base on legal entity
Status: Active

# Purpose

The primary business goal of this workflow is to automate the generation of end-of-campaign invoices within HubSpot and prepare the data for SAP synchronization. It specifically handles multi-entity logic, seamlessly separating and routing invoice generation for differing legal entities (e.g., Legal Entity 1710 and 1711). By gathering deal, company, and line-item data, updating sequential accounting numbers via MongoDB, and applying appropriate tax rates, this workflow ensures fully compliant and accurate draft invoices are prepared as soon as an advertising campaign concludes and services are fulfilled.

# Status and Runtime Controls

*   Timeout: Default system timeout applies (not explicitly overridden in workflow settings).
*   Retry behavior: HTTP Request nodes interacting with the HubSpot API are configured with "retryOnFail: true" and "waitBetweenTries: 5000" (5 seconds), mitigating temporary API rate limits or network issues.
*   Error workflow: Dedicated error handling is routed to workflow ID `Bu0X3AXE7asHOIpX`.
*   Execution settings: Execution order is set to "v1", caller policy restricted to "workflowsFromSameOwner", and time saved mode is "fixed".

# Triggers & Entry Points

*   Webhook 1 (Get invoice data): A POST request endpoint (`create-end-of-campaign-invoice`) utilizing header authentication. This is the primary trigger from a HubSpot workflow when a deal meets the "Billing Run" criteria (End of Campaign payment type, campaign end date + 1, and no open service records).
*   Webhook 2 (Callback get invoice data): A POST request endpoint (`callback-create-end-of-campaign-invoice`) which serves as a callback receiver. Once the initial payload is queued through a Redis stream, this webhook consumes the queued data to initiate the heavy processing of the invoice.

# Systems & Integrations

*   HubSpot CRM API: Used extensively for fetching deals, companies, contacts, product schemas, line items, and creating/updating invoices and tax objects.
*   MongoDB: Utilized for maintaining sequential counters and lookup tables (Customer Numbers, Accounting Document Numbers, and Tax Codes).
*   External APIs: Internal utilities endpoint (`https://n8n.tools.energy/webhook/add-quote-discount-tax-to-invoice`) for applying discounts.
*   Subworkflows: Executes global variable retrieval, Redis stream queuing, and line-item generation.
*   Webhooks: Acts as the entry and continuation points of the workflow.

# Data Inputs & Key Fields

Primary input fields include:

*   `dealID`: The core identifier passed from HubSpot to fetch all related billing data.
*   `legal_entity`: Indicates which business unit (1710 or 1711) is responsible for the billing.
*   `tax_rate`: Pulled from deal properties to calculate and generate HubSpot tax objects.
*   `company_number`: Used to identify or generate a unique ID for the invoiced client.
*   `accounting_document_number`: Managed via MongoDB to assign sequential invoice IDs based on the specific legal entity.

# Workflow Logic (Deep Analysis)

1. Initial trigger: The workflow starts when HubSpot sends a POST request with the Deal ID to the main webhook.
2. Queue dispatch: A hardcoded token is injected, and the payload is sent to a Subworkflow (Redis Stream Producer) to decouple the heavy processing from the HubSpot trigger, ensuring reliability.
3. Data retrieval (Callback): The Redis consumer triggers the secondary webhook to resume processing. The workflow fetches global variables, then queries the HubSpot API to gather comprehensive Deal properties, associated Company properties (Invoice Recipient), Contact properties, and Line Item details.
4. Data validation & formatting: The workflow retrieves the HubSpot product schema and checks if the company has a valid `company_number`.
5. Conditional logic (Customer Number): If the company number is missing, the workflow queries MongoDB to get the last used customer number, increments it, saves it back to the database, and updates the HubSpot Company record.
6. Tax and Entity Split: The workflow cross-references the deal's tax rate with MongoDB's `tax_code` collection. Line items are then strictly split and grouped by their `legal_entity` property.
7. Branch execution: Parallel branches are executed for Legal Entity 1710 and Legal Entity 1711. Each branch checks if data exists for the entity.
8. External system calls & Data Creation: For valid entities, the workflow queries MongoDB for the next available `accounting_document_number`, increments it, and updates the database. If the tax rate is greater than 0, a one-time tax object is created in HubSpot.
9. Invoice Construction: Payload data is mapped, linking the deal, company, contact, and generated tax objects. After a 2-second wait to ensure HubSpot registers dependencies, the draft invoice object is created via the HubSpot API.
10. Final updates: A subworkflow generates the line items attached to the new invoice. A separate internal webhook copies any quote discounts, and a final HubSpot API call sets the invoice status to "open" and stage to "draft".

# Branch Execution Details

*   If1 (Company Number Check):
    *   Condition logic: Checks if the HubSpot Company's `company_number` is NOT empty.
    *   TRUE path: Skips number generation and proceeds directly to fetching the tax code from MongoDB.
    *   FALSE path: Queries MongoDB for the latest `customer_number`, increments it by 1, updates the MongoDB record, and fires a PATCH request to HubSpot to update the Company's `company_number`.
*   Check 1710 data / Check 1711 data:
    *   Condition logic: Validates if the split JSON grouping for the respective legal entity is NOT empty.
    *   TRUE path: Initiates the entity-specific accounting document number retrieval and invoice generation pipeline.
    *   FALSE path: Terminates execution for that specific legal entity branch.
*   If5 / If6 (Tax Check for 1710 / 1711):
    *   Condition logic: Checks if the calculated `tax_rate` is greater than 0.
    *   TRUE path: Fires a POST request to HubSpot to create a one-time tax object, then flows into the invoice data creation node.
    *   FALSE path: Bypasses the tax object creation and flows directly to invoice data creation.

# External Operations

*   Database usage: Interacts with MongoDB collections to find and update sequential counters (`findOneAndUpdate` and `findOneAndReplace`).
*   API calls: Executes heavily against HubSpot's CRM API (`/crm/v3/objects/...`) to GET deals/companies/contacts/line\_items and PATCH updates.
*   Object creation: Creates Taxes (`/crm/v3/objects/taxes`) and Invoices (`/crm/v3/objects/invoices`) dynamically within HubSpot.
*   Object updates: Updates Company properties and patches created Invoices to draft status.

# Subworkflows Used

*   Global Variable:
    *   Workflow ID: YTKoYUXPDy5OGV16
    *   Purpose: Fetches environment-level configuration (e.g., portal IDs, project object IDs).
    *   Inputs: None required; outputs global settings.
*   Subworkflow | Redis Stream Producer Workflow:
    *   Workflow ID: 1tiTZLzrMssZ4trX
    *   Purpose: Places incoming deal processing tasks into a queue to prevent payload loss and manage loads.
    *   Inputs: Disposition type, dealID payload, and the callback webhook URL.
*   SAP | 3.0 | Create invoices line item base on deal payment type (1710 / 1711):
    *   Workflow ID: 7WuHiChP2XeoGoY3
    *   Purpose: Populates the newly created HubSpot invoice with the accurately grouped line items.
    *   Inputs: invoiceID, paymentType, deal\_line\_items, projectID, legal\_entity, delfin\_order\_id, sales\_channel.

# Database Collections

*   `customer_number`: Maintains the global sequence for generating new customer IDs when a company lacks one.
*   `tax_code`: Used as a lookup table to translate HubSpot tax percentages into compliant SAP/accounting tax codes.
*   `accounting_document_number_1710`: Stores and tracks the sequential invoice numbering specifically for Legal Entity 1710.
*   `accounting_document_number_1711`: Stores and tracks the sequential invoice numbering specifically for Legal Entity 1711.

# Security Notes

*   Hardcoded tokens: A Bearer token is explicitly hardcoded in the node "Code in JavaScript1" (`dd3ca330-6f3e-4f0d-9a4e-1c8e5f3e6b7a`). This presents a security risk and should be migrated to n8n's credential management system.
*   Credentials: Valid credential profiles are heavily utilized for MongoDB (`MongoDB Energy`) and HubSpot (`Production | HubSpot | Header Auth`).
*   Sensitive operations: Direct financial data manipulation occurs via automated incremental IDs in the database.

# Known Limitations / Risks

*   Hardcoded values: The reliance on a hardcoded Bearer token reduces modularity and compromises security.
*   Incomplete logic for unhandled entities: The workflow splits specifically looking for `1710` and `1711`. Any line items tagged with an unexpected legal entity will be silently dropped without error handling.
*   Race conditions: The `findOneAndReplace` / `findOneAndUpdate` methodology used for sequential MongoDB numbering is generally safe, but extreme concurrent triggers might require validation to ensure duplicate invoice IDs are not generated.

# Final Outputs

Upon successful execution, the workflow generates fully formulated draft Invoices in HubSpot for the appropriate legal entities (1710 and/or 1711). These invoices are securely associated with the parent Deal, Company, Contact, generated Tax objects, and categorized Line Items. The invoice objects are updated to an "open" status at the "draft" stage, carrying internally assigned SAP-compatible accounting document numbers, fully prepped for downstream financial synchronization.