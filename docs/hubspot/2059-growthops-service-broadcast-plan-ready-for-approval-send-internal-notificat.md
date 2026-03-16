---
title: '2059 | GrowthOps | Service | Broadcast Plan = ready for Approval | Send internal notification to the assigned Project Owner and/or Customer'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634315
---

### **Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3573160135/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3573160135/edit)
*   **Workflow ID:** 3573160135
*   **Workflow Name:** 2059 | GrowthOps | Service | Broadcast Plan = ready for Approval | Send internal notification to the assigned Project Owner and/or Customer

### **Purpose**

This workflow automates the initial approval process for a "Broadcast Plan" (Schaltplan). When a plan is submitted and ready for review, this workflow sends an internal notification to the relevant project/deal owner, providing them with all the necessary links and information to approve the plan or forward it to the customer.

### **Enrollment Triggers**

A Service object is enrolled in this workflow when **all** of the following conditions are met:

*   The Service's "Broadcast Plan Approval Status" is "Open".
*   The Service's "Broadcast Plan URL" property has a value (is known).
*   The Service's "Delfin Order ID" property has a value (is known).
*   Re-enrollment is turned off. An object can only go through this workflow once.

### **Workflow Actions**

The workflow executes the following steps in order:

*   **Step 1: Send Internal Notification Email**
    *   An internal email is sent to the owner of the deal associated with the Service object.
    *   **Subject:** "Schaltplan ist bereit für die Freigabe" (Broadcast plan is ready for approval).
    *   **Body:** The email notifies the owner that the plan is ready for confirmation. It includes dynamic links and details for:
        *   Project ID & Link
        *   Service ID & Link
        *   Linked Deal & Company
        *   Broadcast Plan URL for approval
*   **Step 2: Check for Automated Customer Email**
    *   The workflow checks if the "Automated Customer Email" property on the Service object is set to "Yes".
    *   **If Yes:** No further action is taken. The workflow ends for this object.
    *   **If No or Empty:** No further action is taken. The workflow ends for this object.
    *   _Note: This branch currently does not lead to any distinct actions and serves as a potential placeholder for future logic._

### **Execution Schedule**

*   This workflow will only run on weekdays.
*   **Days:** Monday, Tuesday, Wednesday, Thursday, Friday
*   **Time:** Between 7:00 AM and 5:00 PM (17:00).