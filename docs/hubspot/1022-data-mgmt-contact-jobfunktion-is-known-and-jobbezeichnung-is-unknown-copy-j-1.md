---
title: '1022 | Data-Mgmt | contact | Jobfunktion is known and Jobbezeichnung is unknown | copy Jobfunktion to Jobbezeichnung'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635875
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3113612529/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3113612529/edit)
*   **Workflow ID:** 3113612529
*   **Workflow Name:** 1022 | Data-Mgmt | contact | Jobfunktion is known and Jobbezeichnung is unknown | copy Jobfunktion to Jobbezeichnung

### **Purpose**

This contact-based data management workflow is designed to improve data completeness. It automatically transfers the value from the 'Job Function' (Jobfunktion) property to the 'Job Title' (Jobbezeichnung) property, but only when the 'Job Title' property is empty.

### **Enrollment Triggers**

Contacts are enrolled in this workflow when the following conditions are met simultaneously:

*   The contact property 'Job Function' (`job_function`) has a known value.
*   AND
*   The contact property 'Job Title' (`jobtitle`) is empty.

### **Workflow Actions**

Once a contact is enrolled, a single action is executed:

*   **Copy Property Value:** The value from the contact's 'Job Function' (`job_function`) property is copied into their 'Job Title' (`jobtitle`) property.

### **Settings**

*   **Re-enrollment:** Re-enrollment is turned off. A contact will only be processed by this workflow once, even if their 'Job Title' is cleared again later while their 'Job Function' still has a value.