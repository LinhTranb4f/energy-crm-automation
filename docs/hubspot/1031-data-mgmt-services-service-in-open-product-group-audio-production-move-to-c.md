---
title: '1031 | Data-Mgmt | Services | Service in Open & Product Group = "Audio Production" | Move to Content in Production'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634155
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3551336648/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3551336648/edit)
*   **Workflow ID:** 3551336648
*   **Workflow Name:** 1031 | Data-Mgmt | Services | Service in Open & Product Group = "Audio Production" | Move to Content in Production

### **Objective**

This workflow automates a data management process for "Audio Production" services. Its primary goal is to move these services to the "Content in Production" pipeline stage and synchronize a key date property once the delivery date is set.

### **Enrollment Triggers**

A Service object is enrolled in this workflow when the following condition is met:

*   The property "Planned Delivery Date" is known (i.e., it has a value).
*   _Note: Based on the workflow's name, it is implied that the workflow also targets services where the "Product Group" is "Audio Production" and the current stage is "Open"._

### **Workflow Actions**

Once a service is enrolled, the workflow performs the following actions in sequence:

1. **Set Campaign End Date:** The workflow copies the value from the "Planned Delivery Date" property and sets the "Campaign End Date" property to this value.
2. **Move Pipeline Stage:** The workflow updates the service's pipeline stage to "Content in Production".

### **Re-enrollment**

*   Re-enrollment is turned OFF. A service record can only go through this workflow once.