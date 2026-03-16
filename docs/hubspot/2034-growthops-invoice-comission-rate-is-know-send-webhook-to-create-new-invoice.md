---
title: '2034 | GrowthOps | invoice | Comission rate is know | send webhook to create new invoice record "credit note"'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633895
---

**Summary**

*   Workflow URL: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3265171695/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3265171695/edit)
*   Workflow ID: 3265171695
*   Workflow Name: 2034 | GrowthOps | invoice | Comission rate is know | send webhook to create new invoice record "credit note"

**Purpose**
This workflow automates the creation of a credit note in an external system. It triggers when the commission rate for an Invoice record in HubSpot is known or updated. Upon triggering, it sends a webhook to an n8n automation endpoint to initiate the creation of the credit note.

**Object Type**

*   This workflow is based on the **Invoice** custom object.

**Trigger Conditions**
An Invoice record will be enrolled in this workflow if it meets the following criteria:

*   **Initial Enrollment:**
    *   The record's 'Record Type' property is 'Invoice'.
    *   AND
    *   The record's 'Commission Rate' property has any value (is known).
*   **Re-enrollment:**
    *   Re-enrollment is enabled for this workflow.
    *   A record will re-enroll each time its 'Commission Rate' property is updated with a new value.

**Workflow Actions**

*   **Action 1: Send a POST Webhook**
    *   This is the only action in the workflow.
    *   **Endpoint URL:** `https://n8n.tools.energy/webhook/create-commission-invoice-queue`
    *   **Method:** POST
    *   **Authentication:** The request is authenticated using a secret key sent in the 'Authorization' header.
    *   **Purpose:** This action sends the enrolled Invoice record's data to an n8n automation. The endpoint name suggests the data is added to a queue to create a corresponding commission invoice or credit note record.