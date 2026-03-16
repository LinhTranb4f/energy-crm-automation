---
title: '1011 | Data-Mgmt | lead | Interested Media Solution mapping | Map from Lead to Deal Property'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635595
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2704255199/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2704255199/edit)
*   **Workflow ID:** 2704255199
*   **Workflow Name:** 1011 | Data-Mgmt | lead | Interested Media Solution mapping | Map from Lead to Deal Property

### Objective

This workflow automates data synchronization between Lead and Deal objects. Its primary purpose is to ensure data consistency by automatically copying the "Interested Media Solution" value from a Lead record to its associated Deal record.

### Trigger (Enrollment Criteria)

This workflow is based on the **Lead** object. A lead will be enrolled when all of the following conditions are met:

*   The Lead's "Interested Media Solution" property has a known value.
*   The Lead is associated with a Deal.
*   The associated Deal has a known "Deal Name".

### Re-enrollment

Re-enrollment is active for this workflow. A lead will re-enter the workflow and the actions will run again each time its "Interested Media Solution" property is updated.

### Workflow Actions

Upon enrollment, the workflow performs a single action:

*   **Copy Property:** It copies the value from the "Interested Media Solution" property on the enrolled Lead to the "Interested Media Solution" property on the associated Deal.

### Use Case

When a sales representative updates a lead's interest in a specific media solution, this workflow ensures that the information is immediately and automatically reflected on the associated sales deal. This eliminates the need for manual data entry, reduces the risk of error, and provides the sales team with consistent and up-to-date information across related records.