---
title: '1016 | Data-Mgmt | company | Industry is unknown | send webhook for mapping WF in n8n'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635615
---

**Summary:**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2720574689/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2720574689/edit)
*   **Workflow ID:** 2720574689
*   **Workflow Name:** 1016 | Data-Mgmt | company | Industry is unknown | send webhook for mapping WF in n8n

### **Objective**

This workflow is designed for data management. Its primary purpose is to send a notification to an external system (n8n) whenever the "Industry" property for a company record is updated from an unknown state to a known value. This allows for automated data mapping and processing outside of HubSpot.

### **Trigger (Enrollment Criteria)**

This is an event-based workflow that enrolls **Company** records.

*   **Trigger Event:** A company record is enrolled when one of its properties is changed.
*   **Conditions:** The workflow will only start if the following conditions are met:
    *   The specific property that was changed is "Industry".
    *   The new value for the "Industry" property is known (i.e., it is not empty).
*   **Re-enrollment:** Re-enrollment is enabled. This means a company can trigger this workflow every time its "Industry" property is updated to a new known value.

### **Actions**

Once a company is enrolled, the workflow executes a single action:

*   **Action 1: Send a Webhook**
    *   **Method:** POST
    *   **Webhook URL:** [https://energy-n8n.business4you.ch/webhook/check-company-industry-change](https://energy-n8n.business4you.ch/webhook/check-company-industry-change)
    *   **Purpose:** This action sends data to an n8n automation webhook. The n8n workflow is expected to receive this notification and perform a mapping or data validation task related to the company's newly updated industry.