---
title: '1016 | Data-Mgmt | company | Industry is unknown | send webhook for mapping WF in n8n'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633295
---

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2720574689/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2720574689/edit)
*   **Workflow ID:** 2720574689
*   **Workflow Name:** 1016 | Data-Mgmt | company | Industry is unknown | send webhook for mapping WF in n8n

**Objective**
This workflow is a data management process designed to integrate HubSpot with an external automation platform (n8n). Its primary purpose is to send a real-time notification whenever the "Industry" field for a company record is updated with a new, valid value. This allows the external system to perform subsequent actions, such as data mapping or synchronization.

**Trigger and Enrollment**
This workflow activates for a company record when the following conditions are met:

*   **Object Type:** Company
*   **Trigger Event:** A property value is changed on the company record.
*   **Trigger Conditions:**
    *   The property that changed is **Industry**.
    *   The new value of the **Industry** property **is known** (i.e., it is not empty).
*   **Re-enrollment:** Re-enrollment is enabled. This means a company will re-enter this workflow every time its industry is updated from an unknown value to a known value, or from one known value to another.

**Workflow Actions**
Once a company is enrolled, the workflow executes the following single action:

*   **Action 1: Send a Webhook**
    *   **Type:** POST Webhook
    *   **Destination URL:** `https://energy-n8n.business4you.ch/webhook/check-company-industry-change`
    *   **Purpose:** This action sends a notification to an n8n workflow. The n8n system is expected to receive this trigger to process the company's industry change, likely for data mapping, enrichment, or synchronization with other systems.