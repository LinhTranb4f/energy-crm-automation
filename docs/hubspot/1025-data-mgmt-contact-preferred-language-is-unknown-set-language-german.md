---
title: '1025 | Data-Mgmt | contact | preferred language is unknown | set language German'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633755
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3221564641/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3221564641/edit)
*   **Workflow ID:** 3221564641
*   **Workflow Name:** 1025 | Data-Mgmt | contact | preferred language is unknown | set language German

### Purpose

This workflow is a data management tool designed to maintain data hygiene. It automatically sets the preferred language to German for any contact record where this information is currently missing or unknown.

### Trigger / Enrollment Criteria

*   **Object Type:** Contact
*   **Conditions:** A contact will be enrolled in this workflow if their "Preferred Language" (hs\_language) property has no value (is unknown).
*   **Re-enrollment:** Re-enrollment is enabled. This means if a contact's language is set to German by this workflow and is later cleared or deleted, the contact will enter the workflow again to have the language reset to German.

### Workflow Actions

*   **Step 1: Set Property Value**
    *   **Action:** The workflow updates a property on the enrolled contact record.
    *   **Property to Update:** Preferred Language (hs\_language)
    *   **New Value:** The property is set to "German" (de).