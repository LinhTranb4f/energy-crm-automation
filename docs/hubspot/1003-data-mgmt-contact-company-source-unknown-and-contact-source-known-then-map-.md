---
title: '1003 | Data-Mgmt | contact | company source unknown and contact source known | then map source to company'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632715
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419644651/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419644651/edit)
*   **Workflow ID:** 2419644651
*   **Workflow Name:** 1003 | Data-Mgmt | contact | company source unknown and contact source known | then map source to company

### Objective

This workflow is designed for data management and enrichment. Its purpose is to automatically populate the 'Original source' property on a company record if it is empty, by using the known 'Original source' from an associated contact. This ensures that company records have accurate source information, improving reporting and attribution.

### Enrollment Triggers

This is a **Company-based** workflow. A company record will be enrolled if it meets **ALL** of the following conditions:

*   The company's **'Original source'** property is unknown (has no value).
*   **AND** the company has an associated contact whose **'Original source'** property is known (has a value).

### Workflow Actions

Once a company is enrolled, the workflow executes the following single action:

*   **Action 1: Copy Property Value**
    *   **Source:** The value from the associated contact's **'Original source'** property.
    *   **Target:** The enrolled company's **'Original source'** property.

### Settings

*   **Re-enrollment:** This is turned **OFF**. A company can only be processed by this workflow once.