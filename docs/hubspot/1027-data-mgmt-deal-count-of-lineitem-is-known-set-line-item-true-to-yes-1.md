---
title: '1027 | Data-Mgmt | deal | Count of Lineitem is known | set line item true to yes'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636155
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3233325302/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3233325302/edit)
*   **Workflow ID:** 3233325302
*   **Workflow Name:** 1027 | Data-Mgmt | deal | Count of Lineitem is known | set line item true to yes

### Objective

This is a data management workflow for **Deals**. Its purpose is to automatically maintain a custom deal property named `line_item_true`. This property acts as a simple flag, indicating whether a deal has associated line items (`Yes`) or not (`No`). This helps ensure data accuracy for reporting and segmentation.

### Enrollment Triggers

A deal will be enrolled in this workflow if either of the following conditions is met:

*   The deal has **1 or more associated line items**, AND the `line_item_true` property is currently empty.
*   The deal has **0 associated line items**.

### Re-enrollment

*   Re-enrollment is **enabled** for this workflow.
*   A deal will re-enroll whenever the **Number of associated line items** property is updated, or when the `line_item_true` property is cleared.

### Workflow Actions

1. **If/Then Branch: Check for Line Items**
    *   The workflow checks if the deal's 'Number of associated line items' property is greater than or equal to 1.
2. **Path 1: If YES (Deal has 1 or more line items)**
    *   **Action:** The workflow sets the deal property `line_item_true` to **Yes**.
3. **Path 2: If NO (Deal has 0 line items)**
    *   **Action:** The workflow sets the deal property `line_item_true` to **No**.