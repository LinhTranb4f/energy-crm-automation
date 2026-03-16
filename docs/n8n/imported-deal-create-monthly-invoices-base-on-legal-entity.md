---
title: 'Imported deal | Create monthly invoices base on legal entity'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623855
---

# Summary

**Workflow URL**: [https://n8n.tools.energy/workflow/YFfFahr1xf3XJgqS](https://n8n.tools.energy/workflow/YFfFahr1xf3XJgqS)
**Workflow ID**: YFfFahr1xf3XJgqS
**Workflow Name**: Imported deal | Create monthly invoices base on legal entity
**Status**: Active

# Purpose

This workflow automates the creation of monthly invoices within HubSpot for specific legal entities (e.g., entity 1711). It retrieves deal data initiated by a webhook, checks for external bookings (via Delfin API), calculates corresponding durations, prices, and discounts, manages sequential accounting and customer numbers using MongoDB, and generates the final drafted invoice with line items in HubSpot.

# Status and Runtime Controls

*   **Timeout**: 1800 seconds (30 minutes)
*   **Retry behavior**: HTTP Requests are configured to retry on failure with a 5000ms wait time between attempts.
*   **Error workflow**: Errors are routed to a centralized error handling workflow (`Bu0X3AXE7asHOIpX`).
*   **Execution settings**: Uses fixed time saved mode, and execution is permitted for workflows from the same owner.

# Triggers & Entry Points

*   **Webhook (****`imported-deal/create-monthly-invoice`****)**: The initial entry point that receives a payload from HubSpot containing a `dealID`. It forwards this data to a Redis stream queue to prevent HubSpot API timeouts.
*   **Callback Webhook (****`imported-deal/callback-create-monthly-invoice`****)**: Resumes the primary workflow execution once the queue processes the message, receiving the exact `dealID` to begin data processing.

# Systems & Integrations

*   **HubSpot CRM API**: Interacts with Deals, Companies, Contacts, Invoices, Line Items, Taxes, and Discounts.
*   **HubSpot CMS (HubDB)**: Retrieves internal order mappings and platform data.
*   **MongoDB**: Manages persistent, incrementing values for `customer_number` and `accounting_document_number_1711`, as well as fetching `tax_code` configurations.
*   **Delfin API**: Fetches external booking and order data.
*   **Subworkflows**: Calls specific sub-processes like Global Variables, Redis Stream Producer, and Server Authorization for Delfin.

# Data Inputs & Key Fields

*   **Primary Inputs**: `dealID` (from the webhook payload).
*   **Key Deal Properties**: `delfin_order_id`, `sales_channel`, `billing_cycle`, `tax_rate`, `deal_currency_code`, `dealname`, `billing_note`, and `nonaccounting_relevant`.
*   **Key Company Properties**: `company_number`, `iban`.
*   **Key Delfin Properties**: `buC_Verrechenbar` (Billable status), `buC_Sekunden` (Spot duration), `buC_ErlSchaltkosten` (Price), and various discount fields (e.g., `buC_ErlMengenrabatt`).

# Workflow Logic (Deep Analysis)

1. **Initial trigger**: The workflow is triggered by the Callback webhook containing the `dealID`.
2. **Data retrieval**: It executes the Global Variables subworkflow, then fetches the associated HubSpot Deal and Company properties.
3. **Data validation**: Validates whether the deal has a linked `delfin_order_id` and if the associated company has a `company_number` assigned.
4. **Conditional logic**: Verifies the presence of a primary contact and checks if specific bookings exist and are billable before proceeding to calculations.
5. **Branch execution**: Generates sequential IDs if missing, processes taxes if the rate is > 0, and filters bookings based on billability.
6. **External system calls**: Connects to the Delfin API to fetch booking data based on the start and end dates of the previous month.
7. **Data creation or update**: Calculates the aggregated line item totals based on Delfin bookings, matches them with HubSpot HubDB schemas, and creates the Invoice and Line Items in HubSpot.
8. **Merge operations**: Groups and aggregates the Delfin bookings by platform to consolidate radio spot durations and costs.
9. **Final updates**: Calculates total discounts across the aggregated bookings, creates the discount records in HubSpot, and finally updates the HubSpot Invoice stage to `draft` and status to `open`.

# Branch Execution Details

*   **Check delfin\_order\_id (If Node)**:
    *   **TRUE**: The deal has a Delfin order ID; the workflow retrieves the invoice recipient company ID and continues execution.
    *   **FALSE**: Executes a fallback JS node returning an empty array, effectively halting invoice generation.
*   **Check company\_number (If1 Node)**:
    *   **TRUE**: Company already has a number. Skips number generation and fetches the tax code.
    *   **FALSE**: Fetches the current sequence from MongoDB, increments it via JS, saves it back to MongoDB, and updates the HubSpot Company record.
*   **Check contact (Check contact Node)**:
    *   **TRUE**: Retrieves detailed contact properties (e.g., salutation, language) to associate with the invoice.
    *   **FALSE**: Skips contact retrieval and proceeds to fetch product schemas.
*   **Check tax\_rate > 0 (If6 Node)**:
    *   **TRUE**: Makes a POST request to HubSpot to generate a one-time tax item for the invoice.
    *   **FALSE**: Skips tax creation.
*   **Check bookings exist (If bookings exist Node)**:
    *   **TRUE**: Proceeds to filter the bookings to ensure only billable (`buC_Verrechenbar` != "False") items are processed.
    *   **FALSE**: Returns an empty array, skipping line item generation.
*   **Check discount is not empty (Check discount is not empty Node)**:
    *   **TRUE**: Iterates through discount data and creates associated discount records in HubSpot, then updates the invoice.
    *   **FALSE**: Skips discount creation and proceeds directly to update the invoice status.

# External Operations

*   **Database usage**: Uses MongoDB `findOneAndReplace` to manage sequential counters for `customer_number` and `accounting_document_number_1711`.
*   **API calls**: Utilizes HubSpot CRM v3 API heavily for data orchestration. Reaches out to Delfin API via authorized HTTP requests to fetch order and booking data (`GetBookingsByParameters`).
*   **Object creation**: Generates new HubSpot Invoices, batch creates Line Items, and generates Tax and Discount records attached to the invoice.
*   **Object updates**: Patches Company records with newly generated company numbers and updates Invoice status attributes.

# Subworkflows Used

*   **Global variables**
    *   **ID**: `YTKoYUXPDy5OGV16`
    *   **Purpose**: Fetches system-wide constants such as HubDB IDs, test record flags, and portal identifiers.
*   **Redis Stream Producer Workflow**
    *   **ID**: `1tiTZLzrMssZ4trX`
    *   **Purpose**: Offloads incoming webhook payloads to a queue to prevent request timeouts.
*   **Delfin | Server Authorize**
    *   **ID**: `BIgOTMaifk7QSG1B`
    *   **Purpose**: Generates and returns a Bearer authentication header required for calling Delfin API endpoints.

# Database Collections

*   **`customer_number`**: Stores the highest assigned customer number. Used to auto-increment and assign IDs to new companies.
*   **`accounting_document_number_1711`**: Stores the running invoice number sequence for the legal entity 1711.
*   **`tax_code`**: Acts as a lookup table to match numerical tax rates to their designated tax code labels.

# Security Notes

*   **Hardcoded Tokens**: A hardcoded Bearer token exists within a Code node (`Code in JavaScript1`). This poses a security and maintenance risk if the token expires.
*   **SSL Validation Disabled**: The HTTP requests to the Delfin API have `allowUnauthorizedCerts: true`, bypassing SSL certificate validation. This should be reviewed for production environments.
*   **Credentials**: Relies on securely managed n8n credentials for HubSpot Header Auth and MongoDB access.

# Known Limitations / Risks

*   **Race Conditions**: The workflow retrieves a sequence number from MongoDB, increments it via JavaScript, and writes it back using `findOneAndReplace`. Under high concurrency, this could result in duplicate ID assignments. Using MongoDB's native atomic `$inc` operator is highly recommended.
*   **Hardcoded Dates Check**: There is a sticky note warning developers not to forget to comment out "trick dates" (hardcoded testing dates) in the `Get last month start & end date` node. If accidentally left active, invoices will process for the wrong billing period.
*   **Unprocessed Branches**: Several `FALSE` paths result in execution flowing into code nodes that return empty arrays without actively failing or terminating the workflow, potentially resulting in empty or malformed invoices.

# Final Outputs

Upon successful execution, the workflow produces a fully populated `Draft` Invoice in HubSpot linked to the appropriate Company and Deal. The invoice contains precisely calculated line items synced from Delfin radio spot bookings, correctly associated tax rules, computed multi-level discounts, and sequential accounting reference numbers.