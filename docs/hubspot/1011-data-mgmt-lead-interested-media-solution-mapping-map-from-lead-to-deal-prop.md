---
title: '1011 | Data-Mgmt | lead | Interested Media Solution mapping | Map from Lead to Deal Property'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633275
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2704255199/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2704255199/edit)
*   **Workflow ID:** 2704255199
*   **Workflow Name:** 1011 | Data-Mgmt | lead | Interested Media Solution mapping | Map from Lead to Deal Property

### Workflow Goal

This workflow automates data synchronization between Leads and Deals. Its primary purpose is to copy the value of the "Interested Media Solution" property from a Lead record to the same property on its associated Deal record, ensuring data consistency.

### Object Type

This is a **Lead-based** workflow.

### Trigger and Enrollment Criteria

A Lead will be enrolled in this workflow when the following conditions are met:

*   The Lead's "Interested Media Solution" property has a known value (is not empty).
*   AND the Lead is associated with a Deal.
*   AND that associated Deal has a known "Deal Name" (is not empty).

### Re-enrollment

Re-enrollment is enabled. A Lead will re-enroll in this workflow every time its "Interested Media Solution" property is updated with a new value. This ensures that any changes to the Lead's preference are always reflected on the associated Deal.

### Actions

Once a Lead is enrolled, the workflow will perform the following single action:

*   **Copy Property Value:** The workflow copies the value from the Lead's "Interested Media Solution" property and pastes it into the "Interested Media Solution" property on the associated Deal.