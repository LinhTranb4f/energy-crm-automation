---
title: '1007 | Data-Mgmt | company | Active Company | Set status'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635235
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2596985045/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2596985045/edit)
*   **Workflow ID:** 2596985045
*   **Workflow Name:** 1007 | Data-Mgmt | company | Active Company | Set status

### Objective

This workflow is a data management tool designed to ensure data integrity for Company records. Its primary purpose is to automatically set a default status for any company where the "status" property has not been filled out, preventing records from having an unknown status.

### Trigger / Enrollment Criteria

*   **Object Type:** Company
*   **Trigger:** A company is enrolled in this workflow at the moment its "status" property is unknown (i.e., the property is empty).
*   **Re-enrollment:** Re-enrollment is enabled. This means if a company's "status" is ever cleared or deleted in the future, it will re-enter the workflow and have its status reset to "Aktiv".

### Workflow Actions

*   **Action 1: Set Company Status**
    *   The workflow performs a single action on enrolled companies.
    *   It sets the value of the company property "status" to "Aktiv".