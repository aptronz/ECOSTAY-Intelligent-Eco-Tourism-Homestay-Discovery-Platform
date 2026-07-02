# ECOSTAY - Intelligent Eco-Tourism & Homestay Discovery Platform

ECOSTAY is a React + Vite frontend integrated with a Node.js + Express backend. The Week 4 backend uses in-memory data and exposes REST endpoints for stays, destinations, experiences, and bookings.

## Installation

```bash
npm install
cd backend
npm install
```

## Environment Variables

Root `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:5000
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

Backend `.env`:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

## Running Locally

Run the frontend and backend together:

```bash
npm run dev
```

Run separately:

```bash
npm run dev:client
npm run dev:server
```

Backend only from `/backend`:

```bash
npm run dev
```

## API List

Base URL: `http://127.0.0.1:5000/api`

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/health` | Health check |
| GET | `/stays` | List stays with optional filters |
| GET | `/stays/search?q=value` | Search stays |
| GET | `/stays/:id` | Get one stay |
| POST | `/stays` | Create stay |
| PATCH | `/stays/:id` | Update stay |
| DELETE | `/stays/:id` | Delete stay |
| GET | `/destinations` | List destinations |
| GET | `/experiences` | List experiences |
| GET | `/bookings` | List bookings |
| POST | `/bookings` | Create booking |

Full API docs: [backend/docs/API.md](backend/docs/API.md)

Postman collection: [backend/postman/ECOSTAY.postman_collection.json](backend/postman/ECOSTAY.postman_collection.json)

## Folder Structure

```text
backend/
  controllers/
  routes/
  middleware/
  models/
  utils/
  data/
  docs/
  postman/
  server.js
  .env.example
  package.json
src/
  components/
  context/
  hooks/
  pages/
  api.js
  App.jsx
```

## Frontend Integration

The frontend catalog now loads from the backend through `src/api.js`. Pages show loading, error, retry, and success states while preserving the existing UI, animation, typography, colors, spacing, and responsive behavior.
