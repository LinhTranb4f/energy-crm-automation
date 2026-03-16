---
title: '1030 | Data-Mgmt | deal | Line Item Product Group | Sync Product Group to Deal  '
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634135
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3549945053/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3549945053/edit)
*   **Workflow ID:** 3549945053
*   **Workflow Name:** 1030 | Data-Mgmt | deal | Line Item Product Group | Sync Product Group to Deal

### Objective

This workflow automates data management for Deals. Its primary purpose is to inspect all Line Items associated with a Deal, identify their respective "Product Group" values, and then aggregate these values into a single "Product Group" multi-select property on the Deal record itself. This ensures the Deal record accurately reflects a summary of all products it contains.

### Enrollment Triggers

*   **Object Type:** Deal
*   **Trigger Condition:** A Deal is enrolled in this workflow whenever the "Number of associated line items" property is updated. This typically happens when a line item is added to or removed from the deal.
*   **Re-enrollment:** Re-enrollment is enabled, meaning the workflow will run again for the same deal if its line items are changed in the future, ensuring the data remains synchronized.

### Workflow Process

The workflow follows a systematic, step-by-step process to sync the data:

1. **Initialization:** The workflow begins by clearing any existing value in the Deal's "Product Group" property. This ensures a fresh and accurate update every time the workflow runs.
2. **Sequential Product Group Checks:** The workflow then proceeds through a series of "If/Then" branches. Each branch checks for the presence of a specific product group among the deal's associated line items.
    *   **Logic:** For each check, the workflow asks: "Does at least one associated line item have the Product Group \[Product Group Name\]?"
    *   **Action:** If the answer is "Yes," the workflow appends that specific product group value to the Deal's "Product Group" property.
    *   **Continuation:** Regardless of the outcome, the workflow continues to the next check in the sequence. This ensures all relevant product groups from the line items are captured.
3. **Checked Product Groups:** The workflow systematically checks for and appends the following product groups if they exist on any associated line item:
    *   radio\_spots
    *   digital\_spots
    *   promotion
    *   media\_partnerships
    *   audio\_production
    *   radio\_sponsoing
    *   subsite
    *   display
    *   nrj\_live\_events
    *   social\_media
    *   podcast
    *   partnerschip\_options
    *   newsletter
    *   energy\_air
    *   energy\_star\_night
    *   energy\_live\_session
    *   energy\_winter\_magic
    *   vintage\_radio\_night
    *   event\_Partnerschip\_options
    *   energy\_events\_uebrige

### Outcome

After the workflow completes, the "Product Group" property on the Deal will contain a comprehensive list of all unique product groups represented by its associated line items. This provides a clear, at-a-glance summary for sales, reporting, and management purposes.