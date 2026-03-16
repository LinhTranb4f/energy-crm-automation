---
title: '1035 | Data-Mgmt | Services | record created and in stage "open" | assign to owner and send internal notification'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634255
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3566379197/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3566379197/edit)
*   **Workflow ID:** 3566379197
*   **Workflow Name:** 1035 | Data-Mgmt | Services | record created and in stage "open" | assign to owner and send internal notification

### Objective

This workflow automates the assignment and initial notification for new 'Service' records. When a Service record is created and placed in the 'Open' stage for specific product groups, it is automatically assigned to a designated owner, and an internal notification is sent to inform them of the new assignment.

### Enrollment Criteria

This workflow triggers and enrolls a 'Service' object when all the following conditions are met:

*   The Service record has just been created.
*   The Service record's pipeline stage is 'Open' (ID: 8e2b21d0-7a90-4968-8f8c-a8525cc49c70).
*   The 'Product Group' property is either 'Audio Production' or 'Social Media'.

_Note: Records can only be enrolled in this workflow once and will not re-enroll if they meet the criteria again._

### Workflow Actions

The workflow begins with an If/Then branch that checks the 'Product Group' property of the Service record.

#### Branch 1: If Product Group is 'Audio Production'

*   **Action 1: Assign Owner**
    *   The 'HubSpot Owner' property of the Service record is set to a specific user (User ID: 67115507).
*   **Action 2: Send Internal Notification**
    *   An internal email notification is sent to the newly assigned owner.
    *   **Subject:** Neuer Service {{ Service Name }} ist erstellt
    *   **Body:** The email informs the owner of the new assignment and includes key details using personalization tokens:
        *   Project ID
        *   Service ID
        *   Service Name
        *   Campaign Start Date
        *   Campaign End Date

#### Branch 2: If Product Group is 'Social Media'

*   **Action 1: Assign Owner**
    *   The 'HubSpot Owner' property of the Service record is set to the same specific user (User ID: 67115507).
*   **Action 2: Send Internal Notification**
    *   An identical internal email notification is sent to the newly assigned owner, with the same subject and body content as the 'Audio Production' branch.