# ScopeSprint

**Ship the right scope. Not the biggest scope.**

An AI engineering manager that turns ambitious project ideas into realistic, time-bounded MVPs — before scope creep turns into a missed deadline.

**Live demo → [scopesprint-app.vercel.app](https://scopesprint-app.vercel.app)**

---

## The problem

Hackathon teams lose to their own ambition. They plan eight features, build three badly, and demo none. The failure isn't skill — it's that nobody priced the plan against the clock before starting.

## What ScopeSprint does

You describe what you want to build, how many minutes you actually have, and your skill level. It returns a plan you can ship.

**1. Scope analysis** — breaks the idea into concrete features and estimates effort for each, scaled to your experience level.

**2. BUILD / SIMPLIFY / CUT** — every feature gets a verdict:

| Verdict | Meaning |
|---|---|
| **BUILD** | Essential to the core demo. Ship it. |
| **SIMPLIFY** | Worth having, but only in reduced form — comes with a concrete alternative and a revised estimate. |
| **CUT** | Not necessary. Comes with a reason you can defend to your team. |

**3. Feasibility score** — a live 0–100 read on whether the current plan fits the budget, with risk escalating to `IMPOSSIBLE` past 1.5× your available time.

**4. What-if simulator** — toggle features on and off, apply simplifications, and watch the time budget and risk level recalculate instantly. All client-side, so experimenting costs nothing.

**5. Make this achievable** — one button. Applies simplifications first, then cuts non-essential features in priority order until the plan fits. Never auto-cuts a BUILD feature.

## Tech stack

- **React 18** + **Vite 5**
- **lucide-react** for iconography
- Hand-rolled CSS design system — no UI framework
- **Google Gemini** (`gemini-1.5-flash`) for scope analysis
- Deployed on **Vercel**

No backend. No database. The simulator logic runs entirely in the browser.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:5173.

### AI configuration (optional)

ScopeSprint runs without any API key — it falls back to a worked demo scenario so the full flow stays explorable. To enable live analysis:

```bash
cp .env.example .env
```

Then add your [Google AI Studio](https://aistudio.google.com/app/apikey) key:

```
VITE_GEMINI_API_KEY=your_key_here
```

`.env` is gitignored. Never commit a real key.

> **Note on deployment:** `VITE_`-prefixed variables are inlined into the client bundle at build time, which makes them readable by anyone who views the deployed page source. If you deploy with a live key, restrict it by HTTP referrer in the Google Cloud Console, or move the call behind a serverless function.

## Building for production

```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

## Project structure

```
src/
├── App.jsx                      # state, scope math, "make achievable" logic
├── lib/ai.js                    # Gemini call, prompt, mock fallback
├── components/
│   ├── InputForm.jsx            # landing page and sprint definition
│   ├── ScopeSimulator.jsx       # dashboard, feasibility score, what-if
│   └── FeatureItem.jsx          # per-feature row, toggle, simplification
└── index.css                    # design system
```

---

Built for BuildSprint 2026.
