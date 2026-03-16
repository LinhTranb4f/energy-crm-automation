---
title: 'Invoice Created Trigger (Failed)'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633475
---

**Summary:**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3028610279/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3028610279/edit)
*   **Workflow ID:** 3028610279
*   **Workflow Name:** Invoice Created Trigger (Failed)

### **Status**

Inactive

### **Overview**

This workflow is a failed Proof of Concept (POC) designed to trigger when a new invoice is created in HubSpot. The original goal was to sync a source invoice to a clone invoice, likely by sending data to an external system (n8n) for processing.

### **Trigger Conditions (Who gets enrolled?)**

This workflow is based on the **Invoice object** and enrolls an invoice only when the following event and property conditions are met:

*   A custom behavioral event, likely "Invoice Created," has been completed.
*   **AND** the following properties on the invoice are true:
    *   The "Invoice Source" is "Native Invoice".
    *   The "Object Source" is either "CRM UI" (created manually by a user) or "Clone Objects" (cloned from another invoice).

### **Re-enrollment**

*   Re-enrollment is turned **OFF**. An invoice can only be enrolled in this workflow once.

### **Actions (What happens to them?)**

If an invoice meets the trigger criteria, the workflow will immediately perform the following single action:

*   **Send a Webhook:**
    *   **Method:** POST
    *   **URL:** `https://n8n.tools.energy/webhook/update-invoice-queue`
    *   **Purpose:** To send the new invoice's data to an external automation platform (n8n) to be added to an "update invoice queue" for further processing.
    *   **Authentication:** The request includes a secret Authorization key in the header to securely communicate with the receiving system.