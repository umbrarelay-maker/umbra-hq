export const crmEnrichmentContent = `# Avoma → Zoho CRM Enrichment

## Overview

Automatically extract structured data from Avoma call transcripts and push enriched data to **Zoho CRM** via agent orchestration. No custom development required — this is a configuration/prompt engineering task.

---

## Architecture

\`\`\`
Avoma Call Recording
        ↓
Transcript (from Avoma)
        ↓
Agent Orchestration Platform
        ↓
AI Extraction (Gemini 3 Flash)
        ↓
Structured JSON
        ↓
Zoho CRM API v6
\`\`\`

**Key Point:** All orchestration handled by existing agent platform. Work required:
1. Parse Avoma transcript format
2. Structure extraction prompt
3. Map output to Zoho API format

---

## Zoho CRM Field Mapping

### Leads Module

| Extracted Field | Zoho API Field | Type | Notes |
|----------------|----------------|------|-------|
| Contact Name | Last_Name, First_Name | String | Last_Name mandatory |
| Company | Company | String | Max 255 chars |
| Email | Email | String | Validated format |
| Phone | Phone | String | Max 30 chars |
| Title | Designation | String | Job title |
| Industry | Industry | Picklist | Must match existing values |
| Lead Source | Lead_Source | Picklist | Set to "Discovery Call" |
| Annual Revenue | Annual_Revenue | Currency | Double value |
| Website | Website | URL | Valid URL format |
| City | City | String | |
| State | State | String | |
| Description | Description | Multi-line | Pain points, notes |

### Deals Module

| Extracted Field | Zoho API Field | Type | Notes |
|----------------|----------------|------|-------|
| Deal Name | Deal_Name | String | Mandatory |
| Stage | Stage | Picklist | e.g., "Qualification" |
| Amount | Amount | Currency | Deal value estimate |
| Closing Date | Closing_Date | Date | yyyy-MM-dd format |
| Pipeline | Pipeline | String | If pipelines enabled |
| Probability | Probability | Integer | 0-100 |
| Next Step | Next_Step | String | Follow-up action |

### Contacts Module

| Extracted Field | Zoho API Field | Type | Notes |
|----------------|----------------|------|-------|
| Full Name | Last_Name, First_Name | String | Last_Name mandatory |
| Email | Email | String | |
| Phone | Phone | String | |
| Title | Title | String | |
| Department | Department | String | |

---

## AI Extraction Prompt (Gemini 3 Flash)

\`\`\`
You are a CRM data extraction assistant. Extract structured data from this Avoma call transcript for Zoho CRM.

Return a JSON object with these fields:

{
  "contact": {
    "first_name": "string",
    "last_name": "string (REQUIRED)",
    "email": "string or null",
    "phone": "string or null",
    "title": "string or null"
  },
  "company": {
    "name": "string (REQUIRED)",
    "website": "valid URL or null",
    "industry": "string or null",
    "employee_count": "number or null",
    "annual_revenue": "number or null",
    "city": "string or null",
    "state": "string or null"
  },
  "opportunity": {
    "pain_points": ["array of strings"],
    "current_solution": "string or null",
    "budget_range": "string or null",
    "budget_confirmed": true/false/null,
    "timeline": "string or null",
    "deal_size_estimate": "number or null",
    "competitors_mentioned": ["array of strings"]
  },
  "qualification": {
    "decision_maker": true/false/null,
    "urgency": "high/medium/low/unknown",
    "next_steps": ["array of strings"],
    "follow_up_date": "yyyy-MM-dd or null",
    "materials_requested": ["array of strings"]
  },
  "sentiment": {
    "engagement_level": "high/medium/low",
    "buying_signals": ["array of strings"],
    "objections": ["array of strings"],
    "overall": "positive/neutral/negative"
  }
}

Rules:
- Extract only explicitly mentioned information
- Use null for fields not mentioned
- last_name and company.name are REQUIRED - infer if necessary
- Dates in yyyy-MM-dd format
- Revenue/deal size as numbers without currency symbols
- Industry should match common Zoho picklist values
\`\`\`

---

## Zoho API Reference

### Authentication (OAuth 2.0)

**Required credentials:**
- Client ID (from Zoho API Console)
- Client Secret
- Refresh Token

**Token refresh:**
\`\`\`
POST https://accounts.zoho.com/oauth/v2/token
Content-Type: application/x-www-form-urlencoded

refresh_token={REFRESH_TOKEN}
client_id={CLIENT_ID}
client_secret={CLIENT_SECRET}
grant_type=refresh_token
\`\`\`

### Required Scopes
\`\`\`
ZohoCRM.modules.leads.CREATE
ZohoCRM.modules.leads.UPDATE
ZohoCRM.modules.deals.CREATE
ZohoCRM.modules.deals.UPDATE
ZohoCRM.modules.contacts.CREATE
ZohoCRM.modules.contacts.UPDATE
\`\`\`

### Insert Lead

**Endpoint:** \`POST https://www.zohoapis.com/crm/v6/Leads\`

**Headers:**
\`\`\`
Authorization: Zoho-oauthtoken {access_token}
Content-Type: application/json
\`\`\`

**Body:**
\`\`\`json
{
  "data": [{
    "Last_Name": "extracted.contact.last_name",
    "First_Name": "extracted.contact.first_name",
    "Company": "extracted.company.name",
    "Email": "extracted.contact.email",
    "Phone": "extracted.contact.phone",
    "Designation": "extracted.contact.title",
    "Industry": "extracted.company.industry",
    "Lead_Source": "Discovery Call",
    "Website": "extracted.company.website",
    "City": "extracted.company.city",
    "State": "extracted.company.state",
    "Description": "Pain points and notes from call"
  }],
  "trigger": ["workflow"]
}
\`\`\`

### Create Deal

**Endpoint:** \`POST https://www.zohoapis.com/crm/v6/Deals\`

**Body:**
\`\`\`json
{
  "data": [{
    "Deal_Name": "{Company} - {Interest}",
    "Stage": "Qualification",
    "Amount": "extracted.opportunity.deal_size_estimate",
    "Closing_Date": "extracted.qualification.follow_up_date",
    "Pipeline": "Standard",
    "Probability": 20,
    "Next_Step": "extracted.qualification.next_steps[0]",
    "Description": "Pain points, budget, timeline summary"
  }],
  "trigger": ["workflow", "blueprint"]
}
\`\`\`

### Handle Duplicates

If Zoho returns \`DUPLICATE_DATA\` error, extract the existing record ID and update instead:
\`\`\`
PUT https://www.zohoapis.com/crm/v6/Leads/{record_id}
\`\`\`

---

## Data to Extract from Avoma Transcripts

### Company Information
- Company Name (legal name, DBA)
- Website / domain
- Industry / vertical
- Company size (employees)
- Annual revenue (if mentioned)
- Location (city, state)

### Contact Information
- Full name
- Job title / role
- Email address
- Phone number
- Decision maker status

### Opportunity Details
- Pain points / challenges
- Current solution they use
- Budget range
- Timeline / urgency
- Estimated deal size
- Competitors mentioned

### Qualification Signals
- BANT: Budget, Authority, Need, Timeline
- Buying signals
- Objections raised
- Next steps agreed
- Follow-up date
- Materials requested

---

## Zoho-Specific Notes

### Rate Limits
- 100 records per API call
- 15,000 API calls per day (varies by plan)

### Workflow Triggers
Use the \`trigger\` array to control automation:
- \`workflow\` — Trigger workflow rules
- \`blueprint\` — Trigger blueprints
- \`approval\` — Trigger approval processes
- Set to \`[]\` to skip all automation

### Custom Fields
For fields not in standard modules:
1. Settings → Customization → Modules → Leads
2. Add custom fields (Budget_Confirmed, Current_Solution, etc.)
3. Get API names from Developer Hub → API Names

---

## Cost Estimate

| Component | Cost |
|-----------|------|
| Gemini 3 Flash | ~$0.005 per extraction |
| Avoma | Existing subscription |
| Zoho CRM | Existing subscription |
| Agent Orchestration | Existing platform |

**Per-call cost:** Pennies

---

## Setup Checklist

- [ ] Get Avoma transcript webhook/export format
- [ ] Register OAuth app in Zoho API Console
- [ ] Configure agent orchestration trigger (Avoma → Agent)
- [ ] Test extraction prompt with sample transcripts
- [ ] Map JSON output to Zoho API fields
- [ ] Test Zoho API integration
- [ ] Handle duplicates and errors
- [ ] Enable workflow triggers

---

*Updated: February 5, 2026*
*Transcript Source: Avoma*
*AI Model: Gemini 3 Flash*
*CRM: Zoho CRM*
`;
