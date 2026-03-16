---
title: 'Für Kontakt > Unternehmen zuständiger Mitarbeiter'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634995
---

### Summary

*   Workflow URL: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/1657633059/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/1657633059/edit)
*   Workflow ID: 1657633059
*   Workflow Name: Für Kontakt > Unternehmen zuständiger Mitarbeiter

### Objective

This workflow is designed to manage the owner of a contact based on the owner of its associated company. Based on its current configuration, this workflow will unassign the owner from a contact if their associated company has no owner.

### Enrollment Triggers

The workflow enrolls **Contacts** that meet ALL of the following criteria at the same time:

*   The Contact property 'HubSpot Owner' is known (the contact has an owner assigned).
*   The Contact property 'Associated company' is known (the contact is linked to a company).
*   The associated Company's 'HubSpot Owner' property is unknown (the associated company does NOT have an owner).

### Actions

1. **Copy Property Value**
    *   This action copies the 'HubSpot Owner' property value from the associated Company to the enrolling Contact's 'HubSpot Owner' property.
    *   **Important Note:** Because the enrollment trigger requires the associated company to have no owner, this action will copy an empty value. This will effectively remove the existing owner from the contact, leaving the contact unassigned.

### Settings

*   **Re-enrollment:** Re-enrollment is turned OFF. A contact can only be enrolled in this workflow once.