---
title: 'Trigger new quote created'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633795
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3229507775/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3229507775/edit)
*   **Workflow ID:** 3229507775
*   **Workflow Name:** Trigger new quote created

### Workflow Goal

This workflow is designed to trigger a webhook to an external system (n8n) when a HubSpot Quote is created or updated and meets very specific criteria.

### Trigger Conditions

This is an event-based workflow that enrolls a **Quote** when a specific event occurs and **all** of the following conditions are met:

*   **Trigger Event:** An event with ID `4-655002` (e.g., Quote created/updated) has been completed.
*   **Re-enrollment:** Disabled. A quote can only trigger this workflow one time.

**Enrollment Filters:**

*   The Quote's "Name" (`hs_name`) property is exactly equal to the text `hs_status`.
    *   _Note: This is an unusual condition and may be a misconfiguration. It literally checks if the name of the quote is the string "hs\_status"._
*   The Quote's "Value" (`hs_value`) property is set to `APPROVAL_NOT_NEEDED`.
    *   _Note: This property likely refers to the quote's approval status._

### Actions

If a quote meets the trigger conditions, the workflow immediately performs the following action:

**Action 1: Send Webhook to n8n**

*   **Action Type:** Send a POST request to an external webhook.
*   **Target URL:** `https://n8n.tools.energy/webhook/update-deal-queue`
*   **Purpose:** This action sends data to an n8n automation workflow. Based on the URL, its purpose is likely to update a queue of deals associated with new quotes that do not require an approval process.
*   **Authentication:** The request is authenticated using an `Authorization` key sent in the request header.