---
title: '2012 | GrowthOps | deal | Deal Stage: Create Offer | Set LCS= Opportunity'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635495
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2639208674/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2639208674/edit)
*   **Workflow ID:** 2639208674
*   **Workflow Name:** 2012 | GrowthOps | deal | Deal Stage: Create Offer | Set LCS= Opportunity

### Objective

This workflow automates the process of updating a contact's lifecycle stage to 'Opportunity' when their associated deal moves into the 'Create Offer' stage. This ensures that contact stages accurately reflect their progress in the sales funnel.

### Workflow Details

*   **Object Type:** Deal
*   **Status:** Active

### Enrollment Triggers

*   A deal enrolls in this workflow when its **Deal Stage** property is updated to **Create Offer**.

### Re-enrollment

*   Re-enrollment is enabled. A deal will re-enter this workflow every time its stage is changed to **Create Offer**.

### Actions

1. **Set Contact Property**
    *   The workflow updates a property on the contact associated with the enrolled deal.
    *   **Property to update:** Lifecycle Stage
    *   **New value:** Opportunity