---
title: '2038 | GrowthOps | invoice | bulk move invoices from QA to Sent Invoice'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636315
---

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3322479854/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3322479854/edit)
*   **Workflow ID:** 3322479854
*   **Workflow Name:** 2038 | GrowthOps | invoice | bulk move invoices from QA to Sent Invoice

**Workflow Purpose**
This workflow is designed to initiate an external automated process for bulk-updating the status of Invoice records. It triggers a webhook to an n8n automation when invoices need to be moved from a "QA" (Quality Assurance) stage to a "Sent Invoice" stage.

**Enrollment Trigger**

*   **Trigger Type:** Manual Enrollment. This workflow does not run automatically based on property changes. It must be triggered manually by a user for a specific list of records.
*   **Object Type:** Invoice (Custom Object ID: 0-53)
*   **Re-enrollment:** Enabled. A single invoice record can be enrolled in this workflow multiple times if needed.

**Workflow Actions**

### Action 1: Send Data to External System

*   **Action Type:** Trigger a webhook.
*   **Purpose:** To notify an external automation tool (n8n) that a batch of invoices is ready to have their status updated. This external tool contains the logic for performing the status change.
*   **Method:** POST
*   **Webhook URL:** [https://n8n.tools.energy/webhook/update-hs-invoice-state-queue](https://n8n.tools.energy/webhook/update-hs-invoice-state-queue)
*   **Authentication:** The request is secured using an "Authorization" key sent in the header.

**Operational Use Case**
A team member (e.g., from Finance or Operations) will compile a list of Invoice records in HubSpot that have passed the quality assurance process. The user will then select this list and manually enroll them into this workflow. Upon enrollment, the workflow immediately sends a POST request to the specified n8n webhook, which in turn queues a job to update the status of those invoices to "Sent Invoice".