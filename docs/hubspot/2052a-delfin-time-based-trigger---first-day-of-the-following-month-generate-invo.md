---
title: '2052a | Delfin | Time based trigger - first day of the following month | Generate Invoice'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634655
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3656504538/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3656504538/edit)
*   **Workflow ID:** 3656504538
*   **Workflow Name:** 2052a | Delfin | Time based trigger - first day of the following month | Generate Invoice

### Objective

This workflow automates the process of generating monthly invoices for specific deals. It identifies eligible deals based on their billing cycle and stage, then triggers an external system (n8n) to create the invoice.

### Trigger and Enrollment

*   **Object Type:** This workflow enrolls **Deals**.
*   **Trigger Type:** The workflow is scheduled to run automatically on a specific date and time.
*   **Schedule:** It runs on the **1st day of every month** at **3:00 AM**.
*   **Re-enrollment:** Re-enrollment is enabled, meaning a deal can be processed by this workflow every month to generate recurring invoices.

### Enrollment Criteria

A Deal will be enrolled in this workflow if it meets **ALL** of the following conditions:

*   The Deal's "Billing Cycle" property is set to "monthly\_actual\_effort".
*   The Deal is in the Pipeline with ID `3387257046`.
*   The Deal is in the Deal Stage with ID `4636861650`.

### Workflow Actions

Once a deal is enrolled, the following action is executed:

*   **Action 1: Send a Webhook**
    *   A POST request is sent to an external automation tool (n8n).
    *   **Webhook URL:** `https://n8n.tools.energy/webhook/create-monthly-invoice`
    *   **Purpose:** This webhook triggers a process in n8n to generate a monthly invoice for the enrolled deal.
    *   **Authentication:** The request is authenticated using an Authorization Key sent in the header.

### Associated Data

To perform its action, the workflow has access to data from the enrolled Deal and its recently modified associated objects, including:

*   Associated Companies
*   Associated Contacts
*   Associated Custom Object (ID: 0-8)