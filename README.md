# New Lead/Account Battle Cards

Standalone Trigger.dev project that generates rep-facing battle cards for hot/warm
accounts. Split out of [`socure-growth-exercise`](https://github.com/bowtiefunnel/socure-growth-exercise)
(the lead enrichment & routing pipeline) so it deploys and scales independently —
its own Trigger.dev project, its own repo, no shared runtime.

## What it does

Two tasks:

- **`battle-card`** — one hot/warm account in, one Langfuse-traced, groundedness-scoped
  card out. Follows `prompts/battle-card.md` (structure) and `prompts/messaging-net-new.md`
  (voice/evidence tiers) exactly. Gated: a human reads every card before a rep uses it.
- **`battle-cards-workflow`** — batch entry point. Takes `{ accounts: Account[] }`,
  filters to hot/warm, fans out to `battle-card` per account, writes
  `output/battle_cards/<domain>.md`.

`accounts` is a **required** payload field, not read from disk — Trigger.dev cloud
runs each get an isolated, ephemeral filesystem, so this task can never see what
the lead-pipeline project wrote in its own run. Pass the `accounts` array from that
project's `output/routed_leads.json` (the `part-1-assignment` task's output) directly.

## Run it

```bash
npm install
cp .env.example .env   # fill in ANTHROPIC_API_KEY (Langfuse optional)
npm run dev            # local Trigger.dev dev server
npm run deploy         # deploy to Trigger.dev prod
```

Trigger `battle-cards-workflow` with a payload like:

```json
{ "accounts": [ /* Account[] from routed_leads.json */ ] }
```

## Layout

- `tools/` — the two tasks (Trigger.dev `dirs` points here)
- `prompts/` — battle-card structure + messaging/voice standard, read at runtime
- `lib/` — `types.ts` (shared `Account`/`Lead` shape), `assets.ts` (file reads)
- `connections/llm.ts` — Anthropic + Langfuse client (`tracedCompletion`)
- `instructions.md` — evidence discipline: grounding rule, approved proof points,
  refuted-claims blocklist — the first thing in every card's system prompt
