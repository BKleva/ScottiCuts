# ScottiCuts

Website + online booking portal for ScottiCuts Barbershop (426 Shore Rd Unit E, Somers Point, NJ).

- `public/` — static site: `/` (site + booking), `/manage` (customer cancel link), `/admin` (owner calendar/settings/team), `/staff` (barber profile + portfolio)
- `netlify/functions/` — booking, availability, admin, barber-profile and image-serving APIs (storage: Netlify Blobs)
- `source/` — original brand art

## Local dev
```
npm install
netlify dev --offline --port 8098
```
Create a `.env` (gitignored) with `ADMIN_USER`, `ADMIN_PASS`, `ADMIN_SECRET`.

## Production env (Netlify)
`ADMIN_USER`, `ADMIN_PASS`, `ADMIN_SECRET`, `AWS_LAMBDA_JS_RUNTIME=nodejs22.x`.
Optional email: `RESEND_API_KEY`, `RESEND_FROM`, `NOTIFY_EMAIL` (defaults to ben@shoreworksnj.com).
