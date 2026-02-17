# Cleanify — Smart City Waste Management System

> **Cleanify uses smart monitoring and data analytics to make city waste management cleaner, faster, and more efficient.**

**Team:** Codecops (HT-014)

---

## What is Cleanify?

Cleanify digitally monitors garbage bins across the city and helps municipal authorities collect waste **only when needed**, preventing overflow and keeping the city clean. The system features real-time bin fill simulation, automatic alert generation, role-based access control, and a modern dark-themed dashboard.

## Features

- **Dashboard** — Real-time overview of all bins with fill-level indicators & color-coded alerts
- **Bin Management** — Table view of 15 bins (Bangalore) with search, area filters, and status badges
- **Alert System** — Auto-generated alerts when bins reach 80%+ capacity; resolve from the UI
- **Route Assignment** — Assign collection tasks to workers; expandable worker cards with bin details
- **Citizen Complaints** — Public portal to report waste issues with location & description
- **Analytics** — Area charts, pie charts, bar charts, and quick insight cards for performance trends

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@cleanify.com | admin123 |
| **Worker** | worker1@cleanify.com | worker123 |
| **Citizen** | citizen@cleanify.com | citizen123 |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 6, Tailwind CSS v4, React Router DOM 7, Recharts, React Icons |
| **Backend** | Python 3, FastAPI, Uvicorn, python-jose (JWT), APScheduler, Pydantic |
| **Data** | In-memory DataStore (no database required — runs instantly) |

## Getting Started

```bash
# 1. Start the backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# API running at http://localhost:8000

# 2. Start the frontend (new terminal)
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

## Project Structure

```
backend/
├── app/
│   ├── main.py            # FastAPI app with lifespan & CORS
│   ├── config.py           # JWT secret & settings
│   ├── auth.py             # Authentication helpers
│   ├── schemas.py          # Pydantic request/response models
│   ├── data_store.py       # In-memory DataStore (bins, users, alerts)
│   ├── simulator.py        # Fill-level simulator (APScheduler)
│   └── routes/             # auth, bins, alerts, complaints, stats
└── requirements.txt

frontend/
├── src/
│   ├── components/         # Navbar, Sidebar, Layout, StatCard, StatusBadge
│   ├── pages/              # Login, Dashboard, BinManagement, Complaints,
│   │                       #   Alerts, Assignments, Analytics
│   ├── data/               # Mock data (bins, alerts, complaints, workers)
│   └── App.jsx             # React Router setup
├── index.html
└── vite.config.js
```

## Design

Dark-themed UI with a `#0b1120` background, `#0f172a` surfaces, cyan/violet accent gradients, smooth fade-in animations, and a responsive sidebar layout. All pages use consistent card components with slate borders and subtle hover effects.

---

© 2025 Cleanify — Team Codecops
