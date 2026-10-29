# Play revenue plan — $120/month → $500/month net

Compiled 2026-10-29 from live Play reports (bucket
`pubsite_prod_rev_15742151642195349260`): `stats/installs`, `stats/ratings`,
`stats/store_performance`, `acquisition/`.

---

## 0. The business model (as stated by the owner, 2026-10-29)

- **All free packs carry IAPs used to request icons that are missing** from
  the user's phone. This — not pack sales — has been the whole premise since
  day one. So the monetised product is an **icon-request service**, sold at
  the moment a user hits a gap.
- **Paid packs are a bootstrap**: launch paid to fund the work, then flip to
  free-with-IAP once the pack passes ~1,000 icons.
- **Ads are a dead end**: an icon pack is set once and the app is rarely
  opened again. No inventory, no session. (Correct — and this is the single
  most important structural fact here; see §2.)
- **Target: $500/month net**, up from ~$120/month. That is **4.2×**.

---

## 1. What the data says

### Monoic White — the only real distribution

| month | store visitors | acquisitions | conversion |
|---|---|---|---|
| 2025-09 | 66,371 | 12,156 | 18.3% |
| 2025-12 | 51,545 | 9,358 | 18.2% |
| 2026-03 | 42,966 | 8,624 | 20.1% |
| 2026-06 | 41,873 | 8,294 | 19.8% |
| 2026-09 | 34,221 | 6,173 | 18.0% |

- **~105,000 installs in the last 12 months**, 63,000 active devices, 1.33M
  lifetime.
- Conversion steady at 18–20% ⇒ the *listing* is healthy.
- **Visitors halved in 13 months** (66k → 34k). New installs 13.5k → 6.5k/mo.
  The decline, not the conversion rate, is what caps revenue.

### Market split (Monoic White, Sep 2026)

| market | visitors | conversion |
|---|---|---|
| Other (long tail) | 19,701 | 18.6% |
| **IN** | **4,990** | **11.3%** |
| RU | 2,845 | 26.7% |
| US | 2,558 | 20.2% |
| ID | 1,417 | 16.2% |
| BR | 1,243 | 20.7% |

India is the largest named market and converts **half as well** as US/RU —
confirms the US-first framing. Russia's 26.7% is worth a localised test.

### Glass Series — paid, structurally dead

| app | monthly visitors | monthly acquisitions | conversion |
|---|---|---|---|
| Glassy | 3,890 | 8 | **0.2%** |

Per the owner's own rule these flip to free at 1,000 icons. At 0.2%
conversion the paid gate is costing far more in install volume than it earns.

### Dormant packs (squircle1–9, crystalorb1/3/4/5, heartly*, clover)

1–9 installs each in their final 12 months before takedown: no demand.
They are **artwork assets**, not products.

---

## 2. The structural diagnosis

> An icon pack is consumed **once**. There is no session, no repeat surface,
> no ad inventory — so LTV is capped at whatever the user pays in their first
> few minutes, and every extra dollar has to come from a *higher price at that
> moment*, not from usage over time.

Revenue is therefore a function of **installs × conversion × ARPU** — three
numbers, with the middle one already near its ceiling (18–20%).

Working backwards from ~$120/mo net (≈$150 gross) across ~8,700 installs/mo
at ~$2 ARPU gives roughly **75 IAP sales/month ≈ 0.86% of installs**. That is
a normal, healthy rate. It is not the bottleneck.

**The bottleneck is ARPU (~$2) and a shrinking install base.**

---

## 3. Maths to $500/month net

