---
title: 'Für Kontakt > Unternehmen zuständiger Mitarbeiter'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632675
---

### Workflow Documentation: Für Kontakt > Unternehmen zuständiger Mitarbeiter

**Summary**

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/1657633059/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/1657633059/edit)
*   **Workflow ID**: 1657633059
*   **Workflow Name**: Für Kontakt > Unternehmen zuständiger Mitarbeiter (For Contact > Company Responsible Employee)

**Purpose**
This workflow is designed to ensure data consistency by automatically assigning an owner to a company record. It triggers when a contact, who already has an owner, is associated with a company that does not yet have an owner. The workflow then assigns the contact's owner to the associated company.

**Enrollment Triggers**
This is a **Contact-based** workflow. A contact will enroll when all of the following conditions are met simultaneously:

*   The **Contact** property `Contact owner` is known.
*   The **Contact** is associated with a company.
*   The associated **Company** property `Company owner` is unknown.

**Re-enrollment**

*   Re-enrollment is turned **off**. Contacts will only be processed by this workflow once.

**Workflow Actions**
Once a contact meets the enrollment criteria, the workflow performs the following action:

*   **Action 1: Copy Property**
    *   The workflow copies the `Contact owner` property value from the enrolled contact.
    *   It then sets the `Company owner` property on the associated company record to this value.