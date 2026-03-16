---
title: '2067 | GrowthOps | Service | Branded Content File Uploaded | Move Service Stage to "Content in Approval"'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634555
---

### Workflow Documentation

**Summary**

*   **Workflow URL**: [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3612574950/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3612574950/edit)
*   **Workflow ID**: 3612574950
*   **Workflow Name**: 2067 | GrowthOps | Service | Branded Content File Uploaded | Move Service Stage to "Content in Approval"

### **Objective**

This workflow automates the initial stage of the content approval process for service tickets related to social media. When a client or team member uploads a branded content file to a ticket, this workflow updates the ticket's status and moves it into the "Content in Approval" pipeline stage for review.

### **Enrollment Triggers**

A service ticket will be enrolled in this workflow when the following conditions are met:

*   The ticket's **"Branded Content File"** property has a value (i.e., a file has been uploaded).
*   **AND** the ticket's **"Product Group"** property is set to "Social Media".

**Note:** Tickets can only be enrolled in this workflow once and will not re-enroll if they meet the criteria again.

### **Workflow Actions**

Once a ticket is enrolled, the workflow performs the following sequence of actions:

1. **Set Approval Status**: The ticket property **"Branded Content File Approval Status"** is set to **"Open"**. This flags the newly uploaded file as ready for the approval process.
2. **Move Pipeline Stage**: The ticket is moved to the **"Content in Approval"** stage within the service pipeline. This ensures the ticket is visible to the team responsible for reviewing and approving content.