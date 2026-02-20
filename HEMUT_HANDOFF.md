# Hemut — Consulting Delivery Handoff

**Delivered by:** Caleb Newton · February 2026
**Live demo:** https://hemut-wheat.vercel.app
**Login:** `ricky@hemut.io` / `hemut2026`
**Stack:** Next.js 16.1.6 · Prisma v7 · Turso (LibSQL) · NextAuth v5 · Tailwind v4 · Vercel

---

## What Was Built

Three production-ready modules directly addressing both project briefs, plus a complete auth system and full database/API layer.

### 1. Communications Hub (`/communications`)
- Unified inbox across 5 channels: Dispatch, Compliance, Driver, Customer, Team
- Per-message unread state that clears on drawer open
- Reply drawer with **AI Draft** button (calls Ollama Cloud API — generates contextual, professional replies specific to each message)
- Compose new message modal (To, Subject, Body)
- Channel filter sidebar with unread dot indicators
- Priority tagging (Critical/High) with color-coded left border
- KPI strip: Messages Today, Compliance Alerts, Driver Check-ins, Avg Response Time

### 2. Onboarding Framework (`/onboarding`)
- Active Members tab: card grid with progress bars, task previews, role badges
- Click → slide-in detail drawer with full task checklist (toggle individual tasks), notes, "Mark Complete"
- Role Tracks tab: CDL Driver, Dispatcher, Finance, Admin tracks with step-by-step checklists (expandable)
- Master Checklist tab: universal checklist grouped by phase (Pre-Hire → Certification), filterable by role, toggle items done
- "Start Onboarding" modal: add new onboardee with name, role, start date, mentor — immediately creates a card
- KPI strip: Active Onboardees, Avg Time to Ramp, DOT Compliance Rate, Pending Actions

### 3. Newsletter System (`/newsletter`)
- Newsletter list with type pills, status badges (Sent/Scheduled/Draft), open rate bars, topic chips
- Blueprint gallery: 4 pre-configured templates (Weekly Ops, Driver Bulletin, Finance Brief, Company-Wide)
- Compose modal with blueprint selector (auto-fills fields), recipients, schedule, and **AI Draft** (calls Ollama Cloud)
- KPI strip: Sent This Month, Total Recipients, Avg Open Rate, Scheduled

### Auth (`/login`)
- NextAuth v5 credential auth
- Protected routes via Edge middleware (`proxy.ts`)
- Session available throughout app

---

## Environment Setup

### 1. Clone and Install

```bash
git clone <repo>
cd hemut
npm install
```

### 2. Environment Variables

Create `.env.local` (or set in Vercel dashboard):

```env
# Database (Turso - LibSQL)
TURSO_DATABASE_URL="libsql://your-db.aws-us-west-2.turso.io"
TURSO_AUTH_TOKEN="your_turso_token"

# Auth
AUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="https://your-domain.vercel.app"

# Ollama Cloud AI (REQUIRED for AI Draft features)
OLLAMA_API_KEY="your_ollama_api_key"
OLLAMA_MODEL="llama3.2"

# Samsara ELD Integration (optional - app runs in sandbox without it)
SAMSARA_API_KEY="your_samsara_key"
SAMSARA_WEBHOOK_SECRET="your_webhook_secret"
```

### 3. Get Your Ollama API Key

1. Create account at https://ollama.com
2. Go to https://ollama.com/settings/keys
3. Create a new API key
4. Add as `OLLAMA_API_KEY` in Vercel environment variables

**Recommended cloud models** (set via `OLLAMA_MODEL`):
- `llama3.2` — fast, free tier, good quality
- `gpt-oss:20b-cloud` — faster cloud inference
- `deepseek-v3.1:671b-cloud` — highest quality, heavier

The AI endpoint is at `/api/ai` — it falls back to pre-written content if the API key is not set.

### 4. Database (Turso)

The app uses Turso (hosted LibSQL) with Prisma v7.

```bash
# Push schema to your Turso database
npx prisma db push

# Seed demo data (optional)
npx prisma db seed
```

**Important:** Prisma uses `@prisma/adapter-libsql/web` (HTTP transport) for Vercel serverless compatibility. Do NOT switch to the standard `libsql://` WS transport in production — it won't work on Vercel Edge.

### 5. Add to Vercel

```bash
vercel --prod
```

In Vercel dashboard → Settings → Environment Variables, add all vars from step 2.

---

## Replacing Mock Data with Real Data

All three pages currently use mock data defined at the top of their client files. Here's how to wire each to your real backend:

### Communications Hub
**File:** `src/app/communications/CommunicationsClient.tsx`

Replace the `messages: Message[]` constant (~line 124) with a `useEffect` that fetches from your messaging API:

```typescript
const [messages, setMessages] = useState<Message[]>([]);
useEffect(() => {
  fetch("/api/messages").then(r => r.json()).then(setMessages);
}, []);
```

