---
title: '2052a | Delfin | Time based trigger - first day of the following month | Calculate delivered services for the previous month'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636375
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3385025723/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3385025723/edit)
*   **Workflow ID:** 3385025723
*   **Workflow Name:** 2052a | Delfin | Time based trigger - first day of the following month | Calculate delivered services for the previous month

### Purpose

This workflow is designed to automatically trigger a calculation of delivered services for the previous month. It identifies all active "Radio Spots" line items from the "Order-Pipeline" and sends a signal to an external system to perform the calculation.

### Trigger & Schedule

This is a time-based workflow that runs on a fixed schedule.

*   **Type:** Scheduled monthly
*   **Run Date:** On the 1st day of every month
*   **Run Time:** 3:00 AM
*   **Re-enrollment:** Re-enrollment is enabled, meaning that any line item that still meets the criteria will be re-enrolled each month when the workflow runs.

### Enrollment Criteria

The workflow enrolls **Line Items** that meet **ALL** of the following conditions at the time of the scheduled run:

*   **Line Item Properties:**
    *   Product Group is any of "radio\_spots".
    *   Line Item Stage is NOT "Realisation Closed".
    *   Delfin Order ID is known (the property is not empty).
*   **Associated Deal Properties:**
    *   The line item is associated with a Deal that is in the "Order-Pipeline".

### Actions

For each enrolled line item, the workflow performs a single action:

*   **Action 1: Send a Webhook**
    *   **Method:** POST
    *   **Webhook URL:** `https://n8n.tools.energy/webhook/update-hs-delivered-services`
    *   **Description:** This action sends a webhook to an external automation tool (n8n). This webhook serves as a trigger for the external system to begin its process of calculating the delivered services for the enrolled line item from the previous month.