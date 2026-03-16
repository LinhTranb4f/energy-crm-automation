---
title: '2052b | GrowthOps | Service | payment type = end of campaign  | send webhook to calculate service for end of campaign '
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634095
---

### **Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3391011047/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3391011047/edit)
*   **Workflow ID:** 3391011047
*   **Workflow Name:** 2052b | GrowthOps | Service | payment type = end of campaign | send webhook to calculate service for end of campaign

### **Objective**

This workflow is designed to trigger a calculation process for services related to radio spots that are paid at the end of a campaign. When a service's campaign end date has passed, this workflow sends a webhook to an external system (n8n) to process and update the delivered services.

### **Enrollment Triggers**

This workflow is based on the **Service** object. A Service record will be enrolled when **ALL** of the following conditions are true:

*   **Service Property: Product Group**
    *   The service's "Product Group" is exactly "radio\_spots".
*   **Service Property: Campaign End Date**
    *   The service's "Campaign End Date" is more than one day in the past (i.e., before yesterday).
*   **Associated Object Property: Payment Type**
    *   The service is associated with an object (e.g., a Deal) where the "Payment Type" is "end\_of\_campaign".

### **Workflow Actions**

Once a service record is enrolled, it will immediately trigger the following action:

*   **Action 1: Send a Webhook**
    *   **Type:** Send a POST request to an external service.
    *   **URL:** `https://n8n.tools.energy/webhook/update-hs-delivered-services`
    *   **Purpose:** This webhook likely notifies an n8n automation to calculate and update the delivered services in HubSpot for the campaign that has just concluded.

### **Settings**

*   **Re-enrollment:** Re-enrollment is **enabled**. This means a service record can enter this workflow multiple times if its properties are updated and meet the trigger criteria again.