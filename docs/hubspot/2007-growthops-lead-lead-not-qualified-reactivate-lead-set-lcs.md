---
title: '2007 | GrowthOps | lead | Lead Not Qualified | Reactivate Lead & (Set LCS)'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-633075
---

### **Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2638555351/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2638555351/edit)
*   **Workflow ID:** 2638555351
*   **Workflow Name:** 2007 | GrowthOps | lead | Lead Not Qualified | Reactivate Lead & (Set LCS)

### **Workflow Goal**

This workflow is designed to trigger a process when a lead is moved to an 'Unqualified' stage. Based on the name, its purpose is to reactivate the lead and set its Lifecycle Stage (LCS). However, the workflow currently contains no actions to perform these steps.

### **Object Type**

*   This workflow is based on a Custom Object (ID: `0-136`), referred to as a 'lead' in the workflow name. It uses the 'Deal Stage' property (`hs_pipeline_stage`) for its trigger criteria.

### **Enrollment Triggers (When Objects Enter the Workflow)**

An object will be enrolled in this workflow if it meets the following condition:

*   The object's **Deal Stage** property is set to **Unqualified** (Internal ID: `unqualified-stage-id`).

### **Re-enrollment**

*   Re-enrollment is **enabled**.
*   An object will re-enter this workflow every time its **Deal Stage** property is updated to **Unqualified**.

### **Actions (What the Workflow Does)**

*   **CRITICAL NOTE:** This workflow currently has **no configured actions**.
*   Although the name implies it should "Reactivate Lead & (Set LCS)", these steps are not implemented. Enrolled objects will pass through the workflow without any changes being made.

### **Unenrollment**

*   Objects will not be unenrolled if they no longer meet the trigger criteria. They will finish the workflow immediately since there are no actions or delays.