---
title: '2052a | Delfin | Time based trigger - first day of the following month | Calculate delivered services for the previous month'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634055
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3385025723/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3385025723/edit)
*   **Workflow ID:** 3385025723
*   **Workflow Name:** 2052a | Delfin | Time based trigger - first day of the following month | Calculate delivered services for the previous month

### Purpose

This workflow automatically triggers an external calculation process at the beginning of each month. Its purpose is to identify all ongoing "Radio Spots" orders from the previous month and initiate a process in an external system (n8n) to calculate the services delivered.

### Trigger & Enrollment

This is a scheduled workflow that enrolls records based on a fixed schedule and specific criteria.

#### Schedule

*   **Frequency:** Monthly
*   **Day:** On the 1st day of the month
*   **Time:** 3:00 AM

#### Enrollment Criteria

The workflow enrolls custom object records (ID: 0-162) that meet ALL of the following conditions at the time of execution:

*   The record is associated with a Deal/Order in the **"Order-Pipeline"** (ID: 3387257046).
*   The record's **"Product Group"** property is set to "radio\_spots".
*   The record's **"Pipeline Stage"** is NOT "Realisation Closed" (ID: 3565446370).
*   The record's **"Delfin Order ID"** property has a value (is known).

#### Re-enrollment

*   Re-enrollment is **enabled**, meaning a record can be processed by this workflow multiple times across different months as long as it continues to meet the criteria.

### Workflow Actions

When a record is enrolled, the workflow performs a single action.

#### Action 1: Send a Webhook

*   A `POST` request is sent to an external service to trigger a data processing job.
*   **Type:** Webhook
*   **Method:** POST
*   **Target URL:** `https://n8n.tools.energy/webhook/update-hs-delivered-services`