---
title: 'Production | Delfin | Webhook Data Sync'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623395
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/YJt7qPcDvAqrjy0P](https://n8n.tools.energy/workflow/YJt7qPcDvAqrjy0P)
Workflow ID: YJt7qPcDvAqrjy0P
Workflow Name: Production | Delfin | Webhook Data Sync
Status: Active

# Purpose

The primary business goal of this workflow is to act as the main event intake webhook for Delfin integrations. It receives incoming event payloads, standardizes the query parameters, and routes the data to specific sub-workflows based on the object type (Order, Address, Booking) and the action performed (Create, Update, Delete). It acts as a central traffic director to ensure data updates sync effectively into HubSpot.

# Status and Runtime Controls

*   Timeout: Not explicitly defined (default execution timeout applies).
*   Retry behavior: No automated node-level retries configured.
*   Error workflow: Routed to error management workflow `Bu0X3AXE7asHOIpX`.
*   Execution settings: Configured to save fixed time data. Caller policy restricts sub-workflow execution to workflows from the same owner. Execution order is v1.

# Triggers & Entry Points

*   Webhook Trigger: Listens on `https://n8n.tools.energy/webhook/delfin` for incoming requests. It accepts all allowed origins (`*`) and evaluates queries sent from the Delfin platform.

# Systems & Integrations

*   Webhooks (n8n native webhook intake)
*   n8n Sub-workflows (Execute Workflow instances for modular logic)
*   Target systems: Identified contextually via tags and sub-workflow names as integrating deeply with HubSpot CRM.

# Data Inputs & Key Fields

Primary input fields extracted from the webhook query string:

*   `objecttype`: Determines the data entity (e.g., 'address', 'order', 'booking').
*   `changeaction`: Represents the state change ('C' for Create, 'U' for Update, 'D' for Delete).
*   `objectid`: The unique identifier for the targeted object, passed as `orderID` into downstream sub-workflows.

# Workflow Logic (Deep Analysis)

1. Initial trigger: The workflow begins when a webhook is received from Delfin at the `/webhook/delfin` endpoint.
2. Data retrieval: A Code node (`Return Query`) parses the incoming payload to isolate the query string.
3. Data validation & Conditional logic: The `Switch Object Type` node evaluates the `objecttype` field.
4. Branch execution: Based on the object type, the workflow routes to three potential paths (Address, Order, or Booking).
5. Sub-routing by Action: On the Order branch, the `Switch Order Action` node evaluates `changeaction` to determine if the event is a Create ('C'), Update ('U'), or Delete ('D').
6. External system calls: For Order Create and Update events, specific Execute Workflow nodes are triggered, passing the `orderID` downstream.
7. Data creation or update:
    *   For Order Create: Parallel paths fire to Import SRW, Update Delfin Order ID to Service, Import Old Orders, and after a 30s wait, update Spot Counts.
    *   For Order Update: Paths fire to Update Campaign Start/End Dates and Update Spot Counts.
8. Final updates: The `Execute Update Service Spot Count Workflow` sequentially triggers the `Execute Update Service Deal Line Items Workflow` to finalize the billing service status and deal line objects.

# Branch Execution Details

Switch Object Type

*   Condition: Evaluates `objecttype` string.
*   TRUE path (address): Routes to `Switch Address action`.
*   TRUE path (order): Routes to `Switch Order Action`.
*   TRUE path (booking): Routes to `Switch Booking action`.

Switch Order Action

*   Condition: Evaluates `changeaction` string.
*   TRUE path (C - Create): Routes execution to parallel NoOp routing nodes (`Route: Create` and `Order On Create`). This triggers the SRW import, old order import, Service pipeline stages update, and starts a 30-second delay before checking spot counts.
*   TRUE path (U - Update): Routes execution to parallel NoOp routing nodes (`Route: Update` and `Order On Update`). This triggers Campaign date updates and spot count updates.
*   TRUE path (D - Delete): Contains a defined condition but no connected downstream execution nodes.
*   FALSE path: Unmatched strings fall back to 'none'.

Switch Address Action & Switch Booking Action

*   Both nodes evaluate C/U/D change actions, but currently have no attached downstream execution logic.

# External Operations

*   API Calls / Internal Orchestration: The workflow manages modular workflow delegation rather than direct API calls. It spins up 6 distinct external sub-workflows that handle CRM API operations.
*   Object Updates: Deal objects, Line Items, and Campaign dates are managed downstream via the executed sub-workflows.

# Subworkflows Used

*   Workflow Name: Delfin | UC-08 | Sub-Workflow - Import SRW

Workflow ID: voqbwct4BC9IcV4t

Purpose: Process Service Ready Workspace data imports.

Inputs: `orderID`

*   Workflow Name: UC-01 | Sub-Workflow - Update Delfin Order ID & Pipeline Stage to Service

Workflow ID: QTqf9mt0SIeXPvnk

Purpose: Ensure the created Delfin ID and proper Service pipeline stages are synced.

Inputs: `orderID`

*   Workflow Name: Delfin | Manual Transfer Old Order from Delfin

Workflow ID: uHt11jIWP9lHb4za

Purpose: Handles manual legacy order transition.

Inputs: `orderID`

*   Workflow Name: 7003 | Delfin | Event Trigger Delfin for UC-02 | Update Campaign Start & End date from Delfin to HubSpot

Workflow ID: e4E4eBpDZZiBt8iz

Purpose: Sync updated campaign timestamps to target CRM.

Inputs: `orderID`

*   Workflow Name: Delfin | UAT-07 | Sub-Workflow - Update Spots Delivered / Service Ready For Billing

Workflow ID: a08cotVhjDvq8RKo

Purpose: Fetch and record delivered spots; update billing readiness status.

Inputs: `orderID`

*   Workflow Name: Delfin| TUC-06a | Sub-Workflow - Delfin to Service / Order Data

Workflow ID: iRJDhmLQoRz8EFTy

Purpose: Maintain Service/Deal Line Items.

Inputs: `orderID`

# Database Collections

*   No direct database nodes are utilized in this parent workflow. Data persistence is handled in the configured sub-workflows.

# Security Notes

*   Pinned Data contains hardcoded IP addresses (`151.186.187.81`) and an exposed Authorization Bearer token (`W63kj5zPdvf6...`). While this exists only in mock/pin data for testing, pinned credentials should be scrubbed in production branches to prevent unauthorized lateral access.

# Known Limitations / Risks

*   Unprocessed Branches: The Address and Booking switch nodes are fully configured to evaluate routing conditions but contain no connected actions, resulting in dropped events if triggered.
*   The Delete ('D') condition on the Order switch is unmapped. Deleted orders will fail to execute any cleanup logic.
*   Missing Error Handling: The `Execute Update Service Spot Count Workflow` and `Execute Update Service Deal Line Items Workflow` specify `onError: continueRegularOutput`. If these fail, the workflow succeeds silently, potentially leaving billing statuses out of sync.

# Final Outputs

Upon successful execution, the workflow will have dispatched the received `orderID` payload into a series of asynchronous sub-workflows responsible for syncing Hubspot deal line items, campaign timelines, and billing pipeline stages.