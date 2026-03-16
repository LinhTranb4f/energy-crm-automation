---
title: '1012 | Data-Mgmt | lead | Campaign Start mapping | Map from Lead to Deal Property'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633255
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2691084506/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2691084506/edit)
*   **Workflow ID:** 2691084506
*   **Workflow Name:** 1012 | Data-Mgmt | lead | Campaign Start mapping | Map from Lead to Deal Property

### Purpose

This workflow automatically copies the "Campaign start" property from a lead record to its associated deal record. This ensures data consistency between related objects, specifically for tracking campaign timelines when both records exist and have the necessary information.

### Enrollment Criteria

A lead record will enroll in this workflow when all of the following conditions are met:

*   The lead's **"Campaign start"** property is known (has a value).
*   The lead has an associated deal.
*   The associated deal's **"Deal name"** property is known (has a value).

### Actions

Once a lead is enrolled, the workflow performs the following single action:

*   **Copy Property Value:** It takes the value from the enrolled lead's **"Campaign start"** property and copies it to the **"Campaign start"** property on the associated deal record.

### Settings

*   **Re-enrollment:** Disabled. A lead can only be enrolled in this workflow once.