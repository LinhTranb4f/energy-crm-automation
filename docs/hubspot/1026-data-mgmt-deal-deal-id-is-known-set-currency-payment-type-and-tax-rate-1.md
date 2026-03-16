---
title: '1026 | Data-Mgmt | deal | Deal ID is known | set currency, payment type and tax rate'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636135
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3232533751/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3232533751/edit)
*   **Workflow ID:** 3232533751
*   **Workflow Name:** 1026 | Data-Mgmt | deal | Deal ID is known | set currency, payment type and tax rate

### Purpose

This workflow is designed for data management on Deal records. It automatically sets default values for the Currency, Tax Rate, and Payment Type (Billing Cycle) properties on new deals, but only if these properties do not already have a value. This ensures data consistency and completeness for financial reporting.

### Trigger

*   **Object Type:** Deals
*   **Trigger Type:** The workflow enrolls a deal when a specific event occurs (likely Deal Creation).
*   **Re-enrollment:** Re-enrollment is turned OFF. A deal can only go through this workflow once.

### Workflow Steps

**1\. Check Deal Currency**

*   The workflow first checks if the 'Deal Currency Code' property has a known value.
*   **If the currency is unknown:** It sets the 'Deal Currency Code' to **CHF**.
*   **If the currency is already known:** It proceeds to the next step.

**2\. Check Tax Rate**

*   Next, it checks if the 'Tax Rate' property has a known value.
*   **If the tax rate is unknown:** It sets the 'Tax Rate' to **E1**.
*   **If the tax rate is already known:** It proceeds to the next step.

**3\. Check Deal Pipeline**

*   The workflow then checks which pipeline the deal belongs to.
*   **If the deal is in pipeline ID '2704947401':** The workflow ends for this deal.
*   **If the deal is in any other pipeline:** It proceeds to the final step.

**4\. Check Payment Type (Billing Cycle)**

*   Finally, the workflow checks if the 'Billing Cycle' property has a known value.
*   **If the billing cycle is unknown:** It sets the 'Billing Cycle' to **end\_of\_campaign**.
*   **If the billing cycle is already known:** The workflow ends.