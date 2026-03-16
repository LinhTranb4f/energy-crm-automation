---
title: '1014 | Data-Mgmt | contact | Contact has a new owner or owner has changed | set manager of owner to contact'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633335
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2749244656/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2749244656/edit)
*   **Workflow ID:** 2749244656
*   **Workflow Name:** 1014 | Data-Mgmt | contact | Contact has a new owner or owner has changed | set manager of owner to contact

### Purpose

This workflow automates a key data management task. Its primary goal is to ensure that every contact record has an associated manager. It achieves this by setting the contact's 'Manager' property based on the HubSpot Team of the contact's assigned owner. This is triggered whenever a contact's owner is assigned or changed, guaranteeing that the manager information stays current and accurate.

### Enrollment Triggers

A contact will be enrolled in this workflow if either of the following is true:

*   The 'HubSpot Owner' property is known (i.e., the contact has an owner).
*   The 'HubSpot Owner' property has been updated within the last day.

**Re-enrollment:** Re-enrollment is enabled. This means a contact will re-enter the workflow every time its 'HubSpot Owner' property is updated, ensuring the 'Manager' property is always aligned with the current owner's team.

### Workflow Actions

Once a contact is enrolled, the workflow executes a single branching logic step to assign the correct manager.

*   **Step 1: Check Contact Owner's Team**
    *   The workflow checks the value of the 'HubSpot Team ID' property associated with the contact.
    *   Based on the team ID, it sets the contact's 'Manager' property to a specific HubSpot user ID.
    *   The logic is as follows:
        *   If Team ID is `62538013`, set Manager to User ID `26695357`.
        *   If Team ID is `169855561`, set Manager to User ID `79295101`.
        *   If Team ID is `169855566`, set Manager to User ID `80253539`.
        *   If Team ID is `169855584`, set Manager to User ID `1779033493`.
        *   If Team ID is `169855588`, set Manager to User ID `80764027`.
        *   If Team ID is `169855603`, set Manager to User ID `80253547`.

After setting the property, the workflow concludes for that contact.