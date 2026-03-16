---
title: '1029 | Data-Mgmt | contact | Adress Update | 1-way Address Update Sync'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634015
---

### **Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3330828514/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3330828514/edit)
*   **Workflow ID:** 3330828514
*   **Workflow Name:** 1029 | Data-Mgmt | contact | Adress Update | 1-way Address Update Sync

### **Purpose**

This workflow automates the synchronization of updated contact information from HubSpot to an external system, identified as "Delfin". Its primary function is to ensure that when key contact details are modified in HubSpot, these changes are immediately pushed to Delfin, maintaining data consistency across platforms.

### **Trigger and Enrollment**

*   **Object Type:** Contact
*   **Trigger Type:** This is an event-based workflow that triggers when a specific contact property is changed.
*   **Enrollment Conditions:** A contact will be enrolled in this workflow if **ANY** of the following contact properties are updated to a new, known value:
    *   Website
    *   Address
    *   Name
    *   Phone
    *   Email (property name: `e_mail`)
    *   Country (property name: `original_country`)
    *   City
    *   Zip
*   **Re-enrollment:** Re-enrollment is enabled. This means a contact can enter this workflow multiple times. Each time one of the trigger properties is updated, the workflow will run again for that contact.

### **Workflow Actions**

This workflow consists of a single action.

*   **Action 1: Send Data via Webhook**
    *   **Type:** Webhook (POST request)
    *   **Destination URL:** [https://n8n.tools.energy/webhook/sync-address-to-delfin](https://n8n.tools.energy/webhook/sync-address-to-delfin)
    *   **Function:** Immediately upon enrollment, the workflow sends the contact's data to an external automation platform (n8n). This n8n workflow is responsible for processing the data from HubSpot and updating the corresponding record in the Delfin system.

### **Dependencies and Integrations**

*   **n8n:** This workflow is critically dependent on an active and functioning automation process at the specified n8n webhook URL. Any failure or deactivation of the n8n workflow will cause this data sync to fail.
*   **Delfin:** The final destination for the synchronized data. The integration logic within n8n manages the connection and data mapping to Delfin.

### **Project Management Notes**

*   This is a one-way data sync, from HubSpot to Delfin. Changes made in Delfin will not be reflected back in HubSpot by this workflow.
*   The system ensures that updates only trigger when a property has a value (is known), preventing blank data from being sent.
*   Any changes to the data structure of contacts in HubSpot or Delfin may require updates to the intermediary n8n workflow to ensure correct data mapping.