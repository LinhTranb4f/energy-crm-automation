---
title: 'Trigger new quote created'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636115
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3229507775/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3229507775/edit)
*   **Workflow ID:** 3229507775
*   **Workflow Name:** Trigger new quote created

### Workflow Goal

This workflow is designed to send an automated notification to an external system ([n8n.tools.energy](http://n8n.tools.energy)) whenever a quote is updated to a specific status.

### Enrollment Triggers

This is a quote-based workflow that enrolls a quote when the following conditions are ALL met:

*   The workflow triggers after a quote-related event has been completed.
*   The Quote's 'Name' property is exactly equal to the text 'hs\_status'.
*   The Quote's 'Status' is 'Approval Not Needed'.

### Enrollment Rules

*   Quotes can only be enrolled in this workflow once; re-enrollment is turned off.

### Workflow Actions

Once a quote is enrolled, the workflow immediately performs a single action:

*   **Action Type:** Send a Webhook
*   **Details:** It sends a `POST` request to an external service.
*   **Webhook URL:** [https://n8n.tools.energy/webhook/update-deal-queue](https://n8n.tools.energy/webhook/update-deal-queue)
*   **Authentication:** The request is secured using an 'Authorization' key sent in the request header.
*   **Purpose:** This action sends data about the enrolled quote to an external automation platform (n8n) to trigger a subsequent process, such as updating a deal queue or another system.