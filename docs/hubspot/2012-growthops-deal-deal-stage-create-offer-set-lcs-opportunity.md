---
title: '2012 | GrowthOps | deal | Deal Stage: Create Offer | Set LCS= Opportunity'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633175
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2639208674/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2639208674/edit)
*   **Workflow ID:** 2639208674
*   **Workflow Name:** 2012 | GrowthOps | deal | Deal Stage: Create Offer | Set LCS= Opportunity

### Objective

This workflow automates the process of updating the Lifecycle Stage of associated contacts to 'Opportunity' whenever a deal's stage is changed to 'Create Offer'. This ensures that contact data accurately reflects their position in the sales funnel.

### Workflow Type

*   Deal-based

### Trigger (Enrollment Criteria)

*   A deal is enrolled in this workflow when its **Deal Stage** property is set to **Create Offer** (ID: 2652804333).
*   **Re-enrollment:** This setting is enabled, meaning a deal can re-enter this workflow every time its stage is updated to 'Create Offer'.

### Actions

1. **Set Property Value on Associated Contact**
    *   **Action:** Updates a property value for the contact(s) associated with the enrolled deal.
    *   **Property to Update:** Lifecycle Stage (`lifecyclestage`)
    *   **New Value:** The property is set to **Opportunity**.