# Play revenue plan — from ~$120/yr to ≥$500/yr net

Working notes compiled 2026-10-29 from live Play reports (bucket
`pubsite_prod_rev_15742151642195349260`). Figures are from
`stats/installs`, `stats/ratings`, `stats/store_performance`.

**Caveat:** the service account has *statistics* access only — **0 financial
reports are visible**. Revenue below is *inferred* from acquisition counts,
not measured. Fixing that is item 0.

---

## 1. What the data actually says

### Monoic White — free, and the only thing with real reach

| month | store visitors | acquisitions | conversion |
|---|---|---|---|
| 2025-09 | 66,371 | 12,156 | 18.3% |
| 2025-12 | 51,545 | 9,358 | 18.2% |
| 2026-03 | 42,966 | 8,624 | 20.1% |
| 2026-06 | 41,873 | 8,294 | 19.8% |
| 2026-09 | 34,221 | 6,173 | 18.0% |

- **~105,000 installs in the last 12 months**, 63,000 active devices,
  1.33M lifetime.
- Conversion held steady at 18–20% — the *listing* is not the problem.
- **Traffic halved in 13 months** (66k → 34k visitors). New installs went
  13.5k/mo → 6.5k/mo. This is the fire: at this rate revenue halves again.

### Market split (Monoic White, Sep 2026)

| market | visitors | conversion |
|---|---|---|
| Other (long tail) | 19,701 | 18.6% |
| **IN** | **4,990** | **11.3%** |
| RU | 2,845 | 26.7% |
| US | 2,558 | 20.2% |
| ID | 1,417 | 16.2% |
| BR | 1,243 | 20.7% |

India is the largest named market but converts **half as well** as US/RU —
confirms the US-first positioning. Russia's 26.7% is a surprise worth a
localised listing test.

### Glass Series — paid, and structurally dead

| app | monthly visitors | monthly acquisitions | conversion |
|---|---|---|---|
| Glassy | 3,890 | **8** | **0.2%** |
| Glass Waves / Droplet / Bubble / Moonlight | — | 0–7 combined | ~0% |

**8 sales/month on 3,890 visitors.** At ~$2.25 net per sale that is
~$18/mo ≈ **$216/yr gross → ~$150 net**. That single number *is* the
business today. Every other paid pack contributes noise.

### Dormant packs (squircle1–9, crystalorb1/3/4/5, heartly*, clover)

Last 12 months before takedown: **1–9 installs each**. These were not
underperforming — they never had demand. They are *artwork assets*, not
product assets.

---

## 2. The diagnosis in one line

> 105,000 installs/year flow into a free app that earns nothing, while the
> only monetised surface converts 0.2% and produces ~8 sales/month.

The problem is **not** ASO, not the site, and not the icon quality. It is
that there is **no monetisation attached to the only distribution you have**.

---

## 3. The maths to $500/yr net

Target ≈ $600 gross/yr ≈ $50/mo gross (after ~15–30% Google cut + taxes).

| lever | volume | rate | net/yr |
|---|---|---|---|
| **In-app purchase in Monoic White** | 105k installs/yr | **0.3%** @ $2.99 | **≈$700** ✅ |
| same | 105k installs/yr | 1.0% @ $2.99 | ≈$2,400 |
| Glassy → free + IAP | +700 installs/mo | 1% @ $2.99 | ≈$190 |
| Monoic Player skins | unknown | — | potentially ≫ $500/mo |

**A 0.3% conversion on traffic you already have beats the target four
times over.** That is the whole plan.

---

## 4. Plan, ranked by ROI

### Tier 1 — do first (≈2–4 weeks of work)

**1. Put a real IAP inside Monoic White.**
One SKU — "KD Pixels All-Access" ($2.99–3.99) — unlocking every Monoic
variant, every Glass pack as an icon style/overlay, and future packs.
Surface it: first-run sheet, a "Get all packs" row in settings, and a
persistent but dismissible card. This is the only lever that moves the
number materially.
*Open question for the owner:* the listings say "Free · in-app purchase" —
does a working, promoted IAP actually exist today? If not, this is the
single highest-value thing to build.

**2. Stop selling $4 packs to 3,890 people who don't buy.**
Glassy converts 0.2%. Make the Glass Series **free with an IAP unlock**
(full icon set). Same traffic at 18% conversion ≈ **+700 installs/month**,
a rating base, and a purchase surface — instead of 8 sales.
Also reprice any remaining paid SKUs to **$2.49–2.99** (₹400 ≈ $4.80 is
well above the icon-pack impulse threshold).

**3. Arrest the traffic decline.**
Visitors halved in 13 months at constant conversion, so this is
distribution, not the listing. Check in order: crash-free rate (there are
1,339 crash reports in the bucket), stale screenshots/video (last refresh
unknown), review response rate, and Android 15/16 compatibility.
Then run one deliberate listing experiment per month and measure in
`store_performance`.

### Tier 2 — the growth vehicle (1–3 months)

**4. Ship Monoic Player out of beta.**
Icon packs have a low ceiling; a Winamp-style player has genuine search
intent and a skin marketplace is a natural, repeatable IAP (collections,
nostalgia, whale-friendly). On disk at `~/Android/monoicplayer`.
Blockers are the factory skins + quirks. Target: free player +
10–15 skins at launch, skin store later. This is where $500/***mo*** —
not $500/yr — becomes plausible.

**5. Reuse the dormant packs as content, not as apps.**
Do **not** relaunch squircle1–9 / crystalorb1/3/4/5 / heartly* / clover as
standalone listings: 1–9 installs/month means no demand, and each relaunch
costs a listing, ASO effort and a support surface. Instead fold their icon
artwork into Monoic White as selectable **icon styles**, and into the
All-Access bundle. Same art, zero distribution cost, and it makes the IAP
worth buying.

**6. BB Icons** — only ship it with a distinct hook (a specific aesthetic
trend, not "another minimal pack"), and launch it free-with-IAP directly.
A paid launch replicates Glassy's 0.2%.

### Tier 0 — infrastructure (cheap, unblocks everything)

**0. Measure revenue, don't infer it.**
Add **"View financial data"** to the service account in Play Console, then
extend `scripts/pull-metrics.mjs` to pull earnings reports. Right now the
$500 target is being managed blind — we estimate revenue from install
counts. Also pull `store_performance` (visitors/conversion) so listing
experiments become measurable.

---

## 5. Site's supporting role

The hub site should earn its keep by capturing search intent the Play
listing can't:

- `/apps/monoic-white/` — target "minimal icon pack android", "monochrome
  icon pack" (highest-intent existing traffic).
- A **Monoic Player** page targeting "winamp for android", "classic music
  player skins" — this is real search volume that currently has no landing
  page.
- Cross-links between series (already in place via `relatedApps`) to move
  Monoic traffic toward Glass.

Direct sales (Lemon Squeezy) make sense for **player skins and bundles**,
not for icon-pack APKs — sideloading an icon pack is friction most users
won't accept.

---

## 6. Summary

1. Measure revenue properly (financial permission).
2. Ship one All-Access IAP into Monoic White — 0.3% of existing installs
   clears the goal.
3. Make Glass free-with-IAP; stop selling $4 packs to a 0.2% funnel.
4. Stop the 13-month traffic decay.
5. Monoic Player is the long-term growth engine; dormant packs are
   artwork, not products.
