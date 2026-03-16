---
title: 'Delfin | UC-09 | Update Spot file'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-623675
---

# Summary

Workflow URL: [https://n8n.tools.energy/workflow/nMHCVUNpDuTdvSTo](https://n8n.tools.energy/workflow/nMHCVUNpDuTdvSTo)
Workflow ID: nMHCVUNpDuTdvSTo
Workflow Name: Delfin | UC-09 | Update Spot file
Status: Active

# Purpose

The business goal of this workflow is to automate the synchronization of audio files (Spot files) from HubSpot to the Delfin system. It streamlines media management by ensuring the latest creative assets are available for broadcasting, and maintains data consistency by linking HubSpot Spot IDs with their corresponding digital assets in Delfin.

# Status and Runtime Controls

*   Timeout: Not explicitly defined in settings.
*   Retry behavior: Automatic retries on failure are enabled (`retryOnFail: true`) for all HTTP Request nodes and external API calls (HubSpot and Delfin API requests).
*   Error workflow: Dedicated error handling is routed to workflow ID `wT0xsVj2O6kGhRfD`.
*   Execution settings: Runs on execution order `v1` and utilizes a caller policy restricting execution to `workflowsFromSameOwner`.

# Triggers & Entry Points

*   Webhook Trigger (Webhook): Listens for a POST request on the path `update-spot-file`. It is configured to respond using a `responseNode`, meaning the workflow explicitly controls the final HTTP response sent back to the client (HubSpot). The expected payload includes a HubSpot object ID.

# Systems & Integrations

*   HubSpot CRM API: Used to fetch properties of the Spot object.
*   HubSpot Files API: Used to retrieve the hosting URL of the Spot file.
*   Delfin API: External integration for initializing, posting, committing, and canceling order transactions.
*   Subworkflows: Used for fetching global variables and server authorization credentials.
*   Webhooks: Acts as the primary entry point and responds synchronously.
*   Internal utilities: Code nodes for custom JavaScript mapping and logic, IF nodes for branching logic.

# Data Inputs & Key Fields

*   Primary input fields: `hs_object_id` (received from the incoming webhook payload).
*   Important properties used in the workflow:
    *   HubSpot Spot Object ID (retrieved from global variables)
    *   `name` and `file` properties from the HubSpot Spot object
    *   Associated `service_id` connected to the Spot object
    *   Auth headers and API URLs for Delfin (retrieved from subworkflows)
    *   Generated `transactionID` from Delfin API

# Workflow Logic (Deep Analysis)

1. Initial trigger: A webhook receives a POST request containing the `hs_object_id` from HubSpot.
2. Data retrieval: The workflow executes the `Call Global variables WF` to fetch environment-specific constants (like the Spot object ID schema). It then queries the HubSpot CRM API (`HS - Get Spot`) to fetch the Spot's name, file ID, and associated services.
3. Data validation: The workflow checks if the Spot actually contains a file via the `If3` node. If the file property is empty, it aborts the process.
4. External system calls & Payload structuring: Upon validation, the workflow retrieves the default hosting URL for the file from the HubSpot Files API (`HS - Get Spot File`). Simultaneously, a code node extracts the associated `service_id`.
5. Authentication & Initializing: The workflow executes the `Call Server Authorize WF` to retrieve Delfin credentials, then initiates a transaction in Delfin (`Delfin - Init Order Transaction`) using the extracted `service_id`.
6. Conditional logic & Branch execution: Following the transaction initialization, the workflow validates the response code. If OK, it prepares a structured JSON payload combining the transaction ID, Spot ID, Spot Name, file URL, and service ID.
7. Data creation or update: The structured JSON payload is posted to the Delfin API (`Delfin - Create Spot`) to link the asset.
8. Merge operations & Final updates: The workflow validates the asset creation response. If successful, it commits the order transaction in Delfin (`Delfin - Confirm Order Transaction`).
9. The workflow validates the final commit. A success response is sent back to the webhook. If any of the Delfin steps fail, the transaction is canceled (`Cancel Transaction`) and a failure response is issued.

# Branch Execution Details

*   If3 (Check if File exists):
    *   Condition logic: Checks if `$json.properties.file` is not empty.
    *   TRUE path: Proceeds to fetch the actual file URL from HubSpot (`HS - Get Spot File`).
    *   FALSE path: Terminates and sends a webhook response (`Failure Response1`) stating "The Spot does not have file".
*   If (Check Init Transaction):
    *   Condition logic: Checks if `responseCode` equals "OK".
    *   TRUE path: Prepares the update JSON and sends it to `Delfin - Create Spot`.
    *   FALSE path: Routes to `Cancel Transaction`.
*   If1 (Check Create Spot):
    *   Condition logic: Checks if `responseCode` equals "OK".
    *   TRUE path: Proceeds to `Delfin - Confirm Order Transaction`.
    *   FALSE path: Routes to `Cancel Transaction`.
*   If2 (Check Confirm Transaction):
    *   Condition logic: Checks if `responseCode` equals "OK".
    *   TRUE path: Ends the process cleanly via `Success Response`.
    *   FALSE path: Routes to `Cancel Transaction`.

# External Operations

*   Database usage: No direct database nodes are used, relying instead on HubSpot and Delfin as external systems of record.
*   API calls:
    *   GET to HubSpot CRM API to read Spot properties and associations.
    *   GET to HubSpot Files API to retrieve hosting URLs.
    *   POST to Delfin API to initialize order transactions.
    *   POST to Delfin API to post the Spot payload.
    *   POST to Delfin API to commit order transactions.
    *   POST to Delfin API to cancel order transactions.
*   Object updates: The specific Spot is updated in Delfin using a transactional model (Init -> Post -> Commit).

# Subworkflows Used

*   Workflow name: Global variables
    *   Workflow ID: YTKoYUXPDy5OGV16
    *   Purpose: Fetches environment variables such as the `spot_object_id` identifier.
    *   Inputs: Empty payload (mapping mode defined below).
*   Workflow name: Delfin | Server Authorize
    *   Workflow ID: BIgOTMaifk7QSG1B
    *   Purpose: Acquires dynamic authentication headers and API endpoint URLs for Delfin.
    *   Inputs: Empty payload (mapping mode defined below).

# Database Collections

No specific database collections (like MongoDB or SQL) are interacted with directly within this workflow scope.

# Security Notes

*   Hardcoded tokens: HubSpot API queries utilize a defined credential block (`Production | HubSpot | Header Auth to connect private app`, ID: `SmSUyv0Pf8gThTzV`).
*   Sensitive operations: Delfin Authorization headers are fetched dynamically at runtime via a subworkflow, preventing hardcoded secrets in the HTTP nodes.
*   Notice: The Delfin HTTP requests all contain the setting `allowUnauthorizedCerts: true`. This disables SSL/TLS certificate validation, which poses a security risk for Man-In-The-Middle (MITM) attacks and should be monitored or corrected in a strict production environment.

# Known Limitations / Risks

*   Missing error handling (Code Node): The `Return service id` code node accesses `results[0].id` directly from the HubSpot API response without checking if the `results` array exists or is populated. If a Spot has no associated services, this will throw a runtime TypeError.
*   Strict String Matching: The conditional nodes evaluating the Delfin API response rely on exact case-sensitive string matching (`responseCode == "OK"`). If the external system alters the casing (e.g., "Ok") or returns HTTP status integer codes, all branches will fail and trigger transaction cancellations.
*   Security configuration: Using `allowUnauthorizedCerts: true` is an inherent security risk for transmitting sensitive authorization headers to the Delfin system.

# Final Outputs

When successful, the workflow ensures the HubSpot Spot file is successfully updated and linked within the Delfin system through a secure transaction protocol. It then sends a synchronous HTTP "Success Response" back to the originating HubSpot webhook. In case of failure (missing files or API errors), it cancels any pending operations in Delfin and outputs a designated HTTP "Failure Response".