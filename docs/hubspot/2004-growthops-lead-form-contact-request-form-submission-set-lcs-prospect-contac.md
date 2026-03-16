---
title: '2004 | GrowthOps | lead | Form: Contact Request Form Submission | Set LCS= Prospect & Contact Type= Prospect'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633035
---

### Summary

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2629266651/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2629266651/edit)
*   **Workflow ID**: 2629266651
*   **Workflow Name**: 2004 | GrowthOps | lead | Form: Contact Request Form Submission | Set LCS= Prospect & Contact Type= Prospect

### Workflow Goal

This workflow is designed to automatically set the 'Contact Type' property to 'Prospect' for any contact who submits the 'Contact Request Form'. This action only occurs if the 'Contact Type' property for that contact is not already filled out, ensuring existing contact classifications are not overwritten.

### Enrollment Triggers

*   This is a contact-based workflow.
*   A contact is enrolled when they submit the form with ID `89122a36-69d1-4d61-8611-484fac02363e`.
*   Re-enrollment is enabled, meaning a contact can trigger this workflow multiple times.

### Workflow Actions

1. **Check Contact Property**: The workflow first checks the value of the contact's 'Contact Type' property.
2. **Conditional Split**:
    *   **If 'Contact Type' has any value** (e.g., Prospect, Customer, Partner, etc.), the contact meets a branch condition and exits the workflow. No further action is taken.
    *   **If 'Contact Type' is empty**, the contact proceeds down the default path to the next action.
3. **Set Property Value**: The workflow sets the contact's 'Contact Type' property to **Prospect**.

### Notes & Observations

*   **Naming Discrepancy**: The workflow name includes "Set LCS= Prospect", but there is no action within the workflow that sets or modifies the Lifecycle Stage (LCS). This may need to be reviewed or updated.
*   **Description Discrepancy**: The internal description mentions "Newsletter registrations" (`Newsletteranmeldungen`), while the workflow name refers to a "Contact Request Form". It is recommended to align the name and description for clarity.