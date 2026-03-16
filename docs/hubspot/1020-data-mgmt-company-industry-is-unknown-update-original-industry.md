---
title: '1020 | Data-Mgmt | company | Industry is unknown | Update Original Industry'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633455
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3006731494/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3006731494/edit)
*   **Workflow ID:** 3006731494
*   **Workflow Name:** 1020 | Data-Mgmt | company | Industry is unknown | Update Original Industry

### Goal

This workflow is designed for data management. Its primary purpose is to capture and preserve the initial value of a company's standard 'Industry' property by copying it to a custom property named 'Original Company Industry'. This ensures the original industry classification is saved, even if the standard 'Industry' field is updated later.

### Object Type

*   This is a **Company-based** workflow.

### Enrollment Triggers

*   A company is enrolled in this workflow when its 'Original Company Industry' property is unknown (empty).
*   Re-enrollment is disabled. A company can only go through this workflow once.

### Workflow Actions

1. **Delay (10 Minutes):** The workflow begins with a 10-minute delay after a company is enrolled. This acts as a buffer, allowing other system processes or initial data entry to complete.
2. **If/Then Branch:** After the delay, the workflow checks if the 'Original Company Industry' property has a value.
    *   **YES Branch (Property is Known):** If the property was populated by another user or process during the 10-minute delay, the company exits the workflow. This prevents overwriting existing data.
    *   **NO Branch (Property is Unknown):** If the property is still empty, the company proceeds to the next action.
3. **Copy Property Value:** The workflow copies the value from the standard 'Industry' property to the 'Original Company Industry' property. This action is set to only fill the target property if it is empty.
4. **End:** The workflow concludes after the property value is copied.