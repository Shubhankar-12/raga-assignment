# Carevia — B2B Healthcare SaaS UI

A production-quality demo of a healthcare SaaS frontend built for the Frontend
Developer assignment. It models the day-to-day workflow of a clinic: signing
in, scanning the dashboard, drilling into a patient, and watching analytics.

## Tech stack

- **Framework**: Next.js 16 (App Router) + React 18 + TypeScript (strict)
- **Styling**: Tailwind CSS with a small in-house design system
- **State**: Zustand (auth, patients, UI prefs) — chosen for its tiny footprint
  and zero-boilerplate ergonomics versus Redux for a project of this size
- **Auth**: Local email/password auth backed by `localStorage` — no external
  provider required, so the app runs end-to-end out of the box
- **Charts**: Recharts
- **Notifications**: Native Service Worker + Notifications API (push-ready)
- **Icons**: lucide-react

## Running the app

```bash
pnpm install
pnpm dev
```

The app is at <http://localhost:3000>. You'll be redirected to `/login`. Any
email + a password of 6+ characters will sign you in (default form values
work as-is). The session is persisted in `localStorage`.

### Production build

```bash
pnpm build
pnpm start
```

## Feature checklist

| Requirement                                     | Where                                                     |
| ----------------------------------------------- | --------------------------------------------------------- |
| React + TypeScript + state management           | Throughout — Zustand stores in `src/store/`               |
| Authentication (login flow, validation, errors) | `src/app/login/page.tsx`, `src/lib/auth.ts`               |
| Login page                                      | `/login`                                                  |
| Dashboard / home                                | `/dashboard`                                              |
| Analytics page                                  | `/analytics`                                              |
| Patient details module                          | `/patients` (list) + `/patients/[id]` (single)            |
| Grid view                                       | `src/components/patients/patient-card.tsx`                |
| List view                                       | `src/components/patients/patient-list.tsx`                |
| Toggle to switch views                          | `src/components/patients/view-toggle.tsx` (persisted)     |
| Service worker                                  | `public/sw.js` registered by `sw-provider.tsx`            |
| Push / local notifications                      | Bell button in header — sends a test notification         |
| Responsive UI                                   | All pages — sidebar collapses < `lg`, mobile patient list |

## Folder layout

```
src/
├── app/
│   ├── layout.tsx              # root layout — providers, metadata, manifest
│   ├── page.tsx                # routes to /login or /dashboard
│   ├── globals.css
│   ├── login/page.tsx          # login + sign-up
│   └── (app)/                  # protected route group
│       ├── layout.tsx          # AuthGuard + sidebar shell
│       ├── dashboard/page.tsx
│       ├── analytics/page.tsx
│       └── patients/
│           ├── page.tsx        # list with grid/list toggle, filters, search
│           └── [id]/page.tsx   # patient details + vitals chart
├── components/
│   ├── ui/                     # design system: Button, Card, Input, Badge, …
│   ├── layout/                 # Sidebar, Header, AuthGuard
│   ├── patients/               # PatientCard, PatientList, ViewToggle
│   ├── charts/                 # Recharts wrappers + StatCard
│   ├── notifications/          # Notification bell button
│   └── providers/              # AuthProvider, ServiceWorkerProvider
├── store/                      # Zustand: auth-store, patient-store, ui-store
├── lib/                        # auth, notifications, utils
├── data/                       # mock-patients (swap for real API)
└── types/                      # shared TS types
```

## Notes on architecture

- **Why Zustand?** For state that's mostly UI-local with a few cross-cutting
  slices (auth, patient cache, view prefs), Zustand gives Redux-style stores
  without action/reducer boilerplate. The `ui-store` persists the grid/list
  preference to `localStorage` via the `persist` middleware.
- **Auth as a thin wrapper.** `src/lib/auth.ts` exposes a small
  `signIn / signOut / onAuthStateChanged` API backed by `localStorage`. The
  store talks to the wrapper, not the storage layer directly — swapping in a
  real provider later (Firebase, Cognito, custom JWT) is a one-file change.
- **Route groups for protection.** Everything inside `app/(app)/` is wrapped by
  `AuthGuard` in the group layout, so individual pages don't need to repeat
  the redirect-on-logged-out logic.
- **Mock data.** `src/data/mock-patients.ts` is a stand-in for an API. The
  store's `load()` is already async, so dropping in a real `fetch` call later
  is a one-line change.
- **Service worker.** `public/sw.js` handles `push` (server-driven), local
  notifications via `registration.showNotification()`, and `notificationclick`
  to focus or open the deep-linked URL. The bell in the header walks the user
  through permission grant → fires a sample alert.

## Known scope choices

- No authorization-per-route by user role — out of scope for this assignment
  but the `AuthGuard` is the obvious extension point.
- Patient list is in-memory and filtered client-side. For thousands of
  patients I'd paginate server-side and virtualise the list.
- VAPID web-push from a server is wired in `sw.js` (`push` listener) but not
  set up end-to-end — the in-app notifications cover the demo requirement.

## Scripts

| Command           | What it does             |
| ----------------- | ------------------------ |
| `pnpm dev`        | Run Next.js dev server   |
| `pnpm build`      | Production build         |
| `pnpm start`      | Serve the built app      |
| `pnpm lint`       | Next ESLint              |
| `pnpm type-check` | TypeScript no-emit check |
