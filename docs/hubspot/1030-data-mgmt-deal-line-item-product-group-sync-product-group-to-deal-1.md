---
title: '1030 | Data-Mgmt | deal | Line Item Product Group | Sync Product Group to Deal  '
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636455
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3549945053/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3549945053/edit)
*   **Workflow ID:** 3549945053
*   **Workflow Name:** 1030 | Data-Mgmt | deal | Line Item Product Group | Sync Product Group to Deal

### Purpose

This workflow automates data management for Deals. Its primary function is to inspect all Line Items associated with a Deal and synchronize their respective 'Product Group' values into a single, multi-select property on the Deal record itself. This provides a summarized view of all product categories included in a deal, which is useful for reporting and segmentation.

### Trigger and Enrollment

*   **Object Type:** Deal
*   **Trigger:** The workflow is triggered whenever the 'Number of associated line items' property on a Deal is updated. This means it runs every time a line item is added to or removed from a deal.
*   **Re-enrollment:** Re-enrollment is enabled, ensuring that the Deal's product group list is always up-to-date with any changes to its associated line items.

### Workflow Steps

1. **Initialize Property:** The workflow begins by clearing any existing values from the 'Product Group' property on the Deal. This is a critical reset step that ensures the list is accurately rebuilt from scratch each time the workflow runs.
2. **Iterative Checks:** The workflow then proceeds through a series of sequential if/then branches. Each branch checks if the Deal has at least one associated Line Item with a specific 'Product Group' value.
3. **Append Values:** If a match is found in a branch, the corresponding product group value is appended to the Deal's 'Product Group' property. The workflow then continues to the next check, regardless of whether a match was found or not. This process ensures that if a deal contains line items from multiple product groups, all of those groups are added to the deal's summary property.

### Product Groups Checked by the Workflow

The workflow checks for and syncs the following product groups from Line Items to the Deal:

*   radio\_spots
*   digital\_spots
*   promotion
*   media\_partnerships
*   audio\_production
*   radio\_sponsoing
*   subsite
*   display
*   nrj\_live\_events
*   social\_media
*   podcast
*   partnerschip\_options
*   newsletter
*   energy\_air
*   energy\_star\_night
*   energy\_live\_session
*   energy\_winter\_magic
*   vintage\_radio\_night
*   event\_Partnerschip\_options
*   energy\_events\_uebrige

### Outcome

After the workflow completes, the 'Product Group' field on the Deal record will contain a comprehensive list of all unique product groups represented by its associated line items. This provides an accurate, at-a-glance summary for sales and reporting purposes.