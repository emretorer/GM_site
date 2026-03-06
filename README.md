# GM Site
Game-based student discovery platform with role-based dashboards (Parent, Student, School), built with React + Vite on the frontend and Express + Firebase Admin on the backend.

## Portfolio Summary
This project is a multi-role web product concept that combines:

- Marketing website pages
- Role-based panel UX
- Authentication flow
- API integration layer
- Mock-first frontend architecture for offline/demo usage

It is designed so the UI can still run without a live backend by enabling mock mode.

## What I Built
- Multi-route React application with separate panel experiences for different user roles.
- Shared panel layout system with responsive sidebar and mobile drawer behavior.
- Authentication integration layer with Firebase client + mock fallback.
- Backend API service (Express) prepared for Firebase Admin + Google Cloud Run deployment.
- Mock data layer that keeps the product demoable even when backend services are down.

## Main Features
- Parent panel pages:
  - News flow, game-time analytics, talent development, career path, profession guide
  - Achievements, interest areas, development tree, finance, game info, help
- Student panel pages:
  - Home, talent development, profession guide, finance, achievements
- School panel pages:
  - Dashboard, students, classes, settings
- Login and register flows with multi-role selection.
- Demo credentials and mock API behaviors for portfolio presentation.

## Tech Stack
- Frontend: React 19, Vite 7, React Router, Font Awesome, Firebase JS SDK
- Backend: Node.js, Express 5, firebase-admin, express-validator, cors
- Deployment target: Google Cloud Run (backend), static/Vite hosting for frontend

## Repository Structure
```text
GM_site/
  app/        # React + Vite frontend
  backend/    # Express API (Firebase Admin)
  src/        # Legacy/static design pages and assets
```

## Run Locally (UI Demo Only, No Backend)
This is the fastest mode for portfolio demos.

1. Go to frontend:
```bash
cd app
```
2. Install dependencies:
```bash
npm install
```
3. Create env file from example:
```bash
cp .env.example .env
```
4. Set mock mode:
```env
VITE_USE_MOCK_DATA=true
```
5. Start dev server:
```bash
npm run dev
```

With this setup, pages and panel flows work using mock auth/data without backend.

## Run Full Stack (Optional)
1. Start backend:
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
2. Configure frontend (`app/.env`):
```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=http://localhost:3000
```
3. Run frontend:
```bash
cd app
npm run dev
```

## Mock Demo Accounts
- Student: `ogrenci@demo.local` / `demo123`
- Parent: `veli@demo.local` / `demo123`
- School: `okul@demo.local` / `demo123`
- Psychologist: `psikolog@demo.local` / `demo123`

## Security Note (Important Before Publishing)
- Do not commit real `.env` files.
- Keep production secrets in Secret Manager / environment variables.
- If any service-account key was ever exposed, rotate it before making the repo public.

## Deployment Notes
- Backend deployment steps are documented in:
  - `backend/README.md`
- Frontend can run on any static hosting compatible with Vite build output.

## Status
- Frontend portfolio-ready in mock mode.
- Backend available as optional integration layer.
