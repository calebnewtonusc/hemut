# Hemut — AI Logistics OS

![Next.js](https://img.shields.io/badge/Next.js_16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![NextAuth](https://img.shields.io/badge/NextAuth.js-black?style=flat-square&logo=next.js)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel)

Internal operations dashboard for Hemut — an AI operating system for trucking and logistics. Built for Avenues Tech Consulting Spring 2026.

**Live:** https://hemut-wheat.vercel.app

> Screenshot

## Features

- **Unified Communications Hub** — Multi-channel inbox aggregating dispatch alerts, driver check-ins, compliance events, customer messages, and team communications in one view
- **Load & Dispatch Board** — Real-time tracking of active loads with driver assignments, route progress, ETA, and revenue-per-mile metrics
- **Driver Management** — CDL driver profiles with HOS (hours-of-service) tracking, CSA safety scores, status, and location data
- **New Hire Onboarding** — Role-based onboarding tracks with compliance checklists, progress indicators, and document management
- **Newsletter System** — AI-assisted draft generation with blueprint templates for driver and customer communications
- **Fleet & Compliance** — Centralized alert management for regulatory events with severity tracking and resolution workflows

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | NextAuth v5 + `@auth/prisma-adapter` |
| Database | SQLite via Prisma ORM + `@libsql/client` |
| UI Components | Radix UI primitives + Lucide React icons |
| Deployment | Vercel |

## Getting Started

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Seed demo data:

```bash
npx prisma db seed
```

Open [http://localhost:3000](http://localhost:3000) — the app redirects to `/communications` by default.

### Environment Variables

```env
AUTH_SECRET=your-auth-secret
DATABASE_URL=file:./dev.db
```

## Project Structure

```
src/app/
  communications/    # Unified inbox (dispatch, drivers, compliance, customers, team)
  dispatch/          # Load board and assignment management
  drivers/           # Driver profiles and HOS tracking
  onboarding/        # New hire onboarding tracker
  newsletter/        # AI-assisted newsletter drafting
  fleet/             # Fleet status and alerts
  compliance/        # Regulatory compliance events
  analytics/         # Operations analytics
prisma/
  schema.prisma      # Data models: User, Company, Driver, Load, Alert
```

## Author

**Caleb Newton** — [calebnewton.me](https://calebnewton.me)
Built for Avenues Tech Consulting · Spring 2026
