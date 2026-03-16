---
title: '2003 | GrowthOps | contact | LCS= Prospect | Lead Routing: Set Contact & Company Owner'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632995
---

### **Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2623929563/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2623929563/edit)
*   **Workflow ID:** 2623929563
*   **Workflow Name:** 2003 | GrowthOps | contact | LCS= Prospect | Lead Routing: Set Contact & Company Owner

### **Objective**

This contact-based workflow is designed for lead routing and owner assignment. Its main purpose is to ensure that a new Sales Qualified Lead (SQL) without an owner is assigned to the owner of its associated company. This helps maintain ownership consistency between related contacts and companies.

### **Enrollment Triggers**

A contact is enrolled in this workflow when:

*   Its **Lifecycle Stage** becomes **Sales Qualified Lead**.
*   Re-enrollment is enabled, allowing contacts to re-enter the workflow if they meet the trigger criteria again in the future.

### **Workflow Steps**

1. **Check for Existing Contact Owner:** The workflow first checks if the contact already has an owner assigned.
    *   **If YES:** The contact already has an owner, so no further action is needed. The contact exits the workflow.
    *   **If NO:** The workflow proceeds to the next step.
2. **Check for Associated Company Owner:** The workflow checks the contact's primary associated company to see if an owner is assigned to it.
    *   **If YES:** An owner is found on the company record. The workflow proceeds to the final step.
    *   **If NO:** The associated company does not have an owner, so there is no owner to assign. The contact exits the workflow.
3. **Assign Contact Owner from Company:** The workflow copies the **HubSpot Owner** from the associated company and sets it as the **Contact Owner** for the enrolled contact. After this action, the workflow is complete.