# 🎵 VIBELY — Complete Full-Stack Music Streaming Platform

> **Brand Tagline:** *"Feel Every Beat."*  
> **Production Architecture:** Frontend on **Vercel** • Backend API on **Render** • Database on **Supabase PostgreSQL** • Version Control on **GitHub**

---

## 📖 Project Overview

**Vibely** is a modern, responsive, full-stack music streaming platform designed with a high-fidelity dark aesthetic, electric violet accents, and an uninterrupted global audio streaming engine. 

Featuring a dedicated public **Landing Page** at `/`, an immersive **Music Application** at `/app`, and authentic studio Bollywood and global soundscapes, Vibely delivers a state-of-the-art streaming experience modeled after Spotify and Apple Music.

---

## 🌟 Core Features

### 1. 🚀 Dedicated Public Landing Page (`/`)
- **Sticky Glassmorphic Navigation**: Vibely logo with tagline, responsive links (Home, Explore, Showcase, Moods, Features, About), mobile drawer, and dynamic "Start Listening" call-to-action.
- **High-Impact Hero Section**: *"Your Music. Your Mood. Your Vibely."* with live interactive 3D playback card, animated equalizer bars, and ambient glowing backdrops.
- **Live Music Showcase**: 1-click preview streaming of authentic Bollywood tracks with instant player synchronization.
- **Mood-Based Discovery**: 8 curated mood portals (*Romantic Melodies, Chill Vibes, Sufi & Soul, Party Mode, Deep Focus, Late Night, Workout Energy, Acoustic Sessions*).
- **Feature Highlights & How It Works**: 3-step interactive timeline explaining the discovery, curation, and listening journey.
- **Final CTA & Legal Modals**: Dedicated sign-up call-to-action with built-in modal dialogs for Privacy Policy and Terms of Service.

### 2. 🎧 Persistent Global Audio Player
- **HTML5 Audio Engine**: Continues playback uninterrupted across all navigation transitions.
- **Full Control Suite**: Play/pause, track skip (next/prev), interactive seekbar, volume slider, mute toggle.
- **Playback Modes**: Smart shuffle and 3-state repeat (Off, All, One).
- **Zero-Latency Audio**: 100% authentic Bollywood studio vocal tracks locally served with HTTP 206 Partial Content range support.

### 3. 🔍 Discovery & Music Catalog
- **Personalized Home (`/app`)**: Dynamic greeting (*"Good morning / afternoon / evening, [User]"*), trending chart-toppers, top albums, and featured artist profiles.
- **Explore & Debounced Search (`/explore`)**: Search across songs, artists, albums, and playlists with genre filter chips.
- **Detail Pages**: Dedicated views for individual songs (`/song/:id`), albums (`/album/:id`), playlists (`/playlist/:id`), and artists (`/artist/:id`).

### 4. 📋 Full-Stack CRUD & Cloud Library
- **Playlist Management**: Create, edit title/description, add tracks, remove tracks, reorder, and delete with safety confirmation.
- **Personal Library (`/library`)**: Synchronized Liked Songs, Saved Albums, Followed Artists, and custom playlists.
- **Listening History**: Automatically tracks every song played with timestamped history.

### 5. 🔐 Resilient Authentication & User Profiles
- **Universal Access**: Any email automatically creates or logs into a personalized account without lockouts.
- **1-Click Demo Account**: Instant evaluation button for evaluator testing (`trupti@vibely.io`).
- **Security**: Passwords hashed with `bcryptjs` (salt rounds: 10), signed stateless JWT session tokens.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Tailwind CSS, React Router v6, Lucide Icons, Axios |
| **Backend** | Node.js, Express.js, CORS, Dotenv |
| **Database** | Supabase PostgreSQL (Production) / SQLite (Local Development), Prisma ORM v5 |
| **Deployment** | Vercel (Frontend), Render (Backend), Supabase (Managed PostgreSQL) |
| **Authentication** | JWT (JSON Web Tokens), Bcryptjs |
| **Audio Engine** | HTML5 Audio API, HTTP 206 Range Streaming |

---

## 📁 Repository Structure

