---
title: 'UAT-08 RC-SWR2 | Delfin | Create address from HS company'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623495
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/4ijbXJk8HtbTyiEq](https://n8n.tools.energy/workflow/4ijbXJk8HtbTyiEq)
Workflow ID: 4ijbXJk8HtbTyiEq
Workflow Name: UAT-08 RC-SWR2 | Delfin | Create address from HS company
Status: Active

# Purpose

Explain the business goal of the workflow.
The primary business goal of this workflow is to synchronize company address data from HubSpot into the Delfin system. It utilizes a transactional API approach (Init, Post, Commit) to ensure data integrity, automatically rolling back the transaction if any step fails. Finally, it records the synchronization status, error messages, and payload back into the HubSpot company record.

# Status and Runtime Controls

*   Timeout: 120 seconds
*   Retry behavior: Enabled for HubSpot and Delfin HTTP requests. HubSpot updates include a 5000ms wait between retries.
*   Error workflow: Executed via workflow ID `Bu0X3AXE7asHOIpX` upon critical failure.
*   Execution settings: Execution order is `v1`. Caller policy is set to `workflowsFromSameOwner`. Time saved mode is `fixed`.

# Triggers & Entry Points

*   Webhook Node: Acts as the entry point listening for a POST request at `/create-address-delfin`. It expects a JSON body containing a HubSpot Company ID (`hs_object_id`). Response mode is set to respond via a dedicated response node later in the execution.

# Systems & Integrations

*   HubSpot CRM API: Used to fetch company details and patch synchronization statuses.
*   Delfin API: External API used to process the address transaction securely.
*   Subworkflows: Used to retrieve global variables and generate server authorization tokens.
*   Webhooks: Used for the initial trigger and sending HTTP responses back to the caller.
*   Internal utilities: Code nodes are used for payload transformation and error message formatting.

# Data Inputs & Key Fields

*   Primary input fields: `hs_object_id` (received from the webhook payload).
*   Important properties used in the workflow:
    *   HubSpot properties: `name`, `phone`, `city`, `country`, `original_country`, `zip`, `address`, `website`, `e_mail`.
    *   Delfin properties: `addressID`, `transactionID`, `adrName1`, `adrTelefon`, `adrOrt`, `adrLand`, `adrPLZ`, `adrStrasse`, `adrHomepage`, `adrEMail`, `adrQuelle`.

# Workflow Logic (Deep Analysis)

1. Initial trigger: The workflow begins when the Webhook node receives a POST request with the `hs_object_id` payload.
2. Data retrieval: The workflow executes the 'Global variables' subworkflow, then calls the 'HS - Get Company' node to pull the target company's data from HubSpot using the provided ID.
3. External system calls (Authorization): It calls the 'Server Authorize WF' subworkflow to securely fetch the authorization header and API URL for the Delfin API.
4. External system calls (Init): The workflow calls the Delfin API to 'Init Address Transaction' using the HubSpot company ID as the `addressID`.
5. Conditional logic (Init validation): An IF node checks if the initialization response code is "OK". If successful, it proceeds; if failed, it prepares an error payload.
6. Data creation or update (Post): On success, the 'Delfin - Post Address' node sends the mapped HubSpot company properties to Delfin.
7. Conditional logic (Post validation): A second IF node verifies the post was successful ("OK").
8. Data creation or update (Commit): If the post is successful, 'Delfin - Confirm Address Transaction' is called to commit the transaction in Delfin.
9. Conditional logic (Commit validation): A final IF node ensures the commit was accepted.
10. Final updates (Success path): If all steps succeed, an 'Address payload' code node structures the final JSON. The 'HS - Update company payload and sync status' node sets `delfin_sync_status` to "success" in HubSpot. The workflow ends with a 'Success Response' webhook reply.
11. Final updates (Failure path): If any IF node fails, specific error payloads are generated. The 'Cancel Address Transaction' node is invoked to roll back Delfin. HubSpot is updated with `delfin_sync_status` set to "failed" along with the error message. A 'Failure Response' is then sent to the webhook.

# Branch Execution Details

*   If Init Address Success:
    *   Condition logic: Checks if `$json.responseCode` equals "OK".
    *   TRUE path: Proceeds to the 'Delfin - Post Address' node.
    *   FALSE path: Executes 'Address error payload #1', maps the error to 'HS - Update company error message #1', and does NOT attempt to cancel the transaction (as it never initialized). Returns Failure Response.
*   If Post Address Success:
    *   Condition logic: Checks if `$json.responseCode` equals "OK".
    *   TRUE path: Proceeds to the 'Delfin - Confirm Address Transaction' node.
    *   FALSE path: Executes 'Address error payload #2', proceeds to 'HS - Update company error message #1', and simultaneously triggers 'Cancel Address Transaction' to rollback Delfin. Returns a 'Failure Response'.
*   If Confirm Address Success:
    *   Condition logic: Checks if `$json.responseCode` equals "OK".
    *   TRUE path: Executes 'Address payload', updates HubSpot with success parameters, and returns a 'Success Response'.
    *   FALSE path: Executes 'Address error payload #3', triggers 'HS - Update company error message #1' and 'Cancel Address Transaction', finalizing with a 'Failure Response'.

# External Operations

*   API calls:
    *   GET to HubSpot (`/crm/v3/objects/0-2/{id}`) to fetch company details.
    *   POST to Delfin (`/api/Address/InitAddressTransaction`).
    *   POST to Delfin (`/api/Address/PostAddress`).
    *   POST to Delfin (`/api/Address/CommitAddressTransaction`).
    *   POST to Delfin (`/api/Address/CancelAddressTransaction`).
    *   PATCH to HubSpot (`/crm/v3/objects/companies/{id}`) to update synchronization state and payloads.

# Subworkflows Used

*   Global variables:
    *   Workflow ID: `YTKoYUXPDy5OGV16`
    *   Purpose: Retrieves global environment variables.
    *   Inputs: None mapped explicitly; waits for subworkflow completion.
*   Production | Delfin | Server Authorize:
    *   Workflow ID: `BIgOTMaifk7QSG1B`
    *   Purpose: Handles authentication and retrieves the `api_url` and `auth_header` for Delfin requests.
    *   Inputs: None mapped explicitly.

# Database Collections

No direct database collections (e.g., MongoDB) are utilized in this workflow. All data handling relies on external APIs (HubSpot and Delfin).

# Security Notes

*   Credentials: The workflow relies on `Production | HubSpot | Header Auth to connect private app` (Credential ID: `SmSUyv0Pf8gThTzV`) for secure HubSpot connections.
*   Dynamic Tokens: Authentication for Delfin is securely abstracted into a subworkflow (`BIgOTMaifk7QSG1B`), passing an ephemeral auth header to memory rather than hardcoding it.
*   Sensitive operations: Delfin API HTTP requests explicitly have the option `allowUnauthorizedCerts: true` enabled. This bypasses SSL certificate validation and presents a security risk.

# Known Limitations / Risks

*   SSL Certificate Risk: The `allowUnauthorizedCerts: true` parameter used on all Delfin HTTP requests is a security vulnerability that could expose the API calls to interception.
*   Synchronous Wait Times: HubSpot PATCH requests have a `waitBetweenTries` of 5000ms. If failures occur frequently, this will significantly delay the webhook response, potentially causing upstream client timeouts.

# Final Outputs

When successful, the workflow creates or updates an address record inside the Delfin system corresponding to a HubSpot Company. It updates the originating HubSpot Company record with the JSON payload sent and marks the `delfin_sync_status` property as "success". It also returns an HTTP 200/Success webhook response to the triggering application.