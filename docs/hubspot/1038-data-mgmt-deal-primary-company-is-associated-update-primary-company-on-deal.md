---
title: '1038 | Data-Mgmt | deal | Primary Company is associated | Update Primary Company on Deal'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634835
---

### **Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3793128650/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3793128650/edit)
*   **Workflow ID:** 3793128650
*   **Workflow Name:** 1038 | Data-Mgmt | deal | Primary Company is associated | Update Primary Company on Deal

### **Objective**

This workflow is a data management process designed to ensure data consistency. It automatically updates a text field on a deal record, 'Primary Company Name', with the actual name of the company record that is set as the primary association for that deal.

### **Workflow Type**

*   Deal-based

### **Trigger (Enrollment Criteria)**

*   A deal enrolls in this workflow when it is associated with a company record using the 'Primary Company' association label.

### **Actions**

*   **Action 1: Update Deal Property**
    *   **Target Property:** Primary Company Name (`primary_company_name`)
    *   **New Value:** The workflow copies the 'Name' property from the associated Primary Company record and sets it as the value for the 'Primary Company Name' field on the deal.

### **Settings**

*   **Re-enrollment:** Disabled. A deal will only run through this workflow once.