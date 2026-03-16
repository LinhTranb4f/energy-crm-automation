---
title: '2051 | Delfin | Service Stage is set to “To Plan" | Send webhook to Create/ Update Order & customer details in Delfin'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634075
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3385144547/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3385144547/edit)
*   **Workflow ID:** 3385144547
*   **Workflow Name:** 2051 | Delfin | Service Stage is set to “To Plan" | Send webhook to Create/ Update Order & customer details in Delfin

### Objective

This workflow automates the creation or update of orders and customer details in an external system (Delfin) via a webhook. It triggers when a service reaches the "To Plan" stage for a specific product, but only if an order ID from the Delfin system does not already exist.

### Enrollment Triggers

A record is enrolled in this workflow when **ALL** of the following conditions are met:

*   The Service Stage is set to "To Plan" (Pipeline Stage ID: 3563873492).
*   The Product Group is "Radio Spots".
*   The "Delfin Order ID" property is unknown (has no value).

### Workflow Actions

Once a record is enrolled, the workflow proceeds as follows:

1. **Delay:** The workflow waits for 1 minute.
2. **If/then Branch:** The workflow checks a condition.
    *   **Condition:** Is the "Delfin Order ID" property still unknown?
    *   **If YES (Delfin Order ID is unknown):**
        *   **Action:** A webhook is sent.
        *   **Method:** POST
        *   **URL:** `https://n8n.tools.energy/webhook/push-service-to-Delfin`
        *   **Purpose:** This action sends data to the Delfin system to create a new order and associated customer details.
    *   **If NO (Delfin Order ID is known):**
        *   The workflow ends, and no further action is taken.

### Re-enrollment

*   Re-enrollment is turned **OFF** for this workflow. A record can only go through this workflow once, even if it meets the trigger criteria again.