---
title: '1018 | Data-Mgmt | contact | Browserweiterung, BBC to Mail | Set company owner for sales contacts'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635735
---

### Summary

**Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2987569341/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2987569341/edit)
**Workflow ID:** 2987569341
**Workflow Name:** 1018 | Data-Mgmt | contact | Browserweiterung, BBC to Mail | Set company owner for sales contacts

### Objective

This workflow automates data management by setting the 'Company owner' property on a company record. It triggers when a new contact is created via the Sales Extension or by BCC'ing an email to the CRM. The workflow ensures that if the associated company doesn't already have an owner, it inherits the owner from the newly created contact.

### Enrollment Criteria

A contact is enrolled in this workflow when the following conditions are met:

*   **Trigger:** The contact's 'Original source' property is updated to one of the following:
    *   BCC'd Email (BCC\_TO\_CRM)
    *   Sales Extension (EXTENSION)
*   **Condition:** AND the contact's primary associated company has no value in its 'Company owner' property.

### Workflow Steps

**Step 1: Check for Associated Company**

*   The workflow first checks if the enrolled contact has a primary company associated with it.
*   **If YES:** The contact proceeds to Step 3.
*   **If NO:** The contact proceeds to Step 2.

**Step 2: Wait for Association**

*   If no primary company is found, the workflow waits for 3 minutes. This delay allows time for HubSpot's automatic association to complete.
*   After the delay, the workflow sends the contact to Step 3.

**Step 3: Check for Existing Company Owner**

*   The workflow checks if the primary associated company has a value for the 'Company owner' property.
*   **If YES:** The contact exits the workflow. The company already has an owner, so no action is needed.
*   **If NO:** The contact proceeds to Step 4.

**Step 4: Set Company Owner**

*   The workflow copies the 'Contact owner' from the enrolled contact.
*   It then sets this value as the 'Company owner' on the primary associated company record.
*   The contact then exits the workflow.