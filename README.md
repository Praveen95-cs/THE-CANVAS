# The Canvas — Canva-like Editor (Next.js)

A full-stack, Canva-like design editor built with Next.js App Router, Drizzle ORM (Neon Postgres), Auth.js (NextAuth), UploadThing, Stripe, Replicate, and Unsplash.

## Features
- Authentication: Credentials, Google, GitHub (Auth.js + Drizzle adapter)
- Projects: Create, edit, and manage design projects (Fabric.js-based editor)
- Assets: Upload via UploadThing; fetch stock images from Unsplash
- AI Tools: Image generation and background removal (Replicate)
- Billing: Stripe checkout and subscriptions
- Server: Hono-based API routes mounted under `src/app/api/[[...route]]`

## Tech Stack
- Frontend: Next.js 14 (App Router), React, TailwindCSS, Radix UI
- Editor: Fabric.js (5.3.0-browser)
- API: Hono (edge friendly), UploadThing
- Auth: Auth.js (NextAuth) with Drizzle adapter
- DB: Drizzle ORM + Neon Serverless Postgres
- Payments: Stripe
- AI: Replicate
- Media: Unsplash

## Project Structure
Key folders:
- `src/app` — App Router pages, layouts, API mounting
- `src/app/api/[[...route]]` — Hono routers: `images.ts`, `projects.ts`, `users.ts`, `subscriptions.ts`, `ai.ts`, `route.ts`
- `src/features` — Feature modules (editor, auth, ai, projects, images)
- `src/db` — Drizzle client and schema
- `drizzle/` — SQL migrations

Example:
- `src/db/schema.ts` — Tables: `user`, `account`, `session`, `verificationToken`, `authenticator`, `project`, `subscription`
- `src/lib` — Service clients (Unsplash, Stripe, Replicate, UploadThing, Hono client, etc.)

## Getting Started
### 1) Prerequisites
- Node 18+ and npm
- Neon Postgres database (connection string)
- Keys for: Unsplash, UploadThing, Replicate, Stripe, Google OAuth, GitHub OAuth

### 2) Install dependencies
```bash
npm install
```

### 3) Environment variables
Copy the template and fill in your values:
```bash
cp .env.example .env
# or create .env.local if you prefer
```
See the full variable reference in the next section.

### 4) Database migration
You can use Drizzle Kit or the provided Node migration script (works without Bun):

- Option A: Drizzle Kit push
```bash
npx drizzle-kit push
```

- Option B: Node migration script (executes the SQL file sequentially)
```bash
node migrate.js
```

### 5) Run the dev server
```bash
npm run dev
```
The app will start at http://localhost:5000 (or the next available port).

## Environment Variables
Create a `.env` (or `.env.local`) with:

Required
- `NEXT_PUBLIC_APP_URL` — Base URL (e.g., http://localhost:5000)
- `DATABASE_URL` — Neon Postgres URL (with `sslmode=require`)
- `NEXTAUTH_URL` — Same as app URL (e.g., http://localhost:5000)
- `AUTH_SECRET` — 32+ byte secret (use `openssl rand -hex 32`)

Auth providers
- `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`
- `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`

Media & AI
- `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY` — Unsplash Access Key
- `UPLOADTHING_APP_ID`, `UPLOADTHING_SECRET`
- `REPLICATE_API_TOKEN`

Billing (Stripe)
- `STRIPE_SECRET_KEY`
- `STRIPE_PRICE_ID` — Price ID for subscriptions (required for checkout)
- `STRIPE_WEBHOOK_SECRET` — If using webhooks locally
- `DISABLE_BILLING` and `NEXT_PUBLIC_DISABLE_BILLING` — Use `true` to disable billing

Other
- `GOOGLE_APPLICATION_CREDENTIALS` — Path if using Firestore (optional)

See `.env.example` for a complete template.

## NPM Scripts
- `npm run dev` — Start Next.js dev server
- `npm run build` — Build the app
- `npm run start` — Start production server
- `npm run lint` — Lint
- `npx drizzle-kit generate` — Generate migrations from schema
- `npx drizzle-kit migrate` — Apply migrations (requires config/adapter)
- `npx drizzle-kit push` — Push schema to DB (simple for initial setup)
- `node migrate.js` — Run bundled sequential migration against Neon (no Bun needed)

## API Overview
All routes are handled via Hono under `src/app/api/[[...route]]`:
- `GET /api/images` — Fetch random Unsplash images (requires auth). Uses `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`. Returns `{ data: UnsplashPhoto[] }`.
- `GET /api/projects` — List projects (pagination).
- `POST /api/projects` — Create a project.
- `GET /api/projects/:id` — Fetch a project.
- `PATCH /api/projects/:id` — Update a project.
- `GET /api/projects/templates` — List template projects.
- `GET /api/subscriptions/current` — Current subscription for user.
- `POST /api/subscriptions/checkout` — Begin Stripe Checkout (needs `STRIPE_PRICE_ID`).
- `GET /api/images` — Unsplash images (auth required).
- `Auth` — `GET /api/auth/*` handled by Auth.js (NextAuth).

## Common Workflows
- Sign in: Google or GitHub OAuth, or credentials
- Create a project: Dashboard → New project → Editor
- Upload an image: Editor → Image sidebar → Upload (UploadThing)
- Use AI: Editor → AI sidebar (Replicate)
- Subscribe: Dashboard → Upgrade (Stripe Checkout)

## Troubleshooting
- Port in use: `Error: listen EADDRINUSE :5000` → Stop the process on 5000 or pick a free port.
- Bun not found: Scripts using `bunx` will fail if Bun isn't installed. Use `npx drizzle-kit ...` or `node migrate.js` instead.
- `relation "user" does not exist` / `relation "account" does not exist`: Run the DB migrations (see above).
- Unsplash 400 errors: Check logs. If you see `OAuth error: The access token is invalid`, set a valid `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`.
- Stripe `parameter_invalid_empty` for `line_items[0][price]`: Set `STRIPE_PRICE_ID` to a valid Stripe Price ID.
- `next` not recognized: Run `npm install`.

## Security Notes
- Do not commit real secrets. Use `.env.local` for local dev, and environment variables in deployment.
- Rotate any leaked keys immediately.

## License
MIT (or your preferred license)
