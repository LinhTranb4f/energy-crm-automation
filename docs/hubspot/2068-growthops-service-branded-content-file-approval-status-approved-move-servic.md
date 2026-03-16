---
title: '2068 | GrowthOps | Service | Branded Content File Approval Status = Approved | Move Services Stage to "Realisation Closed"'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634575
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3613417673/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3613417673/edit)
*   **Workflow ID:** 3613417673
*   **Workflow Name:** 2068 | GrowthOps | Service | Branded Content File Approval Status = Approved | Move Services Stage to "Realisation Closed"

### Workflow Purpose

This workflow automates the progression of a Service record within its pipeline. Its primary function is to move the Service to the "Realisation Closed" stage automatically once the associated branded content file has been approved. This streamlines the service fulfillment process by eliminating the need for manual stage updates after an important approval milestone is met.

### Trigger Criteria (Enrollment)

This workflow enrolls records based on the following specific conditions:

*   **Object Type:** Service (Based on Object Type ID "0-162" and workflow name)
*   **Trigger Property:** The "Branded Content File Approval Status" property is set to "Approved".
*   **Re-enrollment:** Re-enrollment is turned off. A Service record can only be processed by this workflow once.

### Actions

Once a Service record is enrolled, the workflow performs the following single action:

*   **Action 1: Set Property Value**
    *   **Target Property:** Pipeline Stage (`hs_pipeline_stage`)
    *   **New Value:** The stage is updated to "Realisation Closed" (Stage ID: `3565446370`).