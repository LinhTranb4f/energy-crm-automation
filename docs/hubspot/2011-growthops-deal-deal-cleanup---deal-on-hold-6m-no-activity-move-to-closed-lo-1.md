---
title: '2011 | GrowthOps | deal | Deal Cleanup - Deal On Hold > 6M + No Activity | Move to Closed Lost'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635455
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2639202509/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2639202509/edit)
*   **Workflow ID:** 2639202509
*   **Workflow Name:** 2011 | GrowthOps | deal | Deal Cleanup - Deal On Hold > 6M + No Activity | Move to Closed Lost

### Workflow Goal

This workflow automates the process of cleaning up stagnant deals in the sales pipeline. It identifies deals that have been marked as "On Hold" for more than six months and have had no recent note activity, then automatically moves them to the "Closed Lost" stage.

### Enrollment Triggers

_This is a Deal-based workflow. A deal will be enrolled when it meets ALL of the following conditions:_

*   **Deal Stage:** The deal's stage is 'On Hold' (ID: 2652804331).
*   **No Recent Note Activity:** The 'Last Note Updated' date for the deal is more than 180 days ago.

### Re-enrollment

*   Re-enrollment is turned **ON**. This means if a deal is moved out of 'Closed Lost' and later meets the trigger criteria again, it will be re-enrolled in this workflow.

### Workflow Actions

_Once a deal is enrolled, the following action occurs immediately:_

*   **Action 1: Update Deal Stage**
    *   The deal's 'Deal Stage' property is set to 'Closed Lost'.