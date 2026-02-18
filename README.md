# Hemut — AI-Powered Logistics OS

> Intelligent operating system for trucking and logistics operations

Hemut is a seed-stage SaaS platform built to automate back-office workflows — dispatch, invoicing, load tracking, communication, and accounting — for trucking fleets.

## Features

### 📊 Operations Dashboard
Real-time fleet metrics, AI-generated insights, live activity feed, and team status — everything visible from one screen.

### 🧭 Onboarding Framework
Scalable, role-based onboarding system for drivers, dispatchers, finance, and admin teams. Multi-step tracking with progress visibility, mentor assignments, and master checklists.

### 📬 Newsletter System
Structured communication blueprints for every team segment:
- **Weekly Ops Digest** — Monday morning briefing for dispatchers
- **Driver Update** — Bi-weekly safety, pay, and app news
- **Finance Brief** — Monthly financial summary for leadership
- **Company-Wide Bulletin** — Quarterly all-hands update

### 💬 Communications Hub
Cross-functional communication system designed to eliminate information silos. Features a unified inbox, protocol definitions, AI silo detection, and team communication health scoring.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Operations Dashboard
│   ├── onboarding/page.tsx   # Onboarding Framework
│   ├── newsletter/page.tsx   # Newsletter System
│   ├── communications/page.tsx # Communications Hub
│   └── layout.tsx            # Root layout with sidebar
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx       # Navigation sidebar
│   └── ui/
│       ├── Badge.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       └── ProgressBar.tsx
└── lib/
    └── utils.ts              # Utility functions
```

## Deployment

Connect your GitHub repository to Vercel for automatic deployments on every push.

---

Built for Hemut — *Moving logistics forward with AI.*
