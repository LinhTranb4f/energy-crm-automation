---
title: '2026 | GrowthOps | company | Budget JV Usage is more than 80% | send notification to company owner'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635815
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3030828226/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3030828226/edit)
*   **Workflow ID:** 3030828226
*   **Workflow Name:** 2026 | GrowthOps | company | Budget JV Usage is more than 80% | send notification to company owner

### **Purpose**

This workflow automatically monitors the budget usage for companies based on their annual agreement (Jahresvereinbarung - JV). When a company's budget usage reaches or exceeds 80%, it sends a notification to the assigned Company Owner to alert them. This allows the owner to proactively manage the account, discuss budget adjustments, or plan for the remainder of the term.

### **Enrollment Triggers**

This is a Company-based workflow. A company is enrolled when it meets the following criteria:

*   The company property "Budget JV Usage in Percent" (`budget_jv_usage_in_percent`) is greater than or equal to 80%.

### **Workflow Actions**

Once a company is enrolled, the following action occurs immediately:

*   **Action 1: Send Internal Notification**
    *   **Recipient:** The notification is sent to the HubSpot user who is set as the `HubSpot Owner` of the enrolled company.
    *   **Subject:** JV Budget von \[Company Name\] bei \[Budget JV Usage %\]
        *   _Translation: JV Budget of \[Company Name\] at \[Budget JV Usage %\]_
    *   **Body:**
        *   Hallo \[Company Owner Name\],
        *   Bei \[Company Name\] ist das Budget der Jahresvereinbarung bereits um \[Budget JV Usage %\] aufgebraucht. Bitte prüfen und ggf. reagieren.
        *   _Translation: Hello \[Company Owner Name\], For \[Company Name\], the budget for the annual agreement has already been used up by \[Budget JV Usage %\]. Please check and react if necessary._

### **Settings & Configuration**

*   **Re-enrollment:** Re-enrollment is turned OFF. This means a company will only trigger this notification once. If its budget drops below 80% and then rises above it again, it will not be re-enrolled in the workflow.