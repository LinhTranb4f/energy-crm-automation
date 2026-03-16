---
title: 'Production | SAP | Automatic sync data from Energy Hubspot'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623955
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/RLw65bCvjaeQWWJc](https://n8n.tools.energy/workflow/RLw65bCvjaeQWWJc)
Workflow ID: RLw65bCvjaeQWWJc
Workflow Name: Production | SAP | Automatic sync data from Energy Hubspot
Status: Active

# Purpose

This workflow is designed to automate the synchronization of core business configuration data between HubSpot (HubDB) and a MongoDB instance (Energy), facilitating SAP integrations. It syncs tax codes, invoice dates, and multiple article databases (Digital Spots, Radio Sponsoring, Radio Spots, and Audio Production). Additionally, it synchronizes HubDB table column options back into HubSpot CRM product properties and contains a currently disabled set of operations for automating invoice creation from closed-won deals based on billing cycles.

# Status and Runtime Controls

*   Timeout: Not explicitly defined in the provided configuration.
*   Retry behavior: Enabled on several HTTP Request nodes fetching HubDB data (retries on fail with a 5000ms wait between tries).
*   Error workflow: Configured to route errors to workflow ID `wT0xsVj2O6kGhRfD`.
*   Execution settings: Execution order is set to `v1`, caller policy is restricted to `workflowsFromSameOwner`.

# Triggers & Entry Points

*   Manual Trigger: Executed manually by a user to reset accounting document numbers (1710 and 1711) and customer numbers in MongoDB.
*   Schedule Trigger 1 (Automate trigger to get tax code and invoice date): Runs periodically (every 4 hours) to synchronize HubDB tables into MongoDB.
*   Schedule Trigger 2 (Automate trigger to sync properties value from HubDB to product objects): Runs periodically (every 4 hours) to fetch HubDB table columns and update corresponding HubSpot product object properties.
*   Schedule Trigger 3 (Schedule trigger to check the billing cycle): Currently disabled. Intended to initiate the deal search and auto-invoicing process.

# Systems & Integrations

*   HubSpot CMS (HubDB) API: Used extensively for retrieving tabular reference data.
*   HubSpot CRM API: Used for searching deals, managing associations, creating/updating invoices, and updating product properties.
*   MongoDB: Target database (`MongoDB Energy`) for storing configurations, counters, and article data.
*   Internal Utilities: Standard n8n nodes including Code, Set, Filter, If, Split In Batches, Merge, Aggregate, and Wait.

# Data Inputs & Key Fields

*   HubDB Tax Codes: Fields include `code`, `vat_rate`.
*   HubDB Invoice Dates: Fields include `month`, `date`, `year`.
*   HubDB Article Databases: Fields include `name`, `description`, `plattform`, `rubric`, `unit_price`, `internal_orders`, `revenue_accounts`, `tax_rate`, etc.
*   Deal Properties (Disabled Logic): `campaign_start`, `campaign_end`, `dealstage`, `billing_cycle`.

# Workflow Logic (Deep Analysis)

1. Initial trigger

The workflow initiates via one of the active schedule triggers or a manual execution.

2. Data retrieval

For the DB Sync path, upon triggering, the workflow makes parallel HTTP requests to HubSpot HubDB to fetch Tax Codes, Invoice Dates, Digital Spots, Radio Sponsoring, Radio Spots, and Audio Production data. Pagination is handled dynamically for large HubDB datasets.

3. Data validation & Formatting

Data retrieved from HubDB is passed through Aggregate (Combine) nodes and subsequently processed in Code nodes. These code nodes map nested HubDB payload structures into flat JSON objects suitable for MongoDB, explicitly converting timestamps to readable YYYY-MM-DD formats and resolving nested relationships (like extracting label/name pairs for platform and rubric).

4. Conditional logic

The primary active conditional logic handles data mapping and property option deduplication inside Code nodes. A standalone `If` node exists in the invoicing path (disabled), checking if the current date aligns with established accounting periods.

5. Branch execution

The main scheduled sync branches into parallel execution paths driven by MongoDB deletions: deleting old collections triggers the fetch and insert of new collections across all tracked HubDB tables simultaneously.

6. External system calls

The workflow issues `DELETE` and `INSERT` commands to MongoDB to refresh collections. Concurrently, another branch uses `GET` requests to retrieve HubDB column definitions, identifies unique drop-down options, and issues `PATCH` requests to HubSpot CRM product properties to keep CRM picklists aligned with HubDB columns.

7. Data creation or update

Updated records are systematically inserted into MongoDB collections. For product properties, an updated JSON array of options is constructed and patched to HubSpot via the Properties API.

8. Merge operations

The Property Sync branch utilizes a Merge node configured with 4 inputs to combine the retrieved HubDB column definitions from the distinct article databases before deduplication.

9. Final updates

The final operations consist of successfully completing the MongoDB inserts and executing a `Wait` node in the batching loop to prevent HubSpot API rate limiting during property updates.

# Branch Execution Details

If Node: "If" (Currently Disabled)

*   Condition logic: Compares a filtered date string against the accounting period retrieved from MongoDB to verify if a deal is eligible for billing.
*   TRUE path: Proceeds to search for deals requiring monthly billing.
*   FALSE path: Halts execution for that specific item.

# External Operations

*   Database usage: Extensively utilizes MongoDB for complete state wipes (`DELETE` operations) followed by full syncs (`INSERT` operations) for various configuration tables.
*   API calls: Leverages HubSpot API endpoints (`/cms/v3/hubdb/tables/*/rows`, `/crm/v3/properties/*`, `/crm/v3/objects/0-3/search`, `/crm/v3/objects/invoices`). Handles pagination natively within HTTP nodes.
*   Object creation: In the disabled state, automates the generation of HubSpot Invoice objects (`POST /crm/v3/objects/invoices`) and associated line items.
*   Object updates: Updates Product Properties in HubSpot CRM with new standardized options from HubDB.

# Subworkflows Used

*   Workflow name: Unknown (Resolved via ID execution settings)
*   Workflow ID: `wT0xsVj2O6kGhRfD`
*   Purpose: Serves as the global error handler for this workflow. Will execute if any node fails.
*   Inputs: Inherits error execution context from the parent workflow.

# Database Collections

*   `customer_number`: Tracks sequential customer IDs.
*   `accounting_document_number_1710` & `1711`: Stores counters for SAP accounting document generation.
*   `tax_code`: Synchronized tax code mappings.
*   `send_invoice_date`: Permitted accounting periods and mailing dates.
*   `article_db_digital_spots`, `article_db_radio_sponsoring`, `article_db_radio_spots`, `article_db_audio_production`: Caches of specific article catalogs containing pricing, platform, and accounting data.

# Security Notes

*   Credentials: Uses managed n8n credentials (`MongoDB Energy`, `Production | HubSpot | Header Auth to connect HubDB private app`, `Production | HubSpot | Header Auth to connect private app`).
*   Hardcoded tokens: No hardcoded API keys or sensitive tokens were detected in the JSON.
*   Sensitive operations: Performing bulk collection deletions in MongoDB. Accidental triggering of the reset path could disrupt active SAP document number sequences.

# Known Limitations / Risks

*   Incomplete logic: Over 50% of the workflow nodes (pertaining to HubSpot automated deal search, calculation of billing cycles, payload construction, and invoice generation) are currently disabled.
*   Data Loss Risk: The workflow pattern relies heavily on `DELETE` followed by `INSERT`. If the HubSpot HubDB fetch fails _after_ the delete operation triggers (though they are modeled sequentially, race conditions can occur if unhandled), collections may remain empty.
*   Rate Limiting: Batch loops use a `Wait` node configured to wait for webhook callbacks, which might pause executions indefinitely if the webhook ID (`a38ce8e7-c14d-4d9b-b74b-cac05f166917`) does not receive a ping.

# Final Outputs

Upon successful execution, the workflow ensures that the `MongoDB Energy` instance has a perfectly synchronized replica of HubDB tax, invoice, and article catalogs. It also ensures that the HubSpot CRM Product Property definitions match the schema requirements designated by the external HubDB tables.