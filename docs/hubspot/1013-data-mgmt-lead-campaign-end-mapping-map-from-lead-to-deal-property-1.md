---
title: '1013 | Data-Mgmt | lead | Campaign End mapping | Map from Lead to Deal Property'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635555
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2690818247/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2690818247/edit)
*   **Workflow ID:** 2690818247
*   **Workflow Name:** 1013 | Data-Mgmt | lead | Campaign End mapping | Map from Lead to Deal Property

### Purpose

This workflow automates the process of synchronizing the "Campaign end" property from a lead record to its associated deal record. This ensures data consistency across related objects and supports accurate reporting on deals based on campaign timelines.

### Object Type

*   This is a **Lead-based** workflow.

### Enrollment Triggers

A lead will be enrolled in this workflow when **ALL** of the following conditions are met:

*   The lead's property "Campaign end" is known (has a value).
*   AND The lead is associated with a deal where the "Deal name" property is known (has a value).

### Actions

Once a lead is enrolled, the workflow performs the following action:

*   **Action 1: Copy Property Value**
    *   **From:** The enrolled Lead record.
    *   **Source Property:** "Campaign end"
    *   **To:** The associated Deal record.
    *   **Target Property:** "Campaign end"

### Re-enrollment

*   Re-enrollment is turned **OFF**. A lead can only go through this workflow once.