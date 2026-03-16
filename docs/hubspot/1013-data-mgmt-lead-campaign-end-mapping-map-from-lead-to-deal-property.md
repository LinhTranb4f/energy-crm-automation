---
title: '1013 | Data-Mgmt | lead | Campaign End mapping | Map from Lead to Deal Property'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633235
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2690818247/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2690818247/edit)
*   **Workflow ID:** 2690818247
*   **Workflow Name:** 1013 | Data-Mgmt | lead | Campaign End mapping | Map from Lead to Deal Property

### Workflow Goal

This workflow automates the process of copying the 'Campaign end' date from a Lead record to its associated Deal record. The primary purpose is to ensure data consistency and that sales teams have the correct campaign context on the deal itself.

### Enrollment Triggers

A Lead will be enrolled in this workflow when the following conditions are met:

*   The Lead's 'Campaign end' property has a known value.
*   AND the Lead is associated with a Deal that has a known 'Deal name'.

### Workflow Actions

Once a Lead is enrolled, the workflow performs a single action:

*   **Action:** Copy property value.
*   **Source:** The value from the enrolled Lead's 'Campaign end' property.
*   **Target:** The 'Campaign end' property on the associated Deal record.

### Re-enrollment

*   Re-enrollment is turned **OFF**. A lead will only be processed by this workflow once, preventing accidental overwrites if the lead's property changes later.