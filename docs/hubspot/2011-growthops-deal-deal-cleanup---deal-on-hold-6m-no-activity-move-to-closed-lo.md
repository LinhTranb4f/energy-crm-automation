---
title: '2011 | GrowthOps | deal | Deal Cleanup - Deal On Hold > 6M + No Activity | Move to Closed Lost'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633135
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2639202509/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2639202509/edit)
*   **Workflow ID:** 2639202509
*   **Workflow Name:** 2011 | GrowthOps | deal | Deal Cleanup - Deal On Hold > 6M + No Activity | Move to Closed Lost

### Purpose

This workflow automates the sales pipeline cleanup process. It is designed to identify and automatically close deals that have been stagnant for an extended period, ensuring the pipeline remains accurate and reflects active opportunities.

### Trigger / Enrollment Criteria

This workflow enrolls **Deals** when they meet all of the following conditions:

*   The deal stage is 'Deal On Hold' (Internal ID: 2652804331).
*   The 'Last Note Updated' date is more than 180 days ago.
*   Re-enrollment is enabled, meaning a deal can be enrolled in this workflow multiple times if it meets the trigger criteria again in the future.

### Actions

Once a deal is enrolled, the workflow performs the following single action:

*   **Set Property Value:** Changes the deal's 'Deal Stage' to 'Closed Lost'.