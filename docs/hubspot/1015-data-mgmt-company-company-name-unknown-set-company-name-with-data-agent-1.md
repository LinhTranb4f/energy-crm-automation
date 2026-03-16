---
title: '1015 | Data-Mgmt | company | Company name unknown | set company name with Data Agent'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635635
---

### **Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2724854998/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2724854998/edit)
*   **Workflow ID:** 2724854998
*   **Workflow Name:** 1015 | Data-Mgmt | company | Company name unknown | set company name with Data Agent

### **Objective**

This workflow is designed for data management. Its purpose is to automatically populate the standard 'Company Name' field for company records where this information is missing. It uses a custom property, 'Data Agent company name' (data\_agent\_unternehmensname), as the data source.

### **Object Type**

*   Company

### **Enrollment Triggers**

A company will be enrolled in this workflow if **ALL** of the following conditions are met:

*   The 'Company Name' property is unknown (empty).
*   The 'Data Agent company name' (data\_agent\_unternehmensname) property is known (has a value).

### **Re-enrollment**

Re-enrollment is enabled for this workflow. A company will re-enroll if its properties are updated to meet the enrollment triggers again. For example:

*   If an existing Company Name is deleted.
*   If the 'Data Agent company name' property gets populated after the record was created.

### **Workflow Actions**

Once a company is enrolled, the workflow performs one single action:

*   **Set Property Value:** It copies the value from the 'Data Agent company name' property and uses it to update the standard 'Company Name' property.