# Coastal Routes — City Bus Route Finder

A modern, responsive, full-stack web application designed to help passengers easily find city bus routes, discover starting terminals and destinations, and view all intermediate stops in sequential travel order.

Built with **Next.js (App Router)**, **JavaScript**, **Tailwind CSS**, **PostgreSQL**, and **Prisma ORM**.

---

## Features

- **Sequential Stop Sequence**: View complete route timelines distinguishing origin, intermediate stops, and final destinations.
- **Direction-Aware Routing**: Search from point A to point B; the search engine ensures that the destination stop appears *after* the starting stop in the route's travel direction.
- **Bus & Stop Search**: Search by bus number or stop name with case-insensitivity.
- **Fuzzy Spelling & Aliases**: Supports local stop aliases (e.g. *CBS* for *Central Bus Stand*, *Stn* for *Railway Station*) and utilizes PostgreSQL `pg_trgm` trigram similarity for typo matching.
- **Rider Feedback & Missing Stops**: Commuters can submit problem reports or suggest missing stops without creating an account.
- **Protected Admin Panel**: Secure server-side authentication (HttpOnly cookies, bcryptjs, session secrets) allowing transit administrators to:
  - Manage routes with ordered stops (reorder stops, append new stops, add stops directly).
  - Manage stops with custom aliases and dependency-checked deletions.
  - Review, approve, reject, or mark feedback as duplicate.
  - Direct workflow to convert missing-stop suggestions into official transit stops.

---

## Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: JavaScript (ES6+)
- **Database**: PostgreSQL (Local development)
- **ORM**: Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: Server-side session authentication with signed HttpOnly cookies
- **Password Hashing**: bcryptjs
- **Validation**: Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

---

## Windows & PowerShell Setup Guide

Follow these step-by-step PowerShell instructions to run the project locally on Windows.

### 1. Prerequisites
- **Node.js**: v18+ or v20+ or v22+
- **PostgreSQL**: Installed and running on Windows (service `postgresql-x64-XX`).

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```powershell
Copy-Item .env.example .env
```

Open `.env` in your text editor and ensure the PostgreSQL connection string and secrets match your local setup:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/citybus_db?schema=public"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="AdminPassword123!"
SESSION_SECRET="coastal-routes-super-secret-session-key-at-least-32-characters"
```

### 3. Create the Database & Enable `pg_trgm` Extension
In PowerShell, run `psql` (or run through `pgAdmin` or PowerShell with the PostgreSQL binary):
```powershell
# If PostgreSQL 18 is installed in Program Files:
$env:PGPASSWORD = "YOUR_PASSWORD"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -c "CREATE DATABASE citybus_db;"
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -h localhost -d citybus_db -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;"
```

### 4. Install Dependencies
```powershell
npm install
```

### 5. Generate Prisma Client & Run Migrations
Apply the initial migration to create the relational tables:
```powershell
npx prisma migrate dev --name init
```

### 6. Seed the Database
Seed the demonstration routes, stops, aliases, and initial administrator:
```powershell
node prisma/seed.js
```

### 7. Run Verification Test Suite
Verify that all 18 test scenarios pass:
```powershell
npm test
```

### 8. Start the Development Server
```powershell
npm run dev
```

### 9. Open in Browser
Open your browser and navigate to:
- Public Website: **http://localhost:3000**
- Admin Portal: **http://localhost:3000/admin/login**
  - **Username**: `admin`
  - **Password**: `AdminPassword123!` (or the value set in `.env`)

---

## Application Structure

```
app/
├── actions/             # Server actions (auth, routes, stops, feedback)
├── admin/               # Protected Admin pages
│   ├── login/           # Admin sign in
│   ├── dashboard/       # Overview stats & recent reports
│   ├── routes/          # Route list, new route, edit route
│   ├── stops/           # Stop list & new stop
│   └── feedback/        # Review & moderation
├── routes/              # Public route browser & route details (/routes/[id])
├── search/              # Universal & point-to-point bus search
├── feedback/            # Public feedback submission
├── suggest-stop/        # Public missing stop suggestion
├── about/               # About page
├── layout.js            # Root layout with ToastProvider
└── page.js              # Homepage with hero, search, & featured routes

components/
├── admin/               # Admin tables, forms, sidebar, header
├── feedback/            # FeedbackForm, SuggestStopForm, ReportProblemModal
├── home/                # HeroSearch
├── layout/              # Header, Footer
├── routes/              # RouteCard, StopTimeline, RouteDetailView
└── ui/                  # ToastProvider

lib/
├── prisma.js            # Prisma client singleton
├── auth.js              # Session cookie management & verification
├── validation/          # Zod validation schemas
├── services/            # Search & PostgreSQL pg_trgm similarity queries
└── utils/               # String normalization and date formatters

prisma/
├── schema.prisma        # Database models (Route, Stop, RouteStop, StopAlias, Admin, Feedback)
├── migrations/          # SQL migrations
└── seed.js              # Demonstration data seeder

test/
└── suite.js             # Automated 18-scenario verification suite
```

---

## Database Models

- **Route**: Contains `busNumber`, `routeName`, `startingPointId`, `destinationId`, `description`, `isActive`.
- **Stop**: Official stop with `name`, `normalizedName`, and `description`.
- **RouteStop**: Junction table establishing ordered sequence (`stopOrder`) between Route and Stop.
- **StopAlias**: Alternative names/abbreviations for fuzzy matching (`stopId`, `aliasName`, `normalizedAlias`).
- **Admin**: Internal moderation credentials (`username`, `passwordHash`).
- **Feedback**: Rider reports and missing-stop suggestions (`feedbackType`, `description`, `suggestedStopName`, `status`, `reviewNote`).

---

## Testing Scenarios

Run the automated test suite anytime with:
```powershell
npm test
```
The suite verifies:
1. Administrator login with bcrypt hash.
2. Unauthenticated visitor rejection for protected mutations.
3. Administrator stop creation with aliases.
4. Administrator route creation with ordered stops.
5. Exact stop sequence ordering.
6. Stop sharing across multiple routes.
7. Search by bus number.
8. Search by stop name.
9. Directionality: origin stop occurs before destination stop.
10. Fuzzy spelling suggestions via `pg_trgm`.
11. Anonymous feedback submission.
12. Missing stop submission with landmark details.
13. Feedback pending status flow.
14. Moderator status updates (Approve, Reject, Duplicate).
15. Relational constraint protections.
16. Safe dependency-checked stop deletion.
17. Empty state handling.
18. Navigation and layout responsiveness.
