---
title: '2040 | GrowthOps | deal | Pipeline Phase = Order Clarification or Order confirmed | Create Service & Radio Spots'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634615
---

### Summary

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3644805358/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3644805358/edit)
*   **Workflow ID**: 3644805358
*   **Workflow Name**: 2040 | GrowthOps | deal | Pipeline Phase = Order Clarification or Order confirmed | Create Service & Radio Spots

### Purpose

This workflow automates the initial setup process for new orders. When a sales deal reaches the final confirmation stages, this workflow triggers an external system (n8n) to automatically create the necessary "Service" and "Radio Spot" items, ensuring a smooth handoff from sales to operations.

### Object Type

This is a **Deal-based** workflow.

### Enrollment Triggers

A deal is enrolled in this workflow when its stage is updated to one of the following:

*   **Order Clarification** (ID: 4636861648)
*   **Order confirmed** (ID: 4636861649)

**Re-enrollment:** Re-enrollment is enabled. This means a deal will re-enter the workflow every time its stage is changed to one of the trigger stages.

### Workflow Actions

Once a deal is enrolled, the following actions occur in sequence:

1. **Delay:** The workflow waits for **1 minute**. This brief delay can help ensure all deal properties are fully saved and synced before the next step.
2. **Trigger External System via Webhook:**
    *   **Action:** The workflow sends deal data via a POST request to an external automation platform (n8n).
    *   **Webhook URL:** `https://n8n.tools.energy/webhook/create-service-and-spot`
    *   **Outcome:** This webhook triggers a process in the external system to create the "Service" and "Radio Spot" items associated with the deal. The communication is secured with an authorization key.