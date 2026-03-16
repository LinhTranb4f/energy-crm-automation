---
title: '1037 | Data-Mgmt | Services | Update Audio Production Briefing details | Move Service Stage to “Preproduction”'
source: https://app.clickup.com/24322455/v/dc/q68cq-250875/q68cq-634755
---

**Summary**

*   **Workflow URL:** [https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3737438436/edit](https://app-eu1.hubspot.com/workflows/48268320/platform/flow/3737438436/edit)
*   **Workflow ID:** 3737438436
*   **Workflow Name:** 1037 | Data-Mgmt | Services | Update Audio Production Briefing details | Move Service Stage to “Preproduction”

**Purpose**
This workflow automates the initial stage progression for audio production services. Its primary function is to move a Service record to the "Preproduction" stage as soon as essential briefing information is provided, ensuring a smooth handoff and signaling that the project is ready for the next phase.

**Object Type**

*   This workflow operates on Service records (Custom Object).

**Enrollment Triggers**
A Service record will be enrolled in this workflow if **ANY** of the following properties are filled out:

*   Spot Duration (`spot_duration`)
*   Speaker (`sprecherin`)
*   Sound (`sound`)
*   Text/Script (`text_script`)
*   Music (`musicduisa`)
*   Comments (`comments`)

**Actions**
Once a record meets the enrollment criteria, the workflow executes the following action:

1. **Set Property Value:**
    *   The workflow updates the "Pipeline Stage" (`hs_pipeline_stage`) of the Service record to "Preproduction".