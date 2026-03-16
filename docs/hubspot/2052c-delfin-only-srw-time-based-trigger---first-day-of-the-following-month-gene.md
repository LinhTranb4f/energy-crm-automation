---
title: '2052c | Delfin | only SRW | Time based trigger - first day of the following month | Generate Invoice'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634695
---

### **Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3692844281/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3692844281/edit)
*   **Workflow ID:** 3692844281
*   **Workflow Name:** 2052c | Delfin | only SRW | Time based trigger - first day of the following month | Generate Invoice

### **Workflow Purpose**

This workflow automates the generation of monthly invoices. It identifies specific deals based on their pipeline, stage, and product details, and then triggers an external system to create the invoice on the first day of each month.

### **Trigger**

The workflow is time-based and runs automatically according to a set schedule.

*   **Schedule:** On the 1st day of every month.
*   **Time:** At 3:00 AM.

### **Enrollment Criteria**

A deal will be enrolled in this workflow if it meets ALL of the following conditions when the workflow runs:

*   **Billing Cycle:** The deal's billing cycle is set to "Monthly Actual Effort" (`monthly_actual_effort`).
*   **Pipeline:** The deal is in the pipeline with ID `3387257046` (Order-Pipeline).
*   **Deal Stage:** The deal is in the stage with ID `4636861650`.
*   **Product Group:** The deal's product group is "Radio Spots" (`radio_spots`).
*   **Order ID:** The deal has a known value in the "Delfin Order ID" (`delfin_order_id`) property.

### **Re-enrollment**

*   Re-enrollment is enabled. This is critical as it allows the same deal to be processed each month to generate a new recurring invoice, provided it still meets the enrollment criteria.

### **Workflow Actions**

When a deal is enrolled, the workflow performs a single action:

*   **Send Webhook:** It sends a POST request to an external automation platform (n8n).
    *   **URL:** `https://n8n.tools.energy/webhook/imported-deal/create-monthly-invoice`
    *   **Purpose:** This webhook call is the trigger for the external system to begin its process of generating the monthly invoice for the specific deal enrolled in the workflow.