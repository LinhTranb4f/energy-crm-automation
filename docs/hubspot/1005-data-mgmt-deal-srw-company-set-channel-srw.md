---
title: '1005 | Data-Mgmt | deal | SRW Company | Set Channel SRW'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-632895
---

### Summary

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2567554259/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2567554259/edit)
*   **Workflow ID:** 2567554259
*   **Workflow Name:** 1005 | Data-Mgmt | deal | SRW Company | Set Channel SRW

### **Purpose**

This workflow is a data management tool designed to ensure deals associated with contacts from a specific source are correctly categorized. It automatically updates the 'Sales Channel' property to "SRW" for deals that currently have no value set for this property but are linked to contacts in a designated list.

### **Enrollment Criteria**

This is a **Deal-based** workflow. A deal will be enrolled when it meets **ALL** of the following criteria:

*   The deal's **Sales Channel** property is currently unknown (has no value).
*   The deal is associated with a **Contact** who is a member of the HubSpot list with ID **197**.

### **Workflow Actions**

Once a deal is enrolled, it will execute the following single action:

*   **Set Property Value:** The workflow updates the **Sales Channel** property on the enrolled deal and sets its value to **"SRW"**.

### **Settings**

*   **Re-enrollment:** Re-enrollment is turned **ON**. This means that if a deal's 'Sales Channel' is cleared again in the future, it can re-enroll in this workflow and have the property set back to "SRW", provided it still meets the enrollment criteria.