---
title: '2008 | GrowthOps | deal | Deal Created | Set LCS= SQL'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635415
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2638573760/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2638573760/edit)
*   **Workflow ID:** 2638573760
*   **Workflow Name:** 2008 | GrowthOps | deal | Deal Created | Set LCS= SQL

### Objective

This workflow is designed to automatically update the lifecycle stage of contacts to 'Sales Qualified Lead' (SQL) as soon as a deal is created and associated with them. This ensures that contacts are correctly categorized for sales and marketing reporting the moment they enter the sales pipeline.

### Trigger Criteria

*   **Object Type:** Deal
*   **Trigger:** The workflow enrolls a deal when it is first created (i.e., its 'Create Date' property is known).

### Actions

*   **Action 1: Set Contact Property**
    *   **Target:** Sets a property on the contact associated with the enrolled deal.
    *   **Property to Update:** Lifecycle Stage
    *   **New Value:** Sales Qualified Lead (SQL)

### Settings

*   **Re-enrollment:** Re-enrollment is turned ON for this workflow. This means a deal can re-trigger the workflow if its properties are updated to meet the trigger criteria again.