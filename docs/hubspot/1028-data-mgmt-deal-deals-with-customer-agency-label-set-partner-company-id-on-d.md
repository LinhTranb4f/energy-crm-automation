---
title: '1028 | Data-Mgmt | deal | Deals with Customer Agency Label | Set Partner Company ID on Deal and sync to Invoice'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633855
---

### **Workflow Documentation**

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3239599323/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3239599323/edit)
*   **Workflow ID:** 3239599323
*   **Workflow Name:** 1028 | Data-Mgmt | deal | Deals with Customer Agency Label | Set Partner Company ID on Deal and sync to Invoice

**Purpose**
This workflow automates data management for deals associated with a customer agency. Its primary goals are to ensure the associated agency company is correctly labeled and to copy a unique identifier from that agency to the deal record, likely for invoicing and reporting purposes.

**Enrollment Criteria**

*   **Object Type:** Deals
*   **Trigger:** This workflow enrolls a deal when it becomes a member of the list with ID `476`.
*   **Re-enrollment:** Re-enrollment is enabled, meaning a deal can re-trigger this workflow if it meets the enrollment criteria again.

**Workflow Actions**

**Step 1: Check for Agency Label**

*   The workflow begins by checking a company associated with the deal under the "Customer Agency" label.
*   It looks at the 'Original Company Type' property on this associated company to see if it is already set to "Agency".

**Step 2: Branching Logic**

*   **Branch 1: "Agency is known"**
    *   If the associated company's 'Original Company Type' is already "Agency", the workflow proceeds directly to the final data sync step.
*   **Branch 2: "Agency is missing"**
    *   If the 'Original Company Type' is not set to "Agency", the workflow first performs a data update.
    *   It locates the company associated with the deal via the "Partner Company" label.
    *   It updates this Partner Company's 'Original Company Type' property, setting the value to "Agency".
    *   After this update, it proceeds to the same final data sync step.

**Step 3: Set Partner Company ID on Deal**

*   This is the final action for both branches.
*   The workflow identifies the "Partner Company" associated with the deal.
*   It copies the value from the 'Company Number' property of that Partner Company.
*   It then sets the 'Partner Company ID' property on the enrolled deal to this copied value.