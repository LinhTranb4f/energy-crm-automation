---
title: '1017 | Data-Mgmt | deal | LineItem contains Event | Set Deal to Need Approval and Offer Type to Event-Partnerschaft'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633395
---

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2769506522/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2769506522/edit)
*   **Workflow ID:** 2769506522
*   **Workflow Name:** 1017 | Data-Mgmt | deal | LineItem contains Event | Set Deal to Need Approval and Offer Type to Event-Partnerschaft

**Purpose**
This workflow automates the process of identifying and flagging deals related to event partnerships. When a deal includes a line item associated with an event, this workflow automatically updates the deal's properties to require approval and categorizes it as an "Event-Partnerschaft" (Event Partnership).

**Trigger and Enrollment**
This is a Deal-based workflow. A deal will be enrolled if it is associated with a Line Item that meets ANY of the following conditions. Re-enrollment is enabled, meaning a deal can re-enter this workflow if its line items are updated or added to meet the criteria again.

*   The associated Line Item's **Name** contains the word "Event".
*   OR the associated Line Item's **Description** contains the word "Event".
*   OR the associated Line Item's **SKU** contains the word "Event".
*   OR the associated Line Item's **Revenue Stream** property is set to "Event".

**Actions**
Once a deal is enrolled, the workflow executes the following actions:

1. **Set Property: Need approval:** The deal property "Need approval" (`need_approval`) is set to "Ja" (Yes).
2. **Set Property: Offer type:** The deal property "Offer type" (`offer_type`) is set to "Event-Partnerschaft".