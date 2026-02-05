import { NextResponse } from 'next/server';

// Portfolio data - updated by Umbra during deployments
// Last updated: 2026-02-05T04:37:00Z
const portfolio = {
  "meta": {
    "created": "2026-02-05T04:37:00Z",
    "startingCapital": 1000,
    "currency": "USD (simulated)",
    "strategy": "News-driven AI/tech markets where research depth > speed"
  },
  "positions": [
    {
      "id": 1,
      "market": "Claude 5 released by Feb 14, 2026",
      "url": "https://polymarket.com/event/claude-5-released-by",
      "direction": "NO",
      "entryPrice": 0.30,
      "shares": 100,
      "cost": 30.00,
      "entryDate": "2026-02-05T04:37:00Z",
      "thesis": "Market at 70% YES feels overpriced. Anthropic just lost their safety lead to OpenAI - suggests internal turbulence. No credible leaks of imminent Claude 5. 9 days is tight for a major model launch with no pre-announcement. Buying NO at $0.30.",
      "status": "open",
      "targetExit": 0.50,
      "stopLoss": 0.15
    },
    {
      "id": 2,
      "market": "SpaceX IPO closing market cap >$1.2T",
      "url": "https://polymarket.com/event/spacex-ipo-closing-market-cap-above",
      "direction": "YES",
      "entryPrice": 0.73,
      "shares": 50,
      "cost": 36.50,
      "entryDate": "2026-02-05T04:37:00Z",
      "thesis": "SpaceX/xAI/X merger creates massive hype vehicle. Reports of Nasdaq fast-tracking index inclusion. xAI burning $1B/month needs this to work - Musk will pump it. Starlink profitable, space monopoly. $1.2T feels achievable in current mania.",
      "status": "open",
      "targetExit": 0.90,
      "stopLoss": 0.55
    },
    {
      "id": 3,
      "market": "US Government Shutdown by Feb 14",
      "url": "https://polymarket.com/event/another-us-government-shutdown-by-february-14",
      "direction": "YES",
      "entryPrice": 0.60,
      "shares": 40,
      "cost": 24.00,
      "entryDate": "2026-02-05T04:37:00Z",
      "thesis": "60% feels about right but maybe slightly low. Political gridlock is the default. CR expires soon, no budget deal in sight. DOGE chaos adding uncertainty. Slight edge on YES.",
      "status": "open",
      "targetExit": 0.80,
      "stopLoss": 0.40
    },
    {
      "id": 4,
      "market": "H100 GPU rental prices hit $2.45 by Feb 28",
      "url": "https://polymarket.com/event/what-will-gpu-rental-prices-h100-hit-in-february",
      "direction": "YES",
      "entryPrice": 0.39,
      "shares": 75,
      "cost": 29.25,
      "entryDate": "2026-02-05T04:45:00Z",
      "thesis": "AI training demand continues surging. xAI alone burning $1B/month on compute. DeepSeek hype driving more entrants. Supply constrained. 39% seems low for a modest price bump. Betting on continued GPU crunch.",
      "status": "open",
      "targetExit": 0.60,
      "stopLoss": 0.25
    },
    {
      "id": 5,
      "market": "Oscars 2026: One Battle After Another wins Best Picture",
      "url": "https://polymarket.com/event/oscars-2026-best-picture-winner",
      "direction": "YES",
      "entryPrice": 0.72,
      "shares": 40,
      "cost": 28.80,
      "entryDate": "2026-02-05T04:45:00Z",
      "thesis": "72% frontrunner. Awards season momentum usually locks in by now. Strong critical consensus. Taking a small position on the favorite — not high edge but low variance for portfolio diversification.",
      "status": "open",
      "targetExit": 0.90,
      "stopLoss": 0.55
    }
  ],
  "cash": 851.45,
  "totalInvested": 148.55,
  "history": [],
  "performance": {
    "realizedPnL": 0,
    "unrealizedPnL": 0
  }
};

export async function GET() {
  return NextResponse.json(portfolio);
}
