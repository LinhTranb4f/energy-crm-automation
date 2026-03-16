---
title: '2020 | GrowthOps | contact | LCS unknow und Original Channel known | mapping LCS'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635155
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2480598223/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2480598223/edit)
*   **Workflow ID:** 2480598223
*   **Workflow Name:** 2020 | GrowthOps | contact | LCS unknow und Original Channel known | mapping LCS

### Purpose

This workflow automatically updates a contact's lifecycle stage based on how they were originally acquired (their original contact channel). It is designed to fill in the lifecycle stage for contacts where this information is missing but the acquisition channel is known.

### Enrollment Triggers

Contacts are enrolled in this workflow if they meet **ALL** of the following criteria:

*   The contact's **Lifecycle Stage** property is unknown (has no value).
*   The contact's **Original Contact Channel** property is known (has a value).

### Workflow Actions

The workflow begins with an if/then branch that checks the value of the 'Original Contact Channel' property:

*   **If 'Original Contact Channel' is 'Inbound':**
    *   The workflow sets the contact's **Lifecycle Stage** to **Marketing Qualified Lead**.
*   **If 'Original Contact Channel' is 'Outbound':**
    *   The workflow sets the contact's **Lifecycle Stage** to **Sales Qualified Lead**.
*   **If 'Original Contact Channel' is 'Partner/Netzwerk':**
    *   The workflow sets the contact's **Lifecycle Stage** to **Sales Qualified Lead**.
*   **If 'Original Contact Channel' is anything else ('Other'):**
    *   No action is taken, and the contact exits the workflow.

### Re-enrollment

*   Contacts will not be re-enrolled in this workflow if they meet the trigger criteria again.