---
title: '1007 | Data-Mgmt | company | Active Company | Set status'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632915
---

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2596985045/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2596985045/edit)
*   **Workflow ID:** 2596985045
*   **Workflow Name:** 1007 | Data-Mgmt | company | Active Company | Set status

### **Objective**

This is a data management workflow designed to maintain data integrity for Company records. Its primary purpose is to automatically assign an "Active" status to any company record where the 'status' property has not been set, ensuring all companies have a defined status.

### **Trigger (Enrollment Criteria)**

A company record will be enrolled in this workflow when the following condition is met:

*   **Object Type:** Company
*   **Trigger Property:** The 'status' property is unknown (has no value).
*   **Re-enrollment:** Re-enrollment is enabled. This means if a company's status is ever cleared or becomes unknown again in the future, it will re-enter this workflow.

### **Actions**

Once a company is enrolled, the workflow performs a single action:

*   **Action 1: Set Property Value**
    *   The workflow updates the 'status' property on the company record.
    *   It sets the value of the property to **Aktiv**.