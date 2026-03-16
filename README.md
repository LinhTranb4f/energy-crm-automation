# NRJ HubSpot Automation & QA

**E2E tests and automation for the HubSpot CRM pipeline: deal–quote–invoice flows, n8n workflows, PDF validation, and HubDB line-item calculators.**

This repository contains Playwright-based end-to-end tests that validate the order journey from company/contact creation through deal line items, quotes, invoices, and PDF amounts—including integration with n8n (SAP, Delfin, PandaDoc) and HubDB-driven line-item calculation rules.

## What’s in this repo

- **Deal–Invoice–Quote–PDF QA** — Phase-based E2E tests (company/contact, deal line items, quote amounts) and validation of invoice PDF totals against deal data.
- **Line-Item Calculation QA** — Checks that HubSpot line items (e.g. Radio Spots, Digital Spots, Audio Production) match HubDB calculator logic.
- **Docs** — HubSpot ↔ n8n integration map, business overview, and CRM schema notes.

## Quick start

```bash
cd automation
cp .env.example .env   # set HUBSPOT_ACCESS_TOKEN, etc.
npm install
npm test
```

## Tech stack

- [Playwright](https://playwright.dev/) (TypeScript)
- HubSpot CRM API
- n8n webhooks (documented in `docs/hs-n8n/`)
- PDF parsing for invoice validation
