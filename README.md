# Job Application Tracker

A MERN app for tracking every job application from "applied" through to offer or rejection — built to replace the spreadsheet students keep during placement season.

**Live demo:** _add link once deployed_

## Screenshots

_add screenshots of the dashboard, add/edit modal, and login screen here_

## Features

- Register / log in with JWT-based auth (passwords hashed with bcrypt)
- Dashboard with a four-column board: Applied / Interview / Offer / Rejected
- Add, edit, and delete applications (with a confirm step before delete)
- Move an application between statuses from a dropdown on its card
- Search by company or role, filter by status
- Stat cards: total applications, interviews, offers, response rate
- Every application is scoped to the logged-in user — no cross-user access
- Helpful empty/loading states throughout

## Stack

- **Frontend:** React (Vite), React Router, Tailwind CSS, Axios
- **Backend:** Node, Express
- **Database:** MongoDB Atlas, Mongoose
- **Auth:** JWT in localStorage, bcrypt for password hashing
- **Deploy:** Frontend on Vercel, backend on Render

## Repo structure

```
Project-3/
  client/     # Vite React app
  server/     # Express API
  README.md
```

## API

Base path: `/api`

**Auth** — public
- `POST /auth/register` → `{ name, email, password }` → `{ token, user }`
- `POST /auth/login` → `{ email, password }` → `{ token, user }`
- `GET /auth/me` → current user (protected)

**Applications** — protected, all scoped to the logged-in user
- `GET /applications?status=&search=&sort=newest|oldest`
- `POST /applications`
- `GET /applications/:id`
- `PATCH /applications/:id`
- `DELETE /applications/:id`
- `GET /applications/stats` → `{ total, applied, interview, offer, rejected, responseRate }`

## Local setup

### Prerequisites
- Node 18+
- A MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Server

```bash
cd server
cp .env.example .env     # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev               # http://localhost:5000
```

### 2. Client

```bash
cd client
cp .env.example .env      # defaults to http://localhost:5000/api
npm install
npm run dev                # http://localhost:5173
```

Register a new account, add an application, and it should show up on the board.

## Environment variables

**server/.env**
```
PORT=5000
MONGO_URI=
JWT_SECRET=
CLIENT_URL=http://localhost:5173
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## Deploying

- **Backend (Render):** new Web Service pointing at `server/`, build command `npm install`, start command `npm start`. Set `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your deployed Vercel URL) as env vars.
- **Frontend (Vercel):** import the repo, set root directory to `client/`, add `VITE_API_URL` pointing at the deployed Render URL + `/api`.
- Update `CLIENT_URL` on the backend once you know the final Vercel URL, and `VITE_API_URL` on the frontend once you know the final Render URL.

## Out of scope (v1)

Resume upload, email reminders, calendar sync, team accounts, dark mode, password reset, OAuth.
