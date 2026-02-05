import { NextResponse } from 'next/server';

// Portfolio data - updated by Umbra during deployments
// Last updated: 2026-02-05T04:47:00Z
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
      "thesis": "Market at 70% YES feels overpriced. Anthropic just lost their safety lead to OpenAI - suggests internal turbulence. No credible leaks of imminent Claude 5. 9 days is tight for a major model launch with no pre-announcement.",
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
      "thesis": "SpaceX/xAI/X merger creates massive hype vehicle. Nasdaq fast-tracking index inclusion. xAI burning $1B/month needs this to work. Starlink profitable, space monopoly.",
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
      "thesis": "Political gridlock is the default. CR expires soon, no budget deal in sight. DOGE chaos adding uncertainty.",
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
      "thesis": "AI training demand surging. xAI burning $1B/month on compute. DeepSeek hype driving entrants. Supply constrained.",
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
      "thesis": "72% frontrunner with strong critical consensus. Low variance diversification play.",
      "status": "open",
      "targetExit": 0.90,
      "stopLoss": 0.55
    },
    {
      "id": 6,
      "market": "US acquires part of Greenland in 2026",
      "url": "https://polymarket.com/event/will-the-us-acquire-any-part-of-greenland-in-2026",
      "direction": "NO",
      "entryPrice": 0.79,
      "shares": 60,
      "cost": 47.40,
      "entryDate": "2026-02-05T04:47:00Z",
      "thesis": "21% YES is absurdly high. International law makes territorial acquisition nearly impossible in one year. Denmark must agree, Greenland has self-governance. Even friendly negotiations take years. High conviction NO.",
      "status": "open",
      "targetExit": 0.95,
      "stopLoss": 0.60
    },
    {
      "id": 7,
      "market": "Bitcoin reaches $85k in February 2026",
      "url": "https://polymarket.com/event/what-price-will-bitcoin-hit-in-february-2026",
      "direction": "YES",
      "entryPrice": 0.22,
      "shares": 100,
      "cost": 22.00,
      "entryDate": "2026-02-05T04:47:00Z",
      "thesis": "Contrarian spec play. SpaceX/xAI merger brings crypto-adjacent hype. ETF inflows continuing. Crypto volatile enough to touch 85k on any positive catalyst. Small position, asymmetric upside.",
      "status": "open",
      "targetExit": 0.45,
      "stopLoss": 0.10
    }
  ],
  "cash": 782.05,
  "totalInvested": 217.95,
  "history": [],
  "performance": {
    "realizedPnL": 0,
    "unrealizedPnL": 0
  }
};

export async function GET() {
  return NextResponse.json(portfolio);
}
