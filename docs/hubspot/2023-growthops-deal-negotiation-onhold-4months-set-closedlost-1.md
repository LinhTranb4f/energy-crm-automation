---
title: '2023 | GrowthOps | deal | Negotiation OnHold >4Months | Set ClosedLost'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635535
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2685919432/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2685919432/edit)
*   **Workflow ID:** 2685919432
*   **Workflow Name:** 2023 | GrowthOps | deal | Negotiation OnHold >4Months | Set ClosedLost

### **Purpose**

This workflow is designed to maintain a clean and accurate sales pipeline. It automatically identifies and closes deals that have become stagnant in the 'Negotiation/On-Hold' stage for an extended period (over 4 months), preventing them from skewing sales forecasts and metrics.

### **Enrollment Triggers**

A Deal will be enrolled in this workflow when **ALL** of the following conditions are met:

*   The Deal's stage is 'Negotiation OnHold' (Deal Stage ID: 2652804331).
*   The date the Deal entered its current stage was more than 120 days ago.

_Note: Re-enrollment is turned off. A deal can only go through this workflow once._

### **Workflow Actions**

Once a deal is enrolled, the workflow performs the following single action:

*   **Set Property Value:** The deal's 'Deal Stage' property is immediately updated to 'Closed Lost'.