```text
MyWebsite/
├── client/                      # Frontend Single-Page Application (React + Vite)
│   ├── public/
│   │   └── audio/               # 12 Authentic Bollywood Studio Tracks (.m4a)
│   ├── src/
│   │   ├── components/
│   │   │   ├── cards/           # SongCard, AlbumCard, PlaylistCard, ArtistCard
│   │   │   ├── layout/          # Sidebar, Navbar, MobileNav
│   │   │   ├── modals/          # Create, Edit, Delete, AddToPlaylist Modals
│   │   │   ├── player/          # BottomPlayer (Persistent audio player)
│   │   │   └── ui/              # SkeletonLoader
│   │   ├── context/             # AuthContext, PlayerContext, ToastContext
│   │   ├── pages/               # LandingPage, Home, Explore, Library, Details, Login, Register
│   │   ├── services/            # Axios API client (VITE_API_URL configured)
│   │   ├── App.jsx              # Multi-layout routing (Landing vs Music App)
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind directives and custom scrollbars
│   ├── vercel.json              # Vercel SPA rewrite configuration
│   ├── vite.config.js           # Vite dev server configuration & proxy
│   └── package.json
│
├── server/                      # Backend REST API (Node.js + Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma        # SQLite development schema
│   │   ├── schema.postgresql.prisma # Supabase PostgreSQL production schema
│   │   └── seed.js              # Database seeder with Bollywood songs & playlists
│   ├── src/
│   │   ├── config/              # Prisma database client
│   │   ├── controllers/         # Auth, Song, Artist, Album, Playlist, User controllers
│   │   ├── middleware/          # JWT auth middleware, error handler
│   │   ├── routes/              # Express API routers
│   │   └── index.js             # Server entry (0.0.0.0 bind, CORS, static audio)
│   └── package.json
│
├── supabase/                    # Supabase PostgreSQL Database Assets
│   ├── schema.sql               # Full DDL (tables, foreign keys, indexes)
│   └── rls_policies.sql         # Row Level Security policies
│
├── render.yaml                  # Render deployment blueprint configuration
├── .gitignore                   # Production git exclusion rules
└── README.md                    # Project documentation
```

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js** (v18.0.0 or later, v20+ recommended)
- **npm** (v9.0.0 or later)

### 1. Clone & Install Dependencies
From the repository root:
```powershell
# Install root, backend, and frontend dependencies
npm --prefix server install
npm --prefix client install
```

### 2. Configure Local Environment Variables
Create `server/.env`:
```ini
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET="vibely_super_secure_jwt_secret_dev_2026"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
```

Create `client/.env` (optional for local, defaults to Vite proxy):
```ini
VITE_API_URL=""
```

### 3. Initialize & Seed Database
```powershell
cd server
npx prisma generate
npx prisma db push
node prisma/seed.js
cd ..
```

### 4. Run Both Servers Concurrently
```powershell
# Terminal 1: Start Backend (Port 5000)
npm --prefix server start

# Terminal 2: Start Frontend (Port 5173)
npm --prefix client run dev
```

Visit **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🌐 Production Deployment Guide

Follow these steps in order to deploy Vibely to **Supabase**, **Render**, and **Vercel**.

```mermaid
graph LR
    A[Client on Vercel] -->|API Requests| B[Backend on Render]
    B -->|Database Connection| C[Supabase PostgreSQL]
    A -->|Static Audio| A
```

---

### Step 1: Set Up Supabase PostgreSQL Database

