---
title: '1039 | Data-Mgmt | Operations Projects | Broadcast plan is approved | send notification to deal owner'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634815
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3792734422/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3792734422/edit)
*   **Workflow ID:** 3792734422
*   **Workflow Name:** 1039 | Data-Mgmt | Operations Projects | Broadcast plan is approved | send notification to deal owner

### Objective

This workflow automates a key communication step in the operations project lifecycle. Its purpose is to instantly notify a Deal Owner via an internal email when the 'Broadcast Plan' associated with their deal has been officially approved. This ensures the deal owner is aware of the project's progress and can proceed with the next steps.

### Base Object

*   This is a **Deal-based** workflow.

### Enrollment Triggers (When this happens...)

A Deal will be enrolled in this workflow and the actions will begin when all of the following conditions are met:

*   The Deal has an associated custom object, 'Broadcast Plan'.
*   **AND** The 'Broadcast Plan URL' property on that associated Broadcast Plan is known (i.e., it has a value and is not empty).
*   **AND** The 'Broadcast Plan Approval Status' property on that same Broadcast Plan is set to 'Approved'.

### Workflow Actions (Then do this...)

Once a deal meets the trigger criteria, the following action is executed immediately:

*   **Action 1: Send Internal Notification**
    *   **Recipient:** The owner of the enrolled deal (via the `hubspot_owner_id` property).
    *   **Email Subject:** "Schaltplan vom Deal \[Deal Name\] ist genehmigt." (Translation: "Broadcast plan for deal \[Deal Name\] is approved.")
    *   **Email Body:** "Hallo \[Deal Owner Name\], Der Schaltplan in deinem \[Deal Name\] ist genehmigt." (Translation: "Hello \[Deal Owner Name\], The broadcast plan in your \[Deal Name\] is approved.")

### Settings & Configuration

*   **Re-enrollment:** Disabled. A deal can only be enrolled in this workflow once, preventing duplicate notifications if the deal properties are updated again.