# AquaFlow Plumbing Backend

This is a separate local Express + TypeScript backend for the AquaFlow Plumbing demo. It accepts leads, records simulated automation activity, and can send an administrative notification through the official Resend SDK. The frontend remains usable when this service is stopped; it keeps the local demo lead and shows a warning toast instead of pretending that email was sent.

## Setup

From the repository root:

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Edit `backend/.env` with local values:

```env
PORT=8787
FRONTEND_URL=http://127.0.0.1:3000
RESEND_API_KEY=re_your_test_key_here
EMAIL_FROM=onboarding@resend.dev
ADMIN_EMAIL=your-verified-test-recipient@example.com
```

Never commit `.env` or put the Resend key in frontend code. In Resend test mode, use `onboarding@resend.dev` and a permitted test recipient. The backend only sends to `ADMIN_EMAIL`; it rejects arbitrary customer recipients.

## Run and verify

```powershell
npm run dev
```

In another terminal:

```powershell
Invoke-RestMethod http://127.0.0.1:8787/api/health
Invoke-RestMethod http://127.0.0.1:8787/api/automation/activity
```

Build the backend with `npm run build`, run the in-process API tests with `npm test`, then run the compiled server with `npm start`.

Email status is explicit: `sent` means Resend accepted the request and returns a provider ID; `not_configured` means the service is running without usable Resend credentials; `failed` means the provider or validation rejected the request. This project does not claim customer-facing delivery.

## API

- `GET /api/health`
- `POST /api/leads` — validated, idempotent lead intake and admin email notification
- `POST /api/messages/email` — restricted administrative email endpoint
- `GET /api/automation/activity` — recent backend automation activity

The demo store is intentionally in-memory for this client presentation backend. Replace it with a database before production use.
