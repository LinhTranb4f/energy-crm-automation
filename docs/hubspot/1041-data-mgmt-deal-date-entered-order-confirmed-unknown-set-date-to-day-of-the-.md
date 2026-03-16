---
title: '1041 | Data-Mgmt | deal | Date entered "Order Confirmed" = unknown | Set date to day of the action'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634875
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3835942086/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3835942086/edit)
*   **Workflow ID:** 3835942086
*   **Workflow Name:** 1041 | Data-Mgmt | deal | Date entered "Order Confirmed" = unknown | Set date to day of the action

### Objective

This workflow is a data management tool designed to backfill a critical date property for reporting. It identifies deals that have reached the 'Order Confirmed' (or a similar) stage but are missing the system-generated date for when they entered that stage. It then sets a custom reporting date property to the current date to ensure data completeness.

### Enrollment Triggers

This workflow enrolls **Deals** when **ALL** of the following conditions are met:

*   The property **"Date entered 'Order Confirmed' stage"** (`hs_v2_date_entered_4636861649`) is unknown (has no value).
*   The **Deal Stage** is any of 'Order Confirmed' or a related stage (Internal IDs: `4636861651`, `4636861650`).
*   The deal's **Create Date** is within the current calendar year (between January 1st of this year and January 1st of next year).

### Re-enrollment

*   Re-enrollment is **turned ON**.
*   A deal can enter this workflow again if any of the trigger properties are updated to meet the enrollment criteria (e.g., if the deal stage is changed to one of the trigger stages).

### Actions

The workflow performs one immediate action:

*   **Action 1: Set Property Value**
    *   **Property to update:** "Order Confirmed Date (Reporting)" (`order_confirmed_date_reporting`).
    *   **New Value:** The property is set to the exact date and time the workflow action runs.