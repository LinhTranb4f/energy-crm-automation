---
title: '2003 | GrowthOps | contact | LCS= Prospect | Lead Routing: Set Contact & Company Owner'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635315
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2623929563/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2623929563/edit)
*   **Workflow ID:** 2623929563
*   **Workflow Name:** 2003 | GrowthOps | contact | LCS= Prospect | Lead Routing: Set Contact & Company Owner

### Objective

This workflow automates lead routing by ensuring that a contact has an assigned owner. If the contact is unassigned but their associated company has an owner, this workflow copies the company's owner to the contact record. This aligns ownership and maintains data consistency.

### Enrollment Triggers

*   A contact is enrolled when their **Lifecycle Stage** becomes **Sales Qualified Lead**.
*   Re-enrollment is enabled, meaning contacts can re-enter this workflow if they meet the trigger criteria again in the future.

### Workflow Actions

1. **Check if Contact Owner Exists**
    *   The workflow first checks if the **Contact Owner** property is known (has a value).
    *   **If YES** (Branch: "Für Kontakt zuständigen Mitarbeiter ist bekannt"): The contact already has an owner. No action is taken, and the workflow ends for this contact.
    *   **If NO** (Branch: "unbekannt"): The contact is unassigned. The workflow proceeds to the next step.
2. **Check if Associated Company has an Owner**
    *   The workflow checks the contact's associated company to see if the **Company Owner** property is known.
    *   **If YES** (Branch: "Für Unternehmen zust. Mitarbeiter ist bekannt"): The associated company has an owner. The workflow proceeds to the final action.
    *   **If NO** (Branch: "unbekannt"): The associated company does not have an owner. No action can be taken, and the workflow ends for this contact.
3. **Assign Contact Owner**
    *   This action copies the **Company Owner** value from the associated company to the **Contact Owner** property on the contact's record.
    *   This step ensures the contact is assigned to the same owner as their primary company.

### End of Workflow

*   The contact exits the workflow once the owner is assigned or if the conditions for assignment are not met.