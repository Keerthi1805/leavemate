# LeaveMate

A modern leave management system for organizations to handle employee leave requests, approvals, and tracking.

## Features

- Admin dashboard with employee management and leave approval workflow
- Employee dashboard with leave application and history tracking
- Role-based authentication (Admin / Employee)
- Self-service employee signup
- Responsive UI built with React, Tailwind CSS, and shadcn/ui

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- React Router
- TanStack Query

## Getting Started

Requirements: Node.js 18+ and npm.

```sh
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build
```

The dev server runs on http://localhost:8080.

## Default Credentials

- **Admin** — username: `admin`, password: `1234`
- **Employee** — username: `john`, password: `545454`

New employees can register from the Employee tab on the login page.

## Deployment (Vercel)

1. Push the project to a GitHub repository.
2. Import the repo at https://vercel.com/new.
3. Vercel auto-detects Vite — keep the defaults:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**.

A `vercel.json` is included to handle client-side routing (SPA fallback).

## License

MIT