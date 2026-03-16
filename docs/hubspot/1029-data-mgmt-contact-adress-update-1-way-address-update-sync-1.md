---
title: '1029 | Data-Mgmt | contact | Adress Update | 1-way Address Update Sync'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636335
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3330828514/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3330828514/edit)
*   **Workflow ID:** 3330828514
*   **Workflow Name:** 1029 | Data-Mgmt | contact | Adress Update | 1-way Address Update Sync

### Purpose

This workflow automates the synchronization of contact address and information updates from HubSpot to an external system named Delfin. It ensures that when key contact details are modified in HubSpot, the changes are immediately pushed to the external system. This is a one-way data sync.

### Trigger (When a contact is enrolled)

The workflow is event-based and enrolls a contact record when any of its specified properties are updated.

*   **Enrollment Condition:** A contact is enrolled when **ANY** of the following properties are updated and the new value is not empty:
    *   Name
    *   Original Country
    *   Zip
    *   Phone
    *   City
    *   E-mail
    *   Website
    *   Address
*   **Re-enrollment:** Re-enrollment is enabled. This means a contact will re-trigger the workflow every time one of the listed properties is changed.

### Action(s) (What the workflow does)

Once a contact is enrolled, the workflow immediately performs a single action:

*   **Send Webhook:** It sends updated contact data via a `POST` request to a webhook.
    *   **Endpoint URL:** `https://n8n.tools.energy/webhook/sync-address-to-delfin`
    *   **Integration:** This endpoint belongs to an n8n automation platform, which acts as a middle-layer to process the data and update the Delfin system.

### Data Flow

The data flows in a single direction:
HubSpot Contact Update → n8n Webhook → Delfin System

### Dependencies

*   The n8n webhook endpoint must be active and correctly configured to receive and process data from this HubSpot workflow.
*   The target system, Delfin, must be accessible by the n8n automation.