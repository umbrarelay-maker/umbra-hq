export type AgentNode = {
  id: string;
  name: string;
  subtitle?: string;
  charterUrl?: string;
  models?: string[];
  owns?: string[];
  hqTags?: string[];
};

export type AgentEdge = {
  from: string;
  to: string;
  label: string;
};

export const agentNodes: AgentNode[] = [
  {
    id: "operator",
    name: "Operator (Ops/Ship)",
    subtitle: "Only deploy lane",
    charterUrl:
      "https://umbra-hq.vercel.app/documents/75a61786-89d1-4ede-be4e-d58bef0c9a7b",
    models: ["openai-codex/gpt-5.2"],
    owns: ["Deploys", "Prod verification", "Incidents"],
    hqTags: ["[DEPLOY]", "[INCIDENT]"],
  },
  {
    id: "scribe",
    name: "HQ Scribe (Archivist)",
    subtitle: "HQ cleanliness + tagging",
    charterUrl:
      "https://umbra-hq.vercel.app/documents/bca97ec7-d921-4310-b82f-3d3482a8adf7",
    models: ["anthropic/claude-sonnet-4-6"],
    owns: ["Curate HQ", "Playbook quality"],
  },
  {
    id: "seo",
    name: "UmbraTools SEO/Audit",
    subtitle: "Audits + growth backlog",
    charterUrl:
      "https://umbra-hq.vercel.app/documents/ce403001-07d5-4657-9c21-84e1755b43a9",
    models: ["openai-codex/gpt-5.2"],
    owns: ["Daily monitor", "Weekly audit"],
    hqTags: ["[NOTE]"],
  },
  {
    id: "publisher",
    name: "UmbraTools Publisher (Blog)",
    subtitle: "Great posts + publish packet",
    charterUrl:
      "https://umbra-hq.vercel.app/documents/5dec051d-a04f-4561-bf26-e6fa4e18c488",
    models: ["anthropic/claude-sonnet-4-6"],
    owns: ["Draft", "Examples", "FAQ", "Internal links"],
    hqTags: ["[DEPLOY]"],
  },
  {
    id: "trader",
    name: "Trading Exec (Paper)",
    subtitle: "Owns outcomes + urgency",
    charterUrl:
      "https://umbra-hq.vercel.app/documents/d8871e20-7aff-4456-89e0-d34217ef3acb",
    models: ["openai-codex/gpt-5.2"],
    owns: ["Stops", "Targets", "Trades", "P/L logging"],
    hqTags: ["[TRADE]", "[NOTE]"],
  },
  {
    id: "radar",
    name: "Trading Scout (News Radar)",
    subtitle: "Signals only",
    charterUrl:
      "https://umbra-hq.vercel.app/documents/56ef1aae-6420-483c-863d-3135795654fc",
    models: ["xai/grok-4-0709"],
    owns: ["Catalyst detection"],
    hqTags: ["[NOTE]"],
  },
];

export const agentEdges: AgentEdge[] = [
  { from: "radar", to: "trader", label: "news + recommendations" },
  { from: "seo", to: "operator", label: "findings + tickets" },
  { from: "publisher", to: "operator", label: "publish packet" },
  { from: "operator", to: "scribe", label: "deploy + incident logs" },
  { from: "trader", to: "scribe", label: "trade + thesis logs" },
];
