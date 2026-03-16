---
title: '2051 | Delfin | Service Stage is set to “To Plan" | Send webhook to Create/ Update Order & customer details in Delfin'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636395
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3385144547/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3385144547/edit)
*   **Workflow ID:** 3385144547
*   **Workflow Name:** 2051 | Delfin | Service Stage is set to “To Plan" | Send webhook to Create/ Update Order & customer details in Delfin

### Purpose

This workflow automates the process of creating or updating order and customer details in an external system called "Delfin". It is triggered when a service record for "Radio Spots" is moved to the "To Plan" stage in HubSpot and does not yet have an order ID from the Delfin system.

### Trigger and Enrollment Criteria

A record is enrolled in this workflow when it is updated and meets **ALL** of the following criteria:

*   **Service Stage:** The record's pipeline stage is set to "To Plan".
*   **Product Group:** The product associated with the record is "Radio Spots".
*   **Delfin Order ID:** The "Delfin Order ID" property is empty.

### Re-enrollment

*   Re-enrollment is turned **OFF**. A record can only go through this workflow once.

### Workflow Actions

Once a record is enrolled, the following actions occur in sequence:

**1\. Delay**

*   The workflow waits for **1 minute** before proceeding to the next step.

**2\. If/Then Branch: Check Delfin Order ID**

*   The workflow checks the "Delfin Order ID" property again.
*   **Branch 1: Delfin Order ID is unknown**
    *   If the "Delfin Order ID" property is still empty, the workflow proceeds with this action.
    *   **Action:** Send a webhook to an external system.
        *   **Method:** POST
        *   **Webhook URL:** `https://n8n.tools.energy/webhook/push-service-to-Delfin`
        *   **Purpose:** This webhook sends the record's data to an n8n automation, which then creates or updates the corresponding order and customer details in the Delfin system.
*   **Branch 2: Delfin Order known**
    *   If the "Delfin Order ID" property now has a value (e.g., it was populated during the 1-minute delay), no further action is taken, and the record exits the workflow.