---
title: '2070 | GrowthOps | deal |  only SRW | payment type = monthly | send webhook to create invoice'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634715
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3699565773/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3699565773/edit)
*   **Workflow ID:** 3699565773
*   **Workflow Name:** 2070 | GrowthOps | deal | only SRW | payment type = monthly | send webhook to create invoice

### Objective

This workflow automates the generation of monthly invoices. It identifies specific deals that require monthly billing based on their payment type, sales channel, pipeline stage, and product group. Its primary function is to send a signal to an external system to create the invoice.

### Trigger and Schedule

This workflow is not triggered by a specific event but runs on a recurring schedule.

*   **Schedule:** Runs on the 1st day of every month at 03:00 AM.
*   **Re-enrollment:** Re-enrollment is enabled. This is crucial as it allows the same deal to enter the workflow every month to generate a new recurring invoice.

### Enrollment Criteria

A deal will be enrolled in this workflow if it meets ALL of the following conditions at the time the workflow runs:

*   **Billing Cycle:** Is 'monthly\_actual\_effort'.
*   **Sales Channel:** Is 'SRW'.
*   **Pipeline:** Is in the pipeline with ID `3387257046`.
*   **Deal Stage:** Is in the deal stage with ID `4636861650`.
*   **Product Group:** Is 'radio\_spots'.
*   **Delfin Order ID:** The 'delfin\_order\_id' property has a value (is known).

### Workflow Actions

Once a deal is enrolled, the workflow performs a single, immediate action:

*   **Action:** Send a Webhook
*   **Details:** It sends a POST request to an external automation platform (n8n) to trigger the creation of a monthly invoice for the enrolled deal.
*   **Webhook URL:** `https://n8n.tools.energy/webhook/imported-deal/create-monthly-invoice`