Create `/api/messages/route.ts` that queries your database and returns messages in the `Message` interface shape.

### Onboarding Framework
**File:** `src/app/onboarding/OnboardingClient.tsx`

Replace `INITIAL_MEMBERS` and `INITIAL_MASTER_ITEMS` constants with API fetches. The `OnboardingMember` and `MasterItem` interfaces define the expected shape.

Add Prisma models for `OnboardingMember`, `OnboardingTask`, and `MasterChecklistItem` to `prisma/schema.prisma`.

### Newsletter System
**File:** `src/app/newsletter/NewsletterClient.tsx`

Replace `NEWSLETTERS` and `BLUEPRINTS` constants with API calls. The existing `/api` directory structure (`src/app/api/`) already has examples of how to write Prisma-backed routes.

---

## AI Integration Details

**Endpoint:** `POST /api/ai`
**File:** `src/app/api/ai/route.ts`

### Request Format

```typescript
// For reply generation (Communications Hub)
{
  type: "reply",
  context: {
    from: string,       // "K. Johnson (D-028)"
    channel: string,    // "driver"
    subject: string,    // "Check-in: Load L-8819..."
    fullBody: string,   // full message text
  }
}

// For newsletter draft (Newsletter System)
{
  type: "draft",
  context: {
    newsletterType: string,  // "weekly-ops" | "driver-bulletin" | ...
    audience: string,        // "All Active CDL Drivers"
    sections: string,        // comma-separated section names
  }
}
```

### Response

```typescript
{ text: string }
```

### Extending AI

Add new `type` values to handle other use cases (e.g., `"onboarding-note"`, `"compliance-summary"`). The system prompt pattern is already established — just add a new `else if (type === "...")` branch.

---

## Key Files

```
src/
├── app/
│   ├── layout.tsx                          # Root layout, Sidebar import, SessionProvider
│   ├── page.tsx                            # → redirects to /communications
│   ├── communications/
│   │   ├── page.tsx
│   │   └── CommunicationsClient.tsx        # ← Primary deliverable 1
│   ├── onboarding/
│   │   ├── page.tsx
│   │   └── OnboardingClient.tsx            # ← Primary deliverable 2
│   ├── newsletter/
│   │   ├── page.tsx
│   │   └── NewsletterClient.tsx            # ← Primary deliverable 3
│   ├── api/
│   │   ├── ai/route.ts                     # Ollama Cloud AI endpoint
│   │   ├── drivers/route.ts                # CRUD
│   │   ├── loads/route.ts                  # CRUD
│   │   ├── alerts/route.ts                 # CRUD
│   │   ├── fleet/positions/route.ts        # GPS positions
│   │   └── eld/                            # Samsara ELD integration
│   └── login/LoginClient.tsx               # Auth UI
├── components/
│   ├── layout/Sidebar.tsx                  # Global navigation
│   └── modals/                             # Dispatch, Assign, Alert modals
├── lib/
│   ├── db.ts                               # Prisma + Turso client
│   └── utils.ts                            # cn() helper
└── auth.ts / auth.config.ts                # NextAuth v5 split config (Edge + Node)
```

---

## Samsara ELD Integration

The Samsara integration scaffold is at `src/app/api/eld/`. It runs in simulation mode when no `SAMSARA_API_KEY` is set.

To go live:
1. Add your Samsara API key to environment variables
2. Set `SAMSARA_WEBHOOK_SECRET` for verified webhook delivery
3. Webhook endpoint: `POST /api/webhooks/samsara`

Real driver positions from Samsara will automatically flow into the fleet map on the dashboard.

---

## Design System

Hemut uses a consistent dark navy design system:

| Token | Value |
|-------|-------|
| Background | `#080d1a` |
| Surface | `rgba(255,255,255,0.03)` |
| Surface hover | `rgba(255,255,255,0.05)` |
| Border | `rgba(255,255,255,0.06–0.08)` |
| Brand accent | `amber-500` (`#f59e0b`) |
| Card radius | `rounded-2xl` (16px) |
| Icon box radius | `rounded-xl` (12px) |
| Button radius | `rounded-xl` (12px) |
| Font | Inter |

---

## Deployment Checklist

- [ ] Add all environment variables to Vercel dashboard
- [ ] Get Ollama API key and set `OLLAMA_API_KEY`
- [ ] Set `AUTH_SECRET` to a real random secret (`openssl rand -base64 32`)
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Set up Turso database and run `prisma db push`
- [ ] Change demo login credentials (`ricky@hemut.io` / `hemut2026`) in `prisma/seed.ts`
- [ ] Optionally connect Samsara ELD for real fleet tracking
- [ ] Replace mock data constants with real API calls (see "Replacing Mock Data" section)

---

Built by Caleb Newton · February 2026
