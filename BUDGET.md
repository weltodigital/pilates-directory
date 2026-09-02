# Keeping the Google Places bill at zero

On 21 August 2026 a Places refresh cost £46.71. The scripts here are now
built so that cannot recur, but the script-side guards only cover this
script. **The server-side quota is the only real ceiling.** Set it once.

## 1. The server-side quota (set, verified 2 September 2026)

Google Maps Platform has no hard spend cap — a budget alert emails you after
the money is gone. A **quota** refuses the request instead. Under
**APIs & Services → Places API (New) → Quotas & System Limits**:

| Quota | Value | Why |
|---|---|---|
| GetPlaceRequest per day | **30** | The ceiling. ~930/month, inside the 1,000 free |
| GetPlaceRequest per minute | **60** | Must be non-zero or every call is refused |
| GetPlaceRequest per minute per user | **60** | Same |
| *Everything else* | **0** | Text Search, Nearby, Autocomplete, Photos, Media, ReviewPosts — all unused, all $32+/1,000 |

Zero on the per-day rows makes those SKUs structurally impossible, which is
the point: the expensive calls cannot be made by any code, not just by this
script.

`DAILY_CALL_BUDGET` in `scripts/places-refresh.js` mirrors the 30/day figure.
**Change one and change the other** — raising the script's budget alone just
buys `RESOURCE_EXHAUSTED`, and raising the quota alone does nothing.

Also restrict the key itself: **Credentials → the key → API restrictions →
Places API (New) only**. A key that can only call one API cannot surprise you
via another.

Then add a **budget alert** (Billing → Budgets & alerts) at £1/month as a
smoke detector. It won't stop spend; it tells you a quota was raised and
forgotten.

## 2. What the script does on its own

`scripts/places-refresh.js` treats the free monthly allowance as the budget.

| Guard | Effect |
|---|---|
| Daily tally in `.places-usage.json` | Calls counted per day, written as each call is charged |
| Quota = budget | The run stops at 30 calls/day, or 1,000/month, whichever binds first |
| Stalest-first ordering | Deferred studios are first in line tomorrow, so the table still cycles |
| `--paid` + typed confirmation | Spending anything needs both, and never works without a terminal |
| Response cache (`.places-cache/`, 30 days) | Dry run and `--execute` share one set of calls |
| `--atmosphere` opt-in | `editorialSummary` alone repriced every call from $20 to $25/1,000 |

A default run costs **$0.00** and says so before it starts.

### The consequence to accept

4,547 active studios at 30 calls a day means a full pass takes about five
months. That is the price of a zero bill. Run it daily on a cron and the
table stays on a ~5-month refresh cycle, which is fine for phone numbers and
opening hours.

    0 6 * * *  cd /path/to/pilates-directory && node scripts/places-refresh.js --all --execute

Safe unattended: with no terminal attached the script cannot spend, whatever
flags it is given.

To refresh everything at once, expect ~$91 at the Enterprise tier, and do it
deliberately with `--paid` — which needs both the quota raised and a person
typing `yes`.

## 3. Tiers and prices

A Place Details call is billed at the **highest** tier any requested field
belongs to — not per field. `FIELD_TIERS` in the script is the source of
truth; adding one field from a higher tier reprices every call in the run.

| Tier | $/1,000 | Free/month |
|---|---|---|
| Essentials | 5 | 10,000 |
| Pro | 17 | 5,000 |
| Enterprise (what we use) | 20 | 1,000 |
| Enterprise + Atmosphere | 25 | 1,000 |

Confirm current figures in the console before trusting these — Google moved
from the $200 monthly credit to per-tier allowances in March 2025 and the
numbers can change.
