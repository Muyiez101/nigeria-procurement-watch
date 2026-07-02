# Nigeria Procurement Watch — Dashboard

Next.js dashboard reading live data from Supabase, showing ministry risk scores,
anomaly findings, and contract data sourced from NOCOPO.

## Setup

```bash
npm install
```

Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=https://jpqwabjwqyqvcijrrvgs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Run locally

```bash
npm run dev
```

Visit http://localhost:3000

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Import the repo at vercel.com/new
3. Add the two environment variables above in Vercel's project settings
4. Deploy

## Pages

- `/` — National overview, leaderboard, recent findings
- `/ministries` — Full agency leaderboard
- `/ministries/[slug]` — Individual agency detail page
- `/anomalies` — All findings, sorted by severity
- `/anomalies/[id]` — Individual finding detail with evidence
- `/contracts` — Top contracts by value
- `/methodology` — Full detector and scoring explanation
