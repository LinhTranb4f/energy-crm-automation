---
title: '1033 | Data-Mgmt | Services | Service in "Open" for more than 3 days | send escalation mail to defined supervisor or team lead'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634235
---

### Summary

*   Workflow URL: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3556513014/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3556513014/edit)
*   Workflow ID: 3556513014
*   Workflow Name: 1033 | Data-Mgmt | Services | Service in "Open" for more than 3 days | send escalation mail to defined supervisor or team lead

### Purpose

This workflow automatically monitors custom "Service" objects. If a Service remains in the "Open" pipeline stage for more than three days, it sends an escalation email notification to the manager associated with that service, prompting them to review the stalled item.

### Enrollment Triggers

This workflow enrolls a "Service" object when all of the following conditions are met:

*   **Object Type:** Service (Custom Object)
*   **Pipeline Stage:** The Service's pipeline stage is "Open" (Stage ID: 8e2b21d0-7a90-4968-8f8c-a8525cc49c70).
*   **Time in Stage:** The date the Service entered the "Open" stage was more than 3 days ago.
*   **Current Status:** The Service has not exited the "Open" stage.

### Actions

**Action 1: Send Internal Escalation Email**

*   **Type:** Send internal email notification.
*   **Recipient:** The email is sent to the person specified in the "Manager" property of the enrolled Service object.
*   **Email Subject (Original):** `Reminder: {{ enrolled_object.hs_name }} seit {{ enrolled_object.hs_v2_date_entered_8e2b21d0_7a90_4968_8f8c_a8525cc49c70_271337944 }} in {{ enrolled_object.hs_pipeline_stage }}`
*   **Email Subject (Translated):** `Reminder: [Service Name] since [Date Entered Open Stage] in [Pipeline Stage]`
*   **Email Body (Original):** \`Hallo {{ enrolled\_object.manager }}

Der Service von {{ enrolled\_object.hubspot\_owner\_id }} ist seit {{ enrolled\_object.hs\_v2\_date\_entered\_8e2b21d0\_7a90\_4968\_8f8c\_a8525cc49c70\_271337944 }} in der Phase {{ enrolled\_object.hs\_pipeline\_stage }} und sollte überprüft werden.\`

*   **Email Body (Translated):** \`Hello \[Manager Name\]

The service of \[Service Owner\] has been in the \[Pipeline Stage\] phase since \[Date Entered Open Stage\] and should be reviewed.\`

### Settings

*   **Re-enrollment:** Disabled. A Service can only trigger this workflow once.