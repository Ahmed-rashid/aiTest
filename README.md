# aiTest

Full-stack implementation of a Fitness & Gym Management System prototype.

## Frontend (Vite + React + TypeScript)

```bash
cd frontend
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Backend (Node.js + Express)

The backend includes production-style API modules for:
- Member lifecycle (create/list/plan assignment)
- Class scheduling and booking with waitlist logic
- Access authorization and check-in feed
- Billing/invoices and idempotent payment webhooks
- Overview dashboard KPIs

Run locally:

```bash
cd backend
npm install
npm start
```

Run tests:

```bash
npm test
```

Default base URL: `http://localhost:4000/api`
