---
title: '2023 | GrowthOps | deal | Negotiation OnHold >4Months | Set ClosedLost'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633215
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2685919432/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2685919432/edit)
*   **Workflow ID:** 2685919432
*   **Workflow Name:** 2023 | GrowthOps | deal | Negotiation OnHold >4Months | Set ClosedLost

### Purpose

This workflow is an automated housekeeping process designed to clean up the sales pipeline. Its primary goal is to automatically mark deals as 'Closed Lost' if they have been stalled in the negotiation/on-hold stage for more than four months. This prevents the pipeline from being cluttered with inactive or dead deals.

### Trigger / Enrollment Criteria

A deal will be enrolled in this workflow when it meets **ALL** of the following conditions:

*   **Deal Stage:** The deal's stage is 'Negotiation On Hold' (Internal ID: 2652804331).
*   **Time in Stage:** The deal has remained in this stage for more than 120 days (4 months).

### Actions

Once a deal is enrolled, the workflow performs the following single action:

*   **Set Deal Stage:** The deal's 'Deal Stage' property is immediately updated to 'Closed Lost'.

### Key Details

*   **Object Type:** Deal
*   **Status:** Inactive
*   **Re-enrollment:** Disabled. A deal that has been processed by this workflow will not be enrolled again.