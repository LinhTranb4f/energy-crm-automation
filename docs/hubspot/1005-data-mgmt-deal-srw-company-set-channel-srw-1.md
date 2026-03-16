---
title: '1005 | Data-Mgmt | deal | SRW Company | Set Channel SRW'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635215
---

### **Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2567554259/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2567554259/edit)
*   **Workflow ID:** 2567554259
*   **Workflow Name:** 1005 | Data-Mgmt | deal | SRW Company | Set Channel SRW

### **Objective**

This is a Deal-based workflow designed for data management. Its purpose is to automatically set the "Sales Channel" property on a deal to "SRW" if the property is currently empty and the deal is associated with a contact from a specific list (List ID 197).

### **Enrollment Triggers**

Deals are enrolled in this workflow when they meet the following criteria:

*   The Deal's **Sales Channel** property is unknown.
*   **AND** The Deal is associated with a **Contact** who is a member of **List ID 197**.

### **Workflow Actions**

Once a deal is enrolled, the following action occurs:

*   **Set Property Value:**
    *   **Object:** Enrolled Deal
    *   **Property:** Sales Channel
    *   **New Value:** SRW

### **Workflow Settings**

*   **Re-enrollment:** Enabled. A deal can re-enter this workflow if it meets the enrollment criteria again in the future.