---
title: '2069 | GrowthOps | deal | payment type = end of campaign | send webhook to create invoice'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634635
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3647093957/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3647093957/edit)
*   **Workflow ID:** 3647093957
*   **Workflow Name:** 2069 | GrowthOps | deal | payment type = end of campaign | send webhook to create invoice

### Objective

This workflow automates the invoice creation process for deals that are billed at the end of a campaign. When a deal meets specific criteria indicating a campaign is complete and ready for billing, it triggers an external system (via a webhook) to generate the final invoice.

### Enrollment Criteria (When a Deal enters the workflow)

A Deal will be enrolled in this workflow if **ALL** of the following conditions are met:

*   **Pipeline:** The deal is in the pipeline with ID `3387257046`.
*   **Payment Type:** The 'Billing Cycle' property is set to 'End of campaign'.
*   **Campaign End Date:** The 'Campaign End' date property is a date that is more than 1 day from today.
*   **Services Completed:** The 'Service Records Open' property is equal to 0 (meaning there are no outstanding service items).
*   **Has Services:** The 'Number of Associated Services' is greater than 0 (meaning the deal has services that require invoicing).

### Re-enrollment

*   Re-enrollment is **enabled**.
*   A deal can re-enter this workflow if any of the following properties are updated: 'Pipeline', 'Service Records Open', or 'Billing Cycle'. This allows the workflow to re-evaluate the deal if its status changes.

### Workflow Actions (What the workflow does)

*   The workflow has a single action:
    *   **Send a Webhook:** It sends a POST request to an external automation tool (n8n) at the following URL: `https://n8n.tools.energy/webhook/create-end-of-campaign-invoice`. This action initiates the process of creating the final invoice in the billing system.

### Unenrollment

*   Deals will **not** be unenrolled if they no longer meet the trigger criteria after they have entered the workflow. They will proceed to complete the webhook action.