---
title: '2054 | GrowthOps | Operations Projects | payment type = end of campaign, Campaign End Date = Today | Create Invoice Records'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634115
---

### **Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3542707403/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3542707403/edit)
*   **Workflow ID:** 3542707403
*   **Workflow Name:** 2054 | GrowthOps | Operations Projects | payment type = end of campaign, Campaign End Date = Today | Create Invoice Records

### **Purpose**

This workflow automates the process of initiating invoice creation for specific 'Operations Projects'. It identifies projects that are scheduled for billing at the end of their campaign and triggers an external process to handle the invoicing.

### **Trigger / Enrollment Criteria**

The workflow enrolls records from the 'Operations Projects' custom object when both of the following conditions are met:

*   The project's **Payment Type** property is exactly 'End of campaign'.
*   AND
*   The project's **Campaign End** date is today.
    *   _Note: The date is evaluated based on the Europe/Zurich timezone._

### **Enrollment Settings**

*   **Re-enrollment:** Disabled. A project record can only be enrolled in this workflow once.

### **Actions**

1. **Send Webhook**
    *   Immediately after enrollment, the workflow attempts to send a POST request via a webhook.
    *   This action is intended to signal an external system (e.g., an accounting or invoicing platform) to create an invoice record for the enrolled project.
    *   _Note: The webhook URL is currently not configured in the provided data._