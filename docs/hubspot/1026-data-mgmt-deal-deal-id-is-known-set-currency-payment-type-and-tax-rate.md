---
title: '1026 | Data-Mgmt | deal | Deal ID is known | set currency, payment type and tax rate'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633815
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3232533751/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3232533751/edit)
*   **Workflow ID:** 3232533751
*   **Workflow Name:** 1026 | Data-Mgmt | deal | Deal ID is known | set currency, payment type and tax rate

### Workflow Goal

This workflow automates data management for new Deals. Its primary purpose is to ensure that essential financial properties (Currency, Tax Rate, and Payment Type) are populated with default values if they are not set when a deal is created.

### Enrollment Trigger

*   **Object Type:** Deal
*   **Trigger:** A Deal is enrolled in this workflow as soon as its Deal ID is known, which effectively means it triggers upon Deal creation.

### Workflow Logic & Steps

**Step 1: Check and Set Currency**

*   The workflow first checks if the 'Deal Currency' property has a value.
*   **If NO (Currency is unknown):** It sets the 'Deal Currency' property to **CHF**.
*   **If YES (Currency is known):** It proceeds to the next step.

**Step 2: Check and Set Tax Rate**

*   The workflow then checks if the 'Tax Rate' property has a value.
*   **If NO (Tax Rate is unknown):** It sets the 'Tax Rate' property to **E1**.
*   **If YES (Tax Rate is known):** It proceeds to the next step.

**Step 3: Pipeline Exclusion Check**

*   The workflow checks which pipeline the Deal belongs to.
*   **If the Deal is in pipeline '2704947401':** The workflow ends for this Deal.
*   **For all other pipelines:** The workflow continues to the final step.

**Step 4: Check and Set Payment Type**

*   Finally, the workflow checks if the 'Billing Cycle' (Payment Type) property has a value.
*   **If NO (Payment Type is unknown):** It sets the 'Billing Cycle' property to **end\_of\_campaign**.
*   **If YES (Payment Type is known):** The workflow ends.

**Step 5: End of Workflow**

*   Once all checks and necessary property updates are complete, the workflow finishes.