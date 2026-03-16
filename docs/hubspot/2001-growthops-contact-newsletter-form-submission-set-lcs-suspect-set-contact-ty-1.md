---
title: '2001 | GrowthOps | contact | Newsletter Form Submission | Set LCS= Suspect & Set   Contact Typ= Prospect'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635335
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2628798679/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2628798679/edit)
*   **Workflow ID:** 2628798679
*   **Workflow Name:** 2001 | GrowthOps | contact | Newsletter Form Submission | Set LCS= Suspect & Set Contact Typ= Prospect

### Goal

To automatically set the 'Contact Type' property to 'Prospect' for any contact who signs up for the newsletter, but only if their 'Contact Type' is not already set. This ensures existing classifications like 'Customer' or 'Partner' are not overwritten.

### Enrollment Triggers

*   A contact is enrolled in this workflow when they submit the HubSpot Form with the ID: `7d8bd5d1-a6b3-4da8-9846-032447537927`.
*   Re-enrollment is enabled, meaning a contact can enter this workflow every time they submit the specified form.

### Workflow Actions

*   **1\. Check Contact Type Property**
    *   The workflow begins by checking if the contact property 'Contact Type' (`original_contact_type`) has any existing value.
*   **2\. Conditional Logic**
    *   **If 'Contact Type' is already known** (e.g., Prospect, Customer, Partner, etc.), the contact follows a branch with no actions and immediately exits the workflow.
    *   **If 'Contact Type' is unknown/empty**, the contact proceeds down the default branch to the next action.
*   **3\. Set 'Contact Type' to Prospect**
    *   The workflow sets the contact's 'Contact Type' (`original_contact_type`) property to the value 'Prospect'.