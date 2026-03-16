---
title: '1023 | Data-Mgmt | deal | Update product group | Set revenue stream'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633675
---

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3176880369/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3176880369/edit)
*   **Workflow ID:** 3176880369
*   **Workflow Name:** 1023 | Data-Mgmt | deal | Update product group | Set revenue stream

**Workflow Goal**
This workflow automates data management for deals. Its primary purpose is to set the 'Revenue Stream' property on a deal record based on the value of its 'Product Group' property. This ensures consistent and accurate categorization of deals for reporting and analysis.

**Enrollment Triggers**
A deal is enrolled in this workflow under the following conditions:

*   The deal's 'Product Group' property is set or updated.
*   The workflow allows for re-enrollment, meaning that if a deal's 'Product Group' is changed, it will run through this workflow again to ensure the 'Revenue Stream' is updated accordingly.

**Workflow Steps**

1. **Clear Existing Value:** The workflow first clears any existing value in the 'Revenue Stream' property. This acts as a reset to ensure the correct new value is applied.
2. **If/Then Branch Logic:** The workflow then checks the value of the 'Product Group' property and directs the deal down one of three branches.
    *   **Branch 1: Audio**
        *   **Condition:** The 'Product Group' is one of the following:
            *   radio\_sponsoing
            *   digital\_spots
            *   media\_partnerships
            *   radio\_spots
            *   audio\_production
            *   promotion
        *   **Action:** If the condition is met, the workflow sets the 'Revenue Stream' property to **audio**.
    *   **Branch 2: Digital**
        *   **Condition:** The 'Product Group' is one of the following:
            *   newsletter
            *   display
            *   subsite
            *   social\_media
        *   **Action:** If the condition is met, the workflow sets the 'Revenue Stream' property to **digital**.
    *   **Branch 3: Event**
        *   **Condition:** The 'Product Group' is one of the following:
            *   energy\_events\_uebrige
            *   energy\_air
            *   vintage\_radio\_night
            *   energy\_star\_night
            *   nrj\_live\_events
            *   energy\_live\_session
            *   energy\_winter\_magic
        *   **Action:** If the condition is met, the workflow sets the 'Revenue Stream' property to **event**.

**End Result**
After the workflow completes, the deal's 'Revenue Stream' property is correctly categorized as either 'audio', 'digital', or 'event', depending on its specific 'Product Group'. This maintains data integrity and supports streamlined business reporting.