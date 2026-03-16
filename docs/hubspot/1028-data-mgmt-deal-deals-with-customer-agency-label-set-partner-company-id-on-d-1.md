---
title: '1028 | Data-Mgmt | deal | Deals with Customer Agency Label | Set Partner Company ID on Deal and sync to Invoice'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636175
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3239599323/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3239599323/edit)
*   **Workflow ID:** 3239599323
*   **Workflow Name:** 1028 | Data-Mgmt | deal | Deals with Customer Agency Label | Set Partner Company ID on Deal and sync to Invoice

### Goal

This workflow automates data management for deals associated with partner agencies. It ensures the 'Partner Company ID' is correctly set on the deal by sourcing it from the associated partner company. It also cleans up data by setting the partner company's type to 'Agency' if this information is missing.

### Trigger and Enrollment

*   **Object Type:** Deal
*   **Trigger:** A deal is enrolled when it becomes a member of the HubSpot list with ID `476`.
*   **Re-enrollment:** Re-enrollment is enabled, meaning a deal can go through this workflow's logic more than once if it meets the trigger criteria again.

### Workflow Logic and Actions

**Step 1: Check if Associated Company is an Agency**

*   The workflow starts with an If/Then branch to check a property on an associated company.
*   **Condition:** It checks if the `Original Company Type` property of an associated company is equal to 'Agency'.

**Step 2A: If the Company is already an 'Agency' (YES Branch)**

*   If the condition is met, the workflow proceeds to the final action.
*   **Action:** It sets the `Partner Company ID` property on the enrolled Deal.
*   **Value:** The value is copied from the `Company Number` property of the associated partner company.
*   The workflow then ends for this deal.

**Step 2B: If the Company is NOT an 'Agency' (NO Branch)**

*   If the condition is not met (i.e., the company type is not 'Agency' or is blank), the workflow takes a data cleanup step first.
*   **Action 1:** It updates the associated partner company record by appending 'Agency' to its `Original Company Type` property.
*   **Action 2 (Go to):** After updating the company record, it proceeds to the same action from the YES branch. It sets the `Partner Company ID` property on the enrolled Deal, copying the value from the `Company Number` property of the now-updated partner company.
*   The workflow then ends for this deal.