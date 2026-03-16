---
title: '1033 | Data-Mgmt | Services | Service in "Open" for more than 3 days | send escalation mail to defined supervisor or team lead'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-636555
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3556513014/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3556513014/edit)
*   **Workflow ID:** 3556513014
*   **Workflow Name:** 1033 | Data-Mgmt | Services | Service in "Open" for more than 3 days | send escalation mail to defined supervisor or team lead

### Goal

This workflow automatically sends an escalation email to a supervisor or team lead when a "Service" record remains in the "Open" stage for more than three days. The purpose is to prevent service tickets from becoming stagnant and ensure they receive timely attention.

### Enrollment Triggers

A Service record is enrolled in this workflow if it meets ALL of the following criteria:

*   The Service's pipeline stage is "Open" (Internal ID: 8e2b21d0-7a90-4968-8f8c-a8525cc49c70).
*   The date the Service entered the "Open" stage was more than 3 days ago.
*   The Service has not yet exited the "Open" stage (the exit date property is empty).

### Workflow Actions

Once a Service is enrolled, the following action occurs immediately:

*   **Action 1: Send Internal Email Notification**
    *   **Recipient:** The "Manager" associated with the HubSpot Owner of the Service record.
    *   **Email Subject (German):** `Reminder: {{ enrolled_object.hs_name }} seit {{ enrolled_object.hs_v2_date_entered_8e2b21d0_7a90_4968_8f8c_a8525cc49c70_271337944 }} in {{ enrolled_object.hs_pipeline_stage }}`
    *   **Email Subject (Example):** Reminder: New Server Installation since 2026-01-15 in Open
    *   **Email Body (German):**
        *   Hallo {{ enrolled\_object.manager }}
        *   Der Service von {{ enrolled\_object.hubspot\_owner\_id }} ist seit {{ enrolled\_object.hs\_v2\_date\_entered\_8e2b21d0\_7a90\_4968\_8f8c\_a8525cc49c70\_271337944 }} in der Phase {{ enrolled\_object.hs\_pipeline\_stage }} und sollte überprüft werden.
    *   **Email Body (Translated to English):**
        *   Hello {{ Manager Name }},
        *   The service from {{ HubSpot Owner }} has been in the {{ Pipeline Stage }} phase since {{ Date Entered 'Open' Stage }} and should be reviewed.

### Settings

*   **Re-enrollment:** Disabled. A service record will only trigger this workflow once unless it leaves the "Open" stage and then re-enters it, meeting the criteria again.