Target ≈ $625/mo gross (after Google's cut and taxes) — **4.2× current**.

| path | what has to change | plausibility |
|---|---|---|
| Installs | 105k → 440k per year | ✗ traffic is falling |
| Conversion | 0.86% → 3.6% | ✗ already at a healthy rate |
| **ARPU** | **~$2 → ~$8.30** | ✓ only via a bundle/subscription |
| **Mixed** | 1.7% conv × $4 ARPU | ✓ friction + price together |
| **Monoic Player** | adding a second, recurring surface | ✓ the real growth axis |

**You cannot price your way to 4× by selling *one* icon request at a time.**
The only route is a product that is worth ~$8 in a single transaction, or a
second product with a repeat surface.

---

## 4. Plan, ranked by ROI

### Tier 1 — ARPU (the direct answer to 4.2×)

**1. Turn "request icons" into a bundle, not a $2 one-off.**
Offer three tiers at the point of need:

| SKU | price (US) | what it is |
|---|---|---|
| Single request | current | unchanged — the entry point |
| **Request pack** (10) | ~$3.99 | for people who just switched launchers |
| **Pro / All-Access** | **~$7.99** | unlimited requests + all packs + future packs |

The Pro tier is the whole point: it moves ARPU from ~$2 to ~$8 *without*
needing a single extra install. At the current 0.86% rate that alone is
~$500/mo. Realistically conversion on the $7.99 tier will be lower than on
$2, so expect to land at 0.3–0.5% on Pro plus the existing single-request
revenue — still ≈2–3×.

**2. Sell at the moment of pain, not in a menu.**
The request flow is the entire monetisation surface. When the user hits a
missing icon, the paywall must appear *there* with the bundle offer, not in a
settings screen. Every extra tap between "my icon is missing" and "pay" is
lost revenue.

**3. Do not fix icon coverage blindly.**
The IAP monetises *gaps*. Auto-matching more icons raises retention and
ratings but shrinks the request funnel. Decide deliberately: broad coverage
for the free tier (ratings, installs) + genuinely custom/niche requests behind
Pro. Never strip the thing people pay for.

### Tier 2 — Monoic Player + widgets (the 12-month engine)

**4. The skinnable widget is the most valuable missing feature, not a quirk.**
A player gets **opened daily** — that is a surface icon packs can never have.
Adding a skinnable home-screen widget does three things at once:

- creates a **daily-visible ad/brand surface** (icon packs cannot),
- makes **skins a repeat purchase** (collections, not a one-off),
- unifies the product line — **a "Monoic theme" = icons + widget + player
  skin** — which is exactly what a $7.99 bundle can credibly sell.

**5. Ship Player out of beta with 10–15 factory skins**, free player + paid
skins, then a skin store. This is where $500/***month*** becomes durable
rather than a one-month spike. Source lives at `~/Android/monoicplayer`.

### Tier 3 — reclaim traffic (protects the base)

**6. Stop the 13-month decay.** Conversion is flat so this is distribution.
Check crash-free rate (1,339 crash reports available), stale screenshots /
video, review-response rate, Android 15/16 compatibility. One deliberate
listing experiment per month, measured against `store_performance`.

**7. Reuse dormant packs as content.** Fold squircle1–9 / crystalorb 1/3/4/5 /
heartly* / clover artwork into Monoic White as **icon styles**, and into the
Pro bundle. Do not relaunch them as apps — a listing with 1–9 installs/month
has no demand and costs ASO + support forever.

**8. Flip Glassy free (per the 1,000-icon rule).** 3,890 visitors/mo at 0.2%
conversion is 8 sales; free-with-IAP it becomes ~700 installs/mo, a rating
base, and another surface for the Pro offer.

---

## 5. Revenue measurement — status

- `earnings/` and `sales/` **objects are listed but not downloadable**: a
  `storage.objects.get` 403 confirms the account lacks **"View financial
  data"**. Latest visible file: `earnings_202609_8878602904322988-119.zip`
  (119 monthly zips).
- Once that permission is granted, add an earnings pull to
  `scripts/pull-metrics.mjs` (the zips contain CSVs — inspect the real schema
  before writing the parser rather than guessing) so ARPU per app per month
  becomes a tracked number.

---

## 6. Summary

1. Revenue is installs × conversion × **ARPU**. Conversion is healthy at
   ~0.86%; installs are falling. **ARPU is the lever.**
2. Ship a **Pro / All-Access bundle at ~$7.99** and surface it at the moment
   an icon is missing. This is the direct path to 4.2×.
3. Keep single requests as the entry tier; add a 10-pack in between.
4. **Skinnable widgets + player skins** are the durable second engine, and
   they unify icons/widgets/player into one sellable theme.
5. Flip Glassy free; fold dormant packs in as icon styles; stop the traffic
   decay.
6. Get "View financial data" so ARPU stops being a guess.
