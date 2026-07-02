# Nigeria Procurement Watch — Dashboard

A data-driven dashboard that monitors awarded public contracts in Nigeria, highlights statistical anomalies, and ranks ministries by procurement risk. It helps researchers, journalists, and civic technologists quickly spot procurement patterns that warrant further verification.

- Built with TypeScript and Next.js (App Router).
- Data served from Supabase (Postgres + Row-Level Security).
- Visual components for metrics, recent findings, and an agency leaderboard.

## Quick links
- Live demo: https://nigeria-procurement-watch.vercel.app/
- Methodology: /methodology (in-repo)
- Agent and tooling notes: AGENTS.md, CLAUDE.md

## Features
- National procurement overview with rolling weekly snapshots.
- Agency risk leaderboard (ranked by anomaly density / ARS score).
- Recent findings feed with links to flagged contracts and contextual metadata.
- Aggregated KPIs: contracts tracked, anomalies flagged, high-risk agencies, total flagged value (NGN).
- Extensible detectors and methodology documented in the repo.

## Stack
- Language: TypeScript (primary), small JS/CSS surface
- Framework: Next.js (App Router)
- Notable libraries:
  - @supabase/supabase-js — database + auth client
  - React + lucide-react — UI components & icons
  - Recharts — charts/visualization
  - Tailwind CSS — styling

## How it works (runtime)
On the server (Next.js route / page), the app queries Supabase for the latest analysis week, ministry scores, contract counts, flagged findings and aggregates. The page composes these into metric cards, a leaderboard and a findings feed. Data fetching is server-side with periodic revalidation (revalidate = 300s).

Key DB sources observed in code:
- ministry_scores — weekly ARS scores and banding per ministry
- ministries — ministry metadata (name, slug, sector)
- contracts — awarded contract records and values (value_ngn)
- anomaly_findings — detector outputs referencing contract_ids and detection metadata

## Getting started (developer)
Prerequisites:
- Node.js (recommended >= 18)
- pnpm (or npm/yarn)
- A Supabase project with the expected tables and a read-only anon key (or a service role where required)

Install
```bash
pnpm install
# or
# npm install
# yarn
```

Environment
Create a `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Run (development)
```bash
pnpm dev
# or npm run dev
# or yarn dev
# then open http://localhost:3000
```

Build & start (production)
```bash
pnpm build
pnpm start
# or npm run build && npm run start
```

Lint
```bash
pnpm lint
```

Deployment
- Vercel is the recommended host for Next.js — connect the GitHub repo and set the environment variables from your Supabase project.
- Ensure the Supabase anon key is added as a Vercel environment variable (NEXT_PUBLIC_SUPABASE_ANON_KEY) and the URL (NEXT_PUBLIC_SUPABASE_URL).

## Database expectations (tables & columns referenced)
The application queries and maps the following tables/fields. Adjust these to match your Supabase schema or add views to provide the same shapes.

- ministry_scores
  - ministry_id
  - week_ending (date / timestamp)
  - ars_score (numeric)
  - band (string)
  - total_contracts (integer)
  - total_value_ngn (numeric)
  - (joined) ministries(name, slug, sector)

- ministries
  - id
  - name
  - slug
  - sector

- contracts
  - id
  - value_ngn (numeric)
  - other awarded contract fields

- anomaly_findings
  - id
  - contract_ids (array of contract ids)
  - week_detected
  - created_at
  - (joined) ministries (for display)

If you run detectors outside this repo, ensure they produce findings compatible with anomaly_findings (contract_ids + week_detected).

## Contributing
Contributions are welcome. Suggested workflow:
1. Open an issue describing the feature or bug.
2. Create a branch, implement tests where appropriate.
3. Open a pull request describing changes and any schema or data migration steps.

See repository notes (AGENTS.md, CLAUDE.md) for tooling / agent-specific guidance.

## Data & Ethics
- The dashboard surfaces statistical anomalies derived from Nigeria’s public NOCOPO procurement portal.
- Anomalies are indicators for further investigation, not proof of wrongdoing.
- Vendor identity verification (e.g., CAC checks) is not integrated by default — treat vendor-related flags as preliminary.
- Follow local data protection and defamation laws when publishing or sharing findings.

## Troubleshooting & Tips
- No data appears? Check that the Supabase tables exist and that the anon key has read access.
- Week ending is empty until at least one analysis run writes a ministry_scores row with a week_ending value.
- For faster local iteration, seed a small dataset in Supabase or use a database dump with sample rows for ministry_scores, ministries, contracts, and anomaly_findings.

## License
Specify your license here (e.g., MIT). If you need to add a license, create a LICENSE file.

## Maintainers / Contact
Project maintainer: Muyiez101 (see GitHub profile)
For questions or access to data, open an issue or contact the maintainer via the repo.
