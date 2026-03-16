---
title: '1025 | Data-Mgmt | contact | preferred language is unknown | set language German'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636075
---

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3221564641/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3221564641/edit)
*   **Workflow ID:** 3221564641
*   **Workflow Name:** 1025 | Data-Mgmt | contact | preferred language is unknown | set language German

**Workflow Goal**
This workflow automates a data management task for contacts. Its primary purpose is to ensure that contacts have a specified preferred language. It identifies any contact record where the 'Preferred language' property is not set and defaults it to German.

**Enrollment Triggers (Who gets enrolled?)**

*   **Object Type:** Contact
*   **Trigger Criteria:** A contact is enrolled in this workflow if their 'Preferred language' (hs\_language) property is unknown.
*   **Re-enrollment:** Re-enrollment is turned ON. This means if a contact's preferred language is later cleared or set back to unknown for any reason, they will be enrolled in this workflow again to have it reset to German.

**Workflow Actions (What happens to them?)**

*   **Action 1: Set Property Value**
    *   The workflow performs a single action on the enrolled contact.
    *   **Property to be changed:** Preferred language (hs\_language)
    *   **New Value:** The property is set to 'de' (German).