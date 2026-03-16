---
title: '1018 | Data-Mgmt | contact | Browserweiterung, BBC to Mail | Set company owner for sales contacts'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633415
---

### Workflow Documentation

**Summary**

*   **Workflow URL:** `https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2987569341/edit`
*   **Workflow ID:** `2987569341`
*   **Workflow Name:** `1018 | Data-Mgmt | contact | Browserweiterung, BBC to Mail | Set company owner for sales contacts`
*   **Status:** Active

### **Objective**

This workflow automates data management by ensuring that when a sales user creates a new contact via the "BCC to CRM" email function or the "Sales Extension", the associated company record is automatically assigned to the same owner as the contact. This only occurs if the company does not already have an owner assigned, preventing accidental ownership changes.

### **Enrollment Triggers**

A contact will be enrolled in this workflow when the following conditions are met:

*   The contact's **Original Source** property is updated to one of the following values:
    *   `BCC to CRM`
    *   `Sales Extension`
*   **AND** the contact's primary associated company has no value in the **Company Owner** property.
*   **Note:** Re-enrollment is turned off. A contact can only go through this workflow once.

### **Workflow Actions**

The workflow follows a logical path to check for necessary associations and existing data before making any changes.

*   **Step 1: Check for an Associated Company**
    *   The workflow first checks if the enrolled contact has a primary company associated with it.
    *   **If YES:** The contact proceeds directly to Step 3 (Check for Company Owner).
    *   **If NO:** The contact proceeds to Step 2 (Wait).
*   **Step 2: Wait for Association**
    *   The workflow pauses for **3 minutes**.
    *   **Purpose:** This delay allows time for HubSpot's system to automatically create and/or associate a company with the contact, which can sometimes take a moment after the contact is created.
    *   After the delay, the contact proceeds to Step 3.
*   **Step 3: Check for an Existing Company Owner**
    *   The workflow inspects the associated primary company to see if the **Company Owner** property is already filled.
    *   **If YES:** The workflow ends. This prevents the workflow from overwriting a pre-existing or manually set company owner.
    *   **If NO:** The contact proceeds to the final step.
*   **Step 4: Assign Company Owner**
    *   The workflow copies the value from the enrolled contact's **Contact Owner** property.
    *   It then pastes this value into the associated company's **Company Owner** property.
    *   **Outcome:** The contact owner and company owner are now the same, ensuring clear ownership for the sales team.