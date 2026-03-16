---
title: '2072 | GrowthOps | deal | Standard Use Case | Payment type = Monthly | send webhook to create invoice'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634675
---

### Summary

*   Workflow URL: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3686452425/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3686452425/edit)
*   Workflow ID: 3686452425
*   Workflow Name: 2072 | GrowthOps | deal | Standard Use Case | Payment type = Monthly | send webhook to create invoice

### Workflow Objective

This deal-based workflow automates the creation of monthly invoices. It identifies specific deals with a monthly billing cycle and, on a set schedule, sends a webhook to an external system ([n8n.io](http://n8n.io)) to trigger the invoice generation process.

### Trigger and Enrollment Criteria

A deal will be enrolled in this workflow if it meets ALL of the following conditions:

*   **Billing Cycle:** The deal's billing cycle is set to "Monthly Actual Effort" (`monthly_actual_effort`).
*   **Pipeline:** The deal is in the pipeline with ID `3387257046`.
*   **Deal Stage:** The deal is in the stage with ID `4636861650`.
*   **Sales Channel:** The deal's sales channel is NOT "SRW" or "Standard".
*   **Associated Services:** The deal has at least 1 associated service.

### Enrollment Schedule

Enrolled deals will be processed according to the following schedule:

*   **Frequency:** Monthly
*   **Day of Month:** On the 1st of every month.
*   **Time:** At 3:00 AM (portal time).

### Re-enrollment

Re-enrollment is enabled for this workflow. This allows a deal to be processed each month to generate recurring invoices as long as it continues to meet the enrollment criteria.

### Workflow Actions

Once a deal is processed on its scheduled date, the workflow performs the following single action:

*   **Action Type:** Send a webhook.
*   **Method:** POST
*   **Webhook URL:** `https://n8n.tools.energy/webhook/create-monthly-invoice`
*   **Authentication:** The request includes an "Authorization" key in the header for secure communication with the receiving system.
*   **Purpose:** This webhook call signals the n8n automation platform to create a monthly invoice for the enrolled HubSpot deal.