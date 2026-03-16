---
title: '1027 | Data-Mgmt | deal | Count of Lineitem is known | set line item true to yes'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633835
---

### Summary

*   Workflow URL: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3233325302/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3233325302/edit)
*   Workflow ID: 3233325302
*   Workflow Name: 1027 | Data-Mgmt | deal | Count of Lineitem is known | set line item true to yes

### Workflow Purpose

This is a data management workflow for Deal records. Its primary function is to automatically set a custom property named "Line Item True?" (internal name: `line_item_true`) to either 'Yes' or 'No'. This property serves as a simple flag to indicate whether a deal has at least one associated line item, making it useful for reporting, list segmentation, and triggering other automations.

### Enrollment Triggers

This is a Deal-based workflow. A deal will be enrolled if it meets either of the following criteria:

*   **Criteria 1:**
    *   The deal has 1 or more associated line items.
    *   AND the "Line Item True?" property is currently unknown (has no value).
*   **OR Criteria 2:**
    *   The deal has 0 associated line items.

Re-enrollment is enabled. A deal will re-enroll in the workflow whenever the "Number of associated line items" property is updated, or if the "Line Item True?" property is cleared.

### Workflow Actions

Once a deal is enrolled, it proceeds through the following steps:

1. **Check for Line Items:** The workflow first checks if the "Number of associated line items" on the deal is greater than or equal to 1.
2. **Branching Logic:**
    *   **If YES (the deal has 1 or more line items):** The workflow proceeds down the 'Yes' branch.
        *   It sets the deal property "Line Item True?" to "Yes" (true).
    *   **If NO (the deal has 0 line items):** The workflow proceeds down the 'No' branch.
        *   It sets the deal property "Line Item True?" to "No" (false).

After setting the property, the workflow is complete for that deal until it is triggered for re-enrollment.