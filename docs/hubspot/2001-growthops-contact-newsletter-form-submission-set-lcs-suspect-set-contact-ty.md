---
title: '2001 | GrowthOps | contact | Newsletter Form Submission | Set LCS= Suspect & Set   Contact Typ= Prospect'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633015
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2628798679/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2628798679/edit)
*   **Workflow ID:** 2628798679
*   **Workflow Name:** 2001 | GrowthOps | contact | Newsletter Form Submission | Set LCS= Suspect & Set Contact Typ= Prospect

### Purpose

This workflow is designed to automatically categorize new contacts who sign up for the newsletter. Its main goal is to set the "Contact Type" property to "Prospect" for any new sign-up, but only if that property has not been set previously. This ensures that existing contacts (like Customers, Partners, etc.) who sign up for the newsletter do not have their contact type overwritten.

### Trigger / Enrollment Criteria

A contact is enrolled in this workflow when they meet the following criteria:

*   They submit the form with the ID: `7d8bd5d1-a6b3-4da8-9846-032447537927` (This is the Newsletter Subscription Form).
*   Re-enrollment is turned ON, meaning a contact can trigger this workflow multiple times if they submit the form again.

### Workflow Actions

The workflow follows a simple conditional logic:

1. **Check Contact Type:** The workflow first checks the contact's `original_contact_type` property.
2. **If/Then Branch:**
    *   **If** the `original_contact_type` property has ANY of the following values: Prospect, Customer, Partner, Supplier, Competitor, Freelancer / Consultant, Employee, Former Employee, Student / Trainee, or Other...
        *   ...then the contact proceeds down a blank branch, and the workflow ends. No action is taken.
    *   **If** the `original_contact_type` property is empty...
        *   ...the workflow proceeds to the next step.
3. **Set Property Value:** The workflow sets the contact's `original_contact_type` property to "Prospect".
4. **End:** The workflow finishes.