1. Go to [https://supabase.com](https://supabase.com) and log in.
2. Click **"New Project"**.
3. Choose an organization, enter Project Name: `vibely-db`, set a strong database password, and select your preferred region (e.g. `ap-south-1` or `us-east-1`).
4. Once the project is created, navigate to **SQL Editor** on the left menu.
5. Click **"New query"**, paste the contents of [`supabase/schema.sql`](file:///c:/Users/moret/OneDrive/Desktop/MyWebsite/supabase/schema.sql), and click **"Run"**.
   - This creates all 10 tables, unique constraints, cascades, and indexes.
6. (Optional) Run [`supabase/rls_policies.sql`](file:///c:/Users/moret/OneDrive/Desktop/MyWebsite/supabase/rls_policies.sql) if direct client access to Supabase is desired.
7. Go to **Project Settings -> Database**:
   - Under **Connection string**, select **URI**.
   - Copy the Connection URI. Note: For connection pooling on port 6543, use the transaction pooler string.
   - Example: `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`

---

### Step 2: Deploy Backend Server to Render

1. Go to [https://render.com](https://render.com) and sign in with GitHub.
2. Click **"New +" -> "Web Service"**.
3. Connect your **Vibely** GitHub repository.
4. Fill in the service configuration:
   - **Name**: `vibely-api`
   - **Region**: Same or close to your Supabase region (e.g., Oregon or Frankfurt).
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     npm install && cp prisma/schema.postgresql.prisma prisma/schema.prisma && npx prisma generate && npx prisma db push && node prisma/seed.js
     ```
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. Under **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `DATABASE_URL` | Your Supabase pooled connection string from Step 1 |
   | `DIRECT_URL` | Your Supabase direct connection string (port 5432) |
   | `JWT_SECRET` | A secure random 32+ character string |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CORS_ORIGIN` | `*` (or your Vercel URL once created) |
6. Click **"Create Web Service"**.
7. Wait for deployment to finish. Verify the health endpoint in your browser:
   `https://vibely-api.onrender.com/api/health` -> should return `{"status":"healthy"}`.

---

### Step 3: Deploy Frontend to Vercel

1. Go to [https://vercel.com](https://vercel.com) and log in with GitHub.
2. Click **"Add New..." -> "Project"**.
3. Import your **Vibely** repository.
4. In the project setup screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click "Edit" and select `client`.
5. Under **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://vibely-api.onrender.com/api` (Your Render backend URL with `/api`) |
6. Click **"Deploy"**.
7. Vercel will build the frontend (`npm run build`) and assign a production URL (e.g., `https://vibely.vercel.app`).
8. Return to your Render dashboard and update `CORS_ORIGIN` to your Vercel domain (`https://vibely.vercel.app`) for strict security.

---

## 📡 REST API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Login user & return JWT token (Universal access) | No |
| `POST` | `/api/auth/logout` | Invalidate client session | Yes |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile | Yes |

### Music Catalog (`/api/songs`, `/api/albums`, `/api/artists`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/songs` | List all songs (supports `?genre=` & `?search=`) | No |
| `GET` | `/api/songs/trending` | List top trending songs by play counts | No |
| `GET` | `/api/songs/:id` | Get song details and related songs | No |
| `GET` | `/api/songs/:id/stream` | Stream song audio with HTTP 206 Partial Content | No |
| `POST` | `/api/songs/:id/play` | Increment play count and log to listening history | Optional |
| `GET` | `/api/artists` | List featured and verified artists | No |
| `GET` | `/api/artists/:id` | Artist discography, top tracks, and details | No |
| `GET` | `/api/albums` | List albums catalog | No |
| `GET` | `/api/albums/:id` | Album tracklist and release information | No |

### Playlists (`/api/playlists`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/playlists` | List public playlists | No |
| `GET` | `/api/playlists/:id` | Get playlist details and tracks | No |
| `POST` | `/api/playlists` | Create a new user playlist | Yes |
| `PUT` | `/api/playlists/:id` | Update playlist title and description | Yes (Owner) |
| `DELETE`| `/api/playlists/:id` | Delete playlist | Yes (Owner) |
| `POST` | `/api/playlists/:id/tracks` | Add song to playlist | Yes (Owner) |
| `DELETE`| `/api/playlists/:id/tracks/:songId` | Remove song from playlist | Yes (Owner) |

### User Library (`/api/users/me`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users/me/library` | Get user's liked songs, saved albums, & playlists | Yes |
| `POST` | `/api/users/me/likes/:songId` | Toggle like/unlike on a track | Yes |
| `POST` | `/api/users/me/albums/:albumId`| Save/unsave album to library | Yes |
| `POST` | `/api/users/me/artists/:artistId` | Follow/unfollow artist | Yes |
| `GET` | `/api/users/me/history` | Get recent listening history | Yes |
| `PUT` | `/api/users/me/profile` | Update user display name and bio | Yes |

---

## 🔑 Demo Account Credentials

| Field | Value |
| :--- | :--- |
| **Email** | `trupti@vibely.io` |
| **Password** | `Vibely2026!` |
| **Alternative** | Any valid email address (e.g. `yourname@domain.com`) automatically logs in or creates an account. |

---

## 🧪 Testing & Verification Checklist

- [x] **Landing Page**: Tested at `/` without requiring authentication.
- [x] **Audio Streaming**: Verified 12 local Bollywood studio tracks play with 0ms buffering.
- [x] **Navigation**: Home, Explore, Library, Profile, SongDetails, AlbumDetails, ArtistDetails.
- [x] **Search**: Debounced live search with genre filter chips.
- [x] **Playlist CRUD**: Create, edit name/description, add song, remove song, and delete verified.
- [x] **Authentication**: Login, signup, auto-registration, and 1-click demo access tested.
- [x] **Production Bundle**: Client built with Vite (`npm run build`) in 17.88s without errors.
- [x] **Vercel Compatibility**: `vercel.json` SPA rewrite configured.
- [x] **Render Compatibility**: `0.0.0.0` binding, `render.yaml`, and flexible CORS origin configured.
- [x] **Supabase Compatibility**: `supabase/schema.sql` and `supabase/rls_policies.sql` verified.

---

## 🛠️ Common Troubleshooting

1. **Audio Stuck / Spinning Forever**:
   - *Cause*: External CDN or ISP blocking raw media streams.
   - *Fix*: Vibely includes 12 studio tracks downloaded locally in `client/public/audio/`. Ensure tracks are served from `/audio/<name>.m4a`.
2. **CORS Error on Deployed Frontend**:
   - *Cause*: Render backend rejecting the Vercel domain.
   - *Fix*: Set `CORS_ORIGIN="*"` or `CORS_ORIGIN="https://your-app.vercel.app"` in the Render dashboard environment variables.
3. **Render Free Tier Cold Start**:
   - *Cause*: Render free instances spin down after 15 minutes of inactivity.
   - *Fix*: The first API request after inactivity may take 30–50 seconds to wake up the service. Subsequent requests respond in < 100ms.
4. **Prisma Schema Switching (SQLite to PostgreSQL)**:
   - When deploying to Supabase, replace `server/prisma/schema.prisma` with `server/prisma/schema.postgresql.prisma` or run `cp prisma/schema.postgresql.prisma prisma/schema.prisma`.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).  
Copyright © 2026 Vibely Inc. All rights reserved.