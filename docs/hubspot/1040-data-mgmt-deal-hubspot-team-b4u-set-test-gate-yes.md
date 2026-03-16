---
title: '1040 | Data-Mgmt | deal | HuBSpot Team = B4U | set Test Gate = Yes'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634895
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3835945164/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3835945164/edit)
*   **Workflow ID:** 3835945164
*   **Workflow Name:** 1040 | Data-Mgmt | deal | HuBSpot Team = B4U | set Test Gate = Yes

### Purpose

This workflow is designed for data management. Its function is to automatically identify and flag specific deals as test records. This helps in segmenting data for reporting and preventing test deals from skewing metrics.

### Object Type

*   This is a **Deal-based** workflow. It only enrolls and acts upon Deal records.

### Enrollment Triggers

A deal will be enrolled in this workflow if it meets the following criteria:

*   The **HubSpot Team** property is any of the following teams:
    *   business4you (ID: 62538013)
    *   Dev. b4you (ID: 172412851)

### Workflow Actions

Once a deal is enrolled, the workflow performs a single action:

*   **Set Property Value:** It sets the deal property **Test Record B4You** (`test_record_b4you`) to the value **Yes**.

### Re-enrollment

*   Re-enrollment is **disabled**. A deal can only be processed by this workflow once, even if its properties change and meet the criteria again later.