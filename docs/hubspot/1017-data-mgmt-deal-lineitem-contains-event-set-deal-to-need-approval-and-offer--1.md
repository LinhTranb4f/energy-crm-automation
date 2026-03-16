---
title: '1017 | Data-Mgmt | deal | LineItem contains Event | Set Deal to Need Approval and Offer Type to Event-Partnerschaft'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635715
---

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2769506522/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2769506522/edit)
*   **Workflow ID:** 2769506522
*   **Workflow Name:** 1017 | Data-Mgmt | deal | LineItem contains Event | Set Deal to Need Approval and Offer Type to Event-Partnerschaft

**Workflow Goal**
This workflow automates the process of flagging deals related to events for internal review. When a deal includes a line item associated with an "Event", this workflow automatically updates two key deal properties to require approval and to categorize its offer type correctly.

**Enrollment Triggers**
A Deal will be enrolled in this workflow if it is associated with a Line Item that meets **ANY** of the following criteria:

*   The Line Item's **Name** contains the word "Event".
*   The Line Item's **Description** contains the word "Event".
*   The Line Item's **SKU** contains the word "Event".
*   The Line Item's **Revenue Stream** property is set to "Event".

**Re-enrollment**
Re-enrollment is turned ON. This means a deal can re-enter this workflow if it meets the trigger criteria again after having completed it previously.

**Actions**
Once a deal is enrolled, the workflow performs the following actions in order:

1. **Set "Need Approval" Property:** The deal property `Need approval` is set to `Yes` (true).
2. **Set "Offer Type" Property:** The deal property `Offer type` is set to `Event-Partnerschaft`.