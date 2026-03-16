---
title: '1003 | Data-Mgmt | contact | company source unknown and contact source known | then map source to company'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635035
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419644651/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2419644651/edit)
*   **Workflow ID:** 2419644651
*   **Workflow Name:** 1003 | Data-Mgmt | contact | company source unknown and contact source known | then map source to company

### Purpose

This is a data management workflow designed to maintain data consistency between associated contacts and companies. It identifies companies that are missing 'Original Source' information and automatically populates this field by copying the value from an associated contact that has this information.

### Enrollment Triggers

This is a **Company-based** workflow.
A company will be enrolled when **all** of the following conditions are met:

*   The Company's 'Original Source' property is unknown.
*   **AND** The Company has an associated Contact whose 'Original Source' property is known.

### Workflow Actions

1. **Copy Property Value**
    *   The workflow copies the value from the associated Contact's **'Original Source'** property.
    *   It then pastes this value into the enrolled Company's **'Original Source'** property.

### Settings

*   **Re-enrollment:** Disabled. Companies will only go through this workflow once.