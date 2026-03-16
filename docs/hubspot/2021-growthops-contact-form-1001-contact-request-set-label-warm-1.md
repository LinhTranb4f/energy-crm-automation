---
title: '2021 | GrowthOps | contact | Form 1001 contact Request | set label warm'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635175
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2480599242/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2480599242/edit)
*   **Workflow ID:** 2480599242
*   **Workflow Name:** 2021 | GrowthOps | contact | Form 1001 contact Request | set label warm

### **Objective**

This contact-based workflow is designed to automate the process of qualifying and updating contacts immediately after they submit the 'Form 1001 contact Request'. It sets key properties to classify them as a high-priority lead and updates their pipeline status.

### **Enrollment Triggers**

*   **Primary Trigger:** A contact is enrolled in this workflow when they submit the form with ID `89122a36-69d1-4d61-8611-484fac02363e`.
*   **Re-enrollment:** Re-enrollment is enabled. This means a contact can be processed by this workflow every time they submit the specified form.

### **Workflow Actions**

Upon enrollment, a single action step immediately updates the contact record:

*   **Set Property 'Lead Label':** The contact's 'Lead Label' property is set to **HOT**.
*   **Set Property 'Pipeline Stage':** The contact's 'Pipeline Stage' is moved to a new stage identified by the ID `new-stage-id`.
*   **Update Associations:** The workflow also manages the contact's associations, ensuring it is correctly linked to other records (like deals or tickets) and that its primary company association is properly copied.