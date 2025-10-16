# Troubleshooting

## Dev server
- EADDRINUSE :5000: Stop the process using port 5000 or change the port.
- `next` not recognized: Run `npm install`.

## Database (Neon + Drizzle)
- `relation "user" does not exist` / `relation "account" does not exist`:
  - Run migrations: `npx drizzle-kit push` or `node migrate.js`.
- SSL errors: Ensure `?sslmode=require` is present in `DATABASE_URL`.

## Auth
- 401/redirect loops: Check `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` match your local URL.
- OAuth provider errors: Verify Google/GitHub credentials and callback URLs.

## Unsplash
- 400 errors with `OAuth error: The access token is invalid`:
  - Set a valid `NEXT_PUBLIC_UNSPLASH_ACCESS_KEY`.
  - Unsplash free tier is rate limited; retry later.

## UploadThing
- Dev server logs simulate callbacks; ensure env vars are set in production.

## Stripe
- `parameter_invalid_empty: line_items[0][price]`:
  - Set `STRIPE_PRICE_ID` in `.env` to a valid Price ID from your Stripe dashboard.
- Webhook signature errors: Use correct `STRIPE_WEBHOOK_SECRET`.

## Misc
- Bun missing: Use `npx drizzle-kit ...` instead of `bunx`, or install Bun.
