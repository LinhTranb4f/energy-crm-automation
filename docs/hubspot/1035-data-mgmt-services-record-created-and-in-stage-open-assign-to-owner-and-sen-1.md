---
title: '1035 | Data-Mgmt | Services | record created and in stage "open" | assign to owner and send internal notification'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636575
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3566379197/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3566379197/edit)
*   **Workflow ID:** 3566379197
*   **Workflow Name:** 1035 | Data-Mgmt | Services | record created and in stage "open" | assign to owner and send internal notification

### **Objective**

This workflow automates the initial assignment and notification process for newly created "Service" custom object records. When a new Service record is created in the "Open" stage for specific product groups, it assigns a designated owner and sends an internal notification to inform them.

### **Enrollment Triggers**

A "Service" record is enrolled in this workflow when all of the following conditions are met:

*   The record is newly created.
*   The record's pipeline stage is "Open" (Stage ID: 8e2b21d0-7a90-4968-8f8c-a8525cc49c70).
*   The "Product Group" property is either "Audio Production" or "Social Media".
*   Records cannot be re-enrolled in this workflow.

### **Workflow Actions**

The workflow begins with a branch that checks the "Product Group" property.

#### **Branch A: If Product Group is "Audio Production"**

*   **Step 1: Assign Owner**
    *   The "HubSpot Owner" property of the Service record is set to a specific user (User ID: 67115507).
*   **Step 2: Send Internal Notification**
    *   An internal email notification is sent to the newly assigned HubSpot Owner.
    *   **Subject:** "Neuer Service {{Service Name}} ist erstellt"
    *   **Body:** The email informs the owner about the new Service assignment and includes key details using personalization tokens:
        *   Project ID
        *   Service ID
        *   Service Name
        *   Campaign Start Date
        *   Campaign End Date

#### **Branch B: If Product Group is "Social Media"**

*   **Step 1: Assign Owner**
    *   The "HubSpot Owner" property of the Service record is set to a specific user (User ID: 67115507).
*   **Step 2: Send Internal Notification**
    *   An internal email notification is sent to the newly assigned HubSpot Owner.
    *   **Subject:** "Neuer Service {{Service Name}} ist erstellt"
    *   **Body:** The email informs the owner about the new Service assignment and includes key details using personalization tokens:
        *   Project ID
        *   Service ID
        *   Service Name
        *   Campaign Start Date
        *   Campaign End Date