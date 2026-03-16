---
title: '2004 | GrowthOps | lead | Form: Contact Request Form Submission | Set LCS= Prospect & Contact Type= Prospect'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635355
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2629266651/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2629266651/edit)
*   **Workflow ID:** 2629266651
*   **Workflow Name:** 2004 | GrowthOps | lead | Form: Contact Request Form Submission | Set LCS= Prospect & Contact Type= Prospect

### Workflow Goal

The primary goal of this workflow is to automatically classify new leads who submit the 'Contact Request Form'. It sets the "Original Contact Type" property to "Prospect" for any contact submitting this form, but only if the property is currently empty. This ensures new inbound contacts are properly categorized without overwriting data for existing contacts like customers or partners.

### Enrollment Trigger

A contact is enrolled in this workflow when they meet the following criteria:

*   The contact submits the HubSpot form with the ID: `89122a36-69d1-4d61-8611-484fac02363e`.
*   Re-enrollment is enabled, meaning a contact can trigger this workflow multiple times if they submit the form again.

### Workflow Steps

The workflow follows a simple conditional logic:

1. **Trigger:** A contact submits the specified form.
2. **Condition Check:** The workflow immediately checks if the contact's "Original Contact Type" property is known (e.g., Prospect, Customer, Partner, etc.).
3. **Branching Logic:**
    *   **If the 'Original Contact Type' property is empty:** The contact proceeds down the 'default' path to the next action.
    *   **If the 'Original Contact Type' property already has a value:** The contact meets no further criteria and exits the workflow. No changes are made to their record.
4. **Action:** For contacts with an empty 'Original Contact Type', the workflow performs the following action:
    *   Sets the contact's "Original Contact Type" property value to "Prospect".