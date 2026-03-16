---
title: '1023 | Data-Mgmt | deal | Update product group | Set revenue stream'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635995
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3176880369/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3176880369/edit)
*   **Workflow ID:** 3176880369
*   **Workflow Name:** 1023 | Data-Mgmt | deal | Update product group | Set revenue stream

### Objective

This workflow automates the categorization of deals by setting the 'Revenue Stream' property based on the value of the 'Product Group' property. Its primary goal is to ensure consistent and accurate data for sales and financial reporting. The workflow automatically sets the revenue stream for a deal based on its product group (e.g., audio for classic radio products, digital for social media products).

### Trigger Criteria

*   **Object Type:** Deal
*   **Enrollment:** A deal enrolls in this workflow whenever its 'Product Group' property is set or updated.
*   **Re-enrollment:** Re-enrollment is enabled, meaning the workflow will run every time the 'Product Group' property changes on a deal, ensuring the 'Revenue Stream' is always up-to-date.

### Workflow Steps

1. **Clear Property Value:** The workflow first clears any existing value in the 'Revenue Stream' property. This acts as a reset to ensure the correct new value is applied.
2. **Branching Logic:** The workflow then checks the value of the 'Product Group' property and directs the deal down one of three branches.

*   **Branch 1: Audio**
    *   **If 'Product Group' is one of the following:**
        *   radio\_sponsoing
        *   digital\_spots
        *   media\_partnerships
        *   radio\_spots
        *   audio\_production
        *   promotion
    *   **Then:** The workflow sets the 'Revenue Stream' property to **audio**.
*   **Branch 2: Digital**
    *   **If 'Product Group' is one of the following:**
        *   newsletter
        *   display
        *   subsite
        *   social\_media
    *   **Then:** The workflow sets the 'Revenue Stream' property to **digital**.
*   **Branch 3: Event**
    *   **If 'Product Group' is one of the following:**
        *   energy\_events\_uebrige
        *   energy\_air
        *   vintage\_radio\_night
        *   energy\_star\_night
        *   nrj\_live\_events
        *   energy\_live\_session
        *   energy\_winter\_magic
    *   **Then:** The workflow sets the 'Revenue Stream' property to **event**.

### Outcome

After the workflow completes, the deal's 'Revenue Stream' property will be correctly populated with 'audio', 'digital', or 'event' corresponding to its 'Product Group'. If a deal's 'Product Group' does not match any of the values in the branches, its 'Revenue Stream' property will be left blank.