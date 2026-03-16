---
title: '1014 | Data-Mgmt | contact | Contact has a new owner or owner has changed | set manager of owner to contact'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-635655
---

### **Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2749244656/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/2749244656/edit)
*   **Workflow ID:** 2749244656
*   **Workflow Name:** 1014 | Data-Mgmt | contact | Contact has a new owner or owner has changed | set manager of owner to contact

### **Workflow Goal**

This workflow automates a key data management task for contact records. Its purpose is to automatically set the 'Manager' property on a contact based on the HubSpot Team to which the contact's owner belongs. This ensures that the management hierarchy is correctly reflected on contact records whenever an owner is assigned or changed.

### **Enrollment Triggers**

A contact will be enrolled in this workflow if either of the following conditions is met:

*   The 'Contact owner' property has any value (is known).
*   The 'Contact owner' property has been updated within the last day.

_Re-enrollment is active, meaning a contact will re-enter this workflow every time their 'Contact owner' property changes._

### **Workflow Steps**

Once a contact is enrolled, the workflow performs the following actions:

1. **Branch on Team:** The workflow first checks the value of the contact's 'HubSpot Team ID' property.
2. **Set Manager Property:** Based on the team, it follows a specific path to set the 'Manager' property on the contact record. The logic is as follows:
    *   If the Team ID is **62538013**, the Manager is set to user ID **26695357**.
    *   If the Team ID is **169855561**, the Manager is set to user ID **79295101**.
    *   If the Team ID is **169855566**, the Manager is set to user ID **80253539**.
    *   If the Team ID is **169855584**, the Manager is set to user ID **1779033493**.
    *   If the Team ID is **169855588**, the Manager is set to user ID **80764027**.
    *   If the Team ID is **169855603**, the Manager is set to user ID **80253547**.
3. **End Workflow:** After setting the property, the workflow for that contact concludes.