---
title: '2072 | GrowthOps | deal | Non-SRW | Payment type = Monthly  | send webhook to create invoice'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-620315
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3686452425/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3686452425/edit)
*   **Workflow ID:** 3686452425
*   **Workflow Name:** 2072 | GrowthOps | deal | Non-SRW | Payment type = Monthly | send webhook to create invoice

### Purpose

This workflow is designed to automate the creation of monthly invoices for specific deals. When triggered, it sends a notification to an external system (n8n) to generate an invoice for a deal that has a monthly payment agreement.

### Trigger (Enrollment Criteria)

*   **Object Type:** This is a Deal-based workflow.
*   **Trigger Type:** Manual Enrollment. This workflow does not start automatically. A HubSpot user must manually enroll a deal into the workflow each time an invoice is needed.
*   **Re-enrollment:** Re-enrollment is enabled. This is a key feature, as it allows the same deal to be enrolled every month to generate a recurring monthly invoice.

### Actions

This workflow consists of a single action:

*   **Action 1: Send a Webhook**
    *   **Method:** A `POST` request is sent from HubSpot.
    *   **Destination URL:** The request is sent to `https://n8n.tools.energy/webhook/create-monthly-invoice`.
    *   **Purpose:** This webhook triggers an external automation process responsible for creating the actual invoice in the designated billing system.
    *   **Authentication:** The request is authenticated using a secret API key sent in the `Authorization` header.
    *   **Data Context:** The webhook automatically includes data from the enrolled Deal and its associated Contacts, Companies, and Subscriptions, providing the external system with all necessary information to create an accurate invoice.

### Business Use Case

For non-standard deals ('Non-SRW') that require monthly invoicing, a team member will manually enroll the relevant deal into this workflow at the start of each billing cycle. The workflow then instantly triggers the external automation to generate and process the invoice, streamlining the monthly billing process.