---
title: '2073 | GrowthOps | deal | Non-SRW: Import from Delfin | Payment type = Monthly  | send webhook to create invoice '
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634935
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3908308188/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3908308188/edit)
*   **Workflow ID:** 3908308188
*   **Workflow Name:** 2073 | GrowthOps | deal | Non-SRW: Import from Delfin | Payment type = Monthly | send webhook to create invoice

### Objective

This workflow automates the creation of monthly invoices. It identifies specific deals with a monthly payment type that were imported from an external system (Delfin) and triggers an external system (n8n) to generate the invoice via a webhook.

### Enrollment Criteria & Scheduling

This is a scheduled, Deal-based workflow. It automatically runs on the 1st of every month at 3:00 AM, enrolling any deals that meet **all** of the following conditions:

*   **Billing Cycle:** Is 'Monthly Actual Effort' (`monthly_actual_effort`).
*   **Pipeline:** Is in the pipeline with ID `3387257046`.
*   **Deal Stage:** Is in the deal stage with ID `4636861650`.
*   **Sales Channel:** Is 'Standard'.

**Note:** Deals are allowed to re-enroll in this workflow, ensuring invoices are generated each month they remain eligible.

### Workflow Actions

Once a deal is enrolled, the workflow performs a single action:

*   **Action 1: Send a Webhook to n8n**
    *   **Type:** A `POST` request is sent to an external automation tool.
    *   **URL:** `https://n8n.tools.energy/webhook/imported-deal/create-monthly-invoice`
    *   **Purpose:** This action triggers an external process to automatically create a monthly invoice for the enrolled deal. It includes secure authorization to ensure data is sent correctly.