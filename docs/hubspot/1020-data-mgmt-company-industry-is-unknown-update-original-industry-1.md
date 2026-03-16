---
title: '1020 | Data-Mgmt | company | Industry is unknown | Update Original Industry'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635775
---

### Summary

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3006731494/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3006731494/edit)
*   **Workflow ID**: 3006731494
*   **Workflow Name**: 1020 | Data-Mgmt | company | Industry is unknown | Update Original Industry

### Objective

This is a company-based workflow designed for data management. Its primary purpose is to capture and store the original industry of a company by copying the value from the standard 'Industry' property to a custom 'Original Company Industry' property. This action only occurs if the 'Original Company Industry' property is currently empty, effectively acting as a backup or initial value stamp.

### Enrollment Triggers

*   **Object Type**: Company
*   A company is enrolled in this workflow when its 'Original Company Industry' property is unknown (has no value).
*   **Re-enrollment**: Re-enrollment is turned off. A company can only go through this workflow once.

### Workflow Actions

*   **Step 1: Delay**
    *   The workflow begins by waiting for 10 minutes. This delay provides a buffer period, allowing other HubSpot processes or integrations to potentially populate the industry fields before this workflow takes action.
*   **Step 2: If/Then Branch**
    *   The workflow checks if the 'Original Company Industry' property has been populated with a value during the 10-minute delay.
    *   **Yes Branch**: If the 'Original Company Industry' property is now known (has a value), the company meets this condition and exits the workflow. No further action is taken.
    *   **No Branch**: If the 'Original Company Industry' property is still unknown, the company proceeds to the next step.
*   **Step 3: Copy Property Value**
    *   This is the final action for companies that still have an unknown 'Original Company Industry'.
    *   The workflow copies the value from the standard 'Industry' property to the 'Original Company Industry' property.
    *   **Important**: This action is configured to only fill the target property ('Original Company Industry') if it is empty. It will not overwrite any existing data.