---
title: '2027 | GrowthOps | company | Budget JV Usage is at 100% | send notification to company owner'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633515
---

### Summary

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3047405793/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3047405793/edit)
*   **Workflow ID**: 3047405793
*   **Workflow Name**: 2027 | GrowthOps | company | Budget JV Usage is at 100% | send notification to company owner

### Workflow Purpose

This workflow automatically monitors the annual agreement (Jahresvereinbarung or JV) budget usage for companies. Its primary function is to alert the assigned Company Owner via an in-app notification when a company's budget usage reaches or exceeds 100%.

### Enrollment Triggers

A company is enrolled in this workflow when the following conditions are met:

*   **Object Type**: Company
*   **Trigger Property**: The company property `Budget JV Usage in Percent` (`budget_jv_usage_in_percent`) has a value that is greater than or equal to 1 (representing 100%).
*   **Re-enrollment**: Re-enrollment is turned OFF. A company will only trigger this notification once, even if its budget property is updated again later.

### Workflow Actions

Once a company is enrolled, the workflow executes a single action:

*   **Action Type**: Send in-app notification.
*   **Recipient**: The user assigned as the `HubSpot Owner` of the company.
*   **Notification Details**:
    *   **Subject**: "JV Budget von \[Company Name\] ist aufgebraucht!" (Translation: "JV Budget of \[Company Name\] is used up!")
    *   **Body**: The notification informs the owner that the annual agreement budget for the specific company has been consumed by \[Budget Usage %\] and advises them to review the situation and take appropriate action.