---
title: '2020 | GrowthOps | contact | LCS unknow und Original Channel known | mapping LCS'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632835
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2480598223/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2480598223/edit)
*   **Workflow ID:** 2480598223
*   **Workflow Name:** 2020 | GrowthOps | contact | LCS unknow und Original Channel known | mapping LCS

### Overview

This workflow automatically updates a contact's Lifecycle Stage based on their Original Contact Channel. Its primary purpose is to ensure data hygiene and proper lead categorization for contacts that are missing a lifecycle stage but have a known acquisition channel.

### Enrollment Triggers

A contact is enrolled in this workflow when the following conditions are met simultaneously:

*   The contact's 'Lifecycle Stage' property is unknown (has no value).
*   AND the contact's 'Original Contact Channel' property is known (has a value).

### Workflow Logic

Once a contact is enrolled, the workflow follows these steps:

1. The workflow checks the value of the 'Original Contact Channel' property.
2. It then proceeds down one of the following branches:
    *   **If the channel is 'Inbound':**
        *   The contact's 'Lifecycle Stage' is set to 'Marketing Qualified Lead'.
    *   **If the channel is 'Outbound':**
        *   The contact's 'Lifecycle Stage' is set to 'Sales Qualified Lead'.
    *   **If the channel is 'Partner/Netzwerk':**
        *   The contact's 'Lifecycle Stage' is set to 'Sales Qualified Lead'.
    *   **If the channel is 'Other' or any other value:**
        *   No action is taken, and the contact exits the workflow.

### Re-enrollment

Re-enrollment is turned OFF for this workflow. A contact can only go through this process once.