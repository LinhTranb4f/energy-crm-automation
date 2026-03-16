---
title: '2054 | GrowthOps | Operations Projects | payment type = end of campaign, Campaign End Date = Today | Create Invoice Records'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636435
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3542707403/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3542707403/edit)
*   **Workflow ID:** 3542707403
*   **Workflow Name:** 2054 | GrowthOps | Operations Projects | payment type = end of campaign, Campaign End Date = Today | Create Invoice Records

### Purpose

This workflow automates the process of initiating invoice creation for specific Operations Projects. It identifies projects that have concluded today and are scheduled for payment at the end of the campaign, then sends this information to an external system.

### Object Type

This workflow is based on the **Operations Projects** custom object (ID: 2-194493711).

### Enrollment Triggers

The workflow enrolls **Operations Project** records when they meet the following criteria simultaneously (AND logic):

*   The **Payment Type** property is exactly **End of Campaign**.
*   The **Campaign End** date property is **Today**.
    *   _Technical Detail: The check is for dates between today (inclusive) and tomorrow (exclusive) based on the Europe/Zurich timezone._

### Re-enrollment

Re-enrollment is turned **off**. A project record will only be processed by this workflow once.

### Workflow Actions

1. **Action: Send a POST Webhook**
    *   **Goal:** To send project data to an external system, likely an accounting or invoicing platform, to automatically create an invoice record.
    *   **Data Source:** The workflow is configured to fetch data from the project's most recently modified associated **Company** record, which can be included in the webhook payload.
    *   **Status:** **INCOMPLETE**. The webhook URL is not configured. This action is currently a placeholder and the workflow will fail to execute it until a valid URL is provided.