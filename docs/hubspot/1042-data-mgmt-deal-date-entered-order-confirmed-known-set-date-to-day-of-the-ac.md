---
title: '1042 | Data-Mgmt | deal | Date entered "Order Confirmed" = known | Set date to day of the action'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634915
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3835947233/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3835947233/edit)
*   **Workflow ID:** 3835947233
*   **Workflow Name:** 1042 | Data-Mgmt | deal | Date entered "Order Confirmed" = known | Set date to day of the action

### Objective

This workflow is designed for data management. Its purpose is to capture the exact date and time a deal enters the 'Order Confirmed' pipeline stage and copy that timestamp to a dedicated reporting property. This ensures a stable, reportable date that is not affected if the deal moves to other stages later.

### Workflow Details

*   **Object Type:** Deal
*   **Status:** Active

### Enrollment Triggers

*   A deal will be enrolled in this workflow when the following condition is met:
    *   The property `Date entered 'Order Confirmed' stage` has a known value. This means the workflow triggers as soon as a deal is moved into that specific stage.

### Re-enrollment

*   Re-enrollment is turned **OFF**. A deal can only be processed by this workflow once in its lifecycle.

### Actions

1. **Set Property Value**
    *   **Action:** Immediately upon enrollment, the workflow sets a deal property.
    *   **Target Property:** `Order Confirmed Date (Reporting)` (internal name: `order_confirmed_date_reporting`)
    *   **Value:** The value is copied directly from the deal's `Date entered 'Order Confirmed' stage` property.