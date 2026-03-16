---
title: '2040 | GrowthOps | deal | Clone Deal | Create association between order and sales pipeline deal'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634595
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3641484530/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3641484530/edit)
*   **Workflow ID:** 3641484530
*   **Workflow Name:** 2040 | GrowthOps | deal | Clone Deal | Create association between order and sales pipeline deal

### Objective

This workflow automatically creates an association between a newly created 'Order' deal and its original 'Sales Pipeline' deal. This is triggered immediately after an 'Order' deal is created by cloning a 'Sales' deal, ensuring a clear and connected record between the sales process and the order fulfillment process.

### Trigger (Enrollment Criteria)

This is a deal-based workflow. A deal is enrolled when all the following conditions are met:

*   The deal is in the 'Order' pipeline (Pipeline ID: 3387257046).
*   The deal property 'Object Source Label' is exactly 'CLONE\_OBJECTS'. This indicates the deal was created via a cloning process.
*   The deal property 'Object Source Detail 1' has any value (is known).
*   **Re-enrollment:** Re-enrollment is turned off. A deal can only run through this workflow once.

### Actions

**Action 1: Associate with Original Deal**

*   **Type:** Associate objects
*   **Details:** The workflow associates the enrolled deal (the new 'Order' deal) with another deal.
*   **How it finds the deal to associate:** It looks for a deal whose 'Record ID' matches the value stored in the 'Object Source Detail 2' property of the enrolled 'Order' deal. This property is expected to hold the record ID of the original sales deal that was cloned.