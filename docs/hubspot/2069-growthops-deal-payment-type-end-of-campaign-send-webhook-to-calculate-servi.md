---
title: '2069 | GrowthOps | deal | payment type = end of campaign | send webhook to calculate service for end of campaign '
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-620295
---

**Summary**

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3647093957/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3647093957/edit)
*   **Workflow ID**: 3647093957
*   **Workflow Name**: 2069 | GrowthOps | deal | payment type = end of campaign | send webhook to calculate service for end of campaign

### **Objective**

This workflow automates the invoicing process for deals that are billed at the end of a campaign. When a qualifying deal meets specific criteria, this workflow triggers an external system (n8n) via a webhook to calculate the final service costs and generate an invoice.

### **Enrollment Triggers**

A deal is automatically enrolled in this workflow when **all** of the following conditions are met:

*   **Pipeline**: The deal is in the pipeline with ID `3387257046`.
*   **Billing Cycle**: The deal's "Billing Cycle" property is set to "End of campaign".
*   **Campaign End Date**: The deal's "Campaign End" date is on or after tomorrow.
*   **Open Service Records**: The deal's "Service Records Open" property is equal to `0`.
*   **Associated Services**: The deal has more than `0` associated services (i.e., at least one service is attached).

### **Re-enrollment**

Deals can re-enroll in this workflow if they meet the enrollment criteria again. Re-enrollment is specifically triggered when any of the following properties are updated:

*   The "Service Records Open" property is changed to `0`.
*   The "Billing Cycle" property is changed to "End of campaign".
*   The "Pipeline" property is changed to the pipeline with ID `3387257046`.

### **Workflow Actions**

Once a deal is enrolled, it immediately undergoes the following action:

*   **Action 1: Send Webhook to n8n**
    *   **Type**: A `POST` request is sent to an external service.
    *   **URL**: `https://n8n.tools.energy/webhook/create-end-of-campaign-invoice`
    *   **Purpose**: This webhook triggers an automation in n8n (an automation tool) to calculate the final service costs and create the corresponding invoice for the deal. The request is authenticated using a secret key in the `Authorization` header.