# 🎵 Vibely — Modern Full-Stack Music Streaming Platform

> **"Feel Every Beat."**  
> An immersive, full-stack music streaming web application inspired by the design and usability of Spotify and Apple Music, engineered for a Full Stack Developer Internship technical assignment.

---

## 🌟 Key Features

### 🎧 1. Persistent Audio Streaming Engine
- **Global Music Player**: Audio continues playing uninterrupted as you browse through Home, Explore, Albums, Playlists, and Library.
- **Full Player Controls**: Play, pause, previous/next track, interactive seekbar, volume slider, mute toggle.
- **Shuffle & Repeat**: Smart shuffle mode and 3-state repeat (Off, All, Track).
- **Play Queue Drawer**: Slide-out queue drawer showing currently playing and upcoming tracks, with individual track removal and queue clear options.
- **Audio Reliability**: Powered by the HTML5 Audio API connected to verified, high-quality audio streams.

### 🔮 2. Discovery & Navigation (Spotify / Apple Music Inspired)
- **Home / Discover**: Personalized greeting ("Good morning / afternoon / evening, [User]"), featured hero release, trending songs, popular albums, and curated mood playlists.
- **Explore / Search**: Real-time debounced search across songs, artists, albums, and playlists, filter chips, and interactive genre exploration cards (Synthwave, Lo-Fi, Ambient, Indie Pop, Electronic, Chillhop).
- **Song Details**: Track cover art, duration, play counts, artist spotlight, and related recommendations.
- **Album Details**: Album cover, release year, artist link, complete tracklist with duration, "Play Album", and "Save Album" actions.
- **Artist Profile**: Verified artist badge, monthly listeners counter, artist bio, top tracks, and full discography.

### 📋 3. Full-Stack CRUD & Library Management
- **Create Playlists**: Custom modal dialog with title, description, and optional cover image.
- **Edit Playlists**: Real-time updates to playlist metadata with ownership verification.
- **Manage Tracks**: Add any song to any playlist from anywhere; remove tracks with instant table updates.
- **Delete Playlists**: Secure deletion with safety confirmation dialog.
- **Liked Songs**: Instant heart toggle syncing to your personal database library with optimistic UI updates.
- **Saved Albums**: Bookmark complete albums to your library.
- **Listening History**: Automated tracking of every track played, logged with timestamps and accessible in Library and Profile.

### 🔐 4. Secure Authentication & User Profiles
- **JWT & Bcrypt**: Passwords securely hashed with `bcryptjs` (salt rounds: 10), stateless JSON Web Tokens with 7-day expiration.
- **Protected Routes & Authorization**: Server-side validation ensuring users can only modify or delete their own playlists and records.
- **Live Password Strength Meter**: Real-time strength feedback on registration (Weak, Medium, Strong).
- **1-Click Demo Account Autofill**: Instant evaluation button on the Login page.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Tailwind CSS, React Router v6, Lucide React, Axios |
| **Backend** | Node.js, Express.js, CORS, Dotenv |
| **Database** | Relational SQLite / PostgreSQL, Prisma ORM v5 |
| **Authentication**| JWT (JSON Web Tokens), Bcryptjs |
| **Audio Engine** | HTML5 Audio API, Persistent Global Context |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18.0.0 or later, v22 recommended)
- **npm** (v9.0.0 or later)

### 1. Install Dependencies
From the project root:
```powershell
# Install server and client dependencies
npm --prefix server install
npm --prefix client install
```

### 2. Database Setup & Seed Data
Initialize the database schema and populate it with artists, albums, playable songs, and curated playlists:
```powershell
cd server
npx prisma generate
npx prisma db push
node prisma/seed.js
cd ..
```

### 3. Run the Application
Start the backend and frontend servers:

**Terminal 1 (Backend API - Port 5000):**
```powershell
npm --prefix server start
# Or for live reload during development:
npm --prefix server run dev
```

**Terminal 2 (Frontend Client - Port 5173):**
```powershell
npm --prefix client run dev
```

Open your browser and navigate to: **[http://localhost:5173](http://localhost:5173)**

---

## 🔑 Demo Account Credentials

For instant evaluation, you can click **"Autofill Demo Account"** on the Login page or use:

| Field | Value |
| :--- | :--- |
| **Email** | `trupti@vibely.io` |
| **Password** | `Vibely2026!` |

---

## 📡 REST API Documentation

### Authentication
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Login & receive JWT token
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Get authenticated user details & library stats

### Songs & Music
- `GET /api/songs` — Get songs with optional `?genre=` or `?search=`
- `GET /api/songs/trending` — Get top played songs
- `GET /api/songs/search?q=query&type=all` — Debounced multi-category search
- `GET /api/songs/:id` — Get single song details with related songs
- `POST /api/songs/:id/play` — Increment play count & record listening history

### Albums & Artists
- `GET /api/albums` — List all albums
- `GET /api/albums/:id` — Get album details with full tracklist
- `GET /api/artists` — List all artists
- `GET /api/artists/:id` — Get artist profile, top tracks, and discography

### Playlists (Full CRUD)
- `GET /api/playlists` — List public curated playlists
- `GET /api/playlists/:id` — Get playlist details with tracks and owner status
- `POST /api/playlists` — Create new playlist *(Auth required)*
- `PATCH /api/playlists/:id` — Update playlist title, description, coverArt *(Owner only)*
- `DELETE /api/playlists/:id` — Delete playlist *(Owner only)*
- `POST /api/playlists/:id/tracks` — Add song to playlist *(Owner only)*
- `DELETE /api/playlists/:id/tracks/:trackId` — Remove song from playlist *(Owner only)*

### User Library & History
- `GET /api/users/me/library` — Get user playlists, liked songs, and saved albums
- `PATCH /api/users/me` — Update display name, bio, or avatar
- `GET /api/users/me/history` — Get recent listening history
- `POST /api/users/me/likes/:songId` — Toggle like/unlike song
- `POST /api/users/me/albums/:albumId` — Toggle save/unsave album
- `POST /api/users/me/artists/:artistId` — Toggle follow/unfollow artist

---

## 📂 Project Directory Structure

```
MyWebsite/
├── client/                     # Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── cards/          # SongCard, SongRow, AlbumCard, PlaylistCard, ArtistCard
│   │   │   ├── layout/         # Sidebar, Navbar, MobileNav
│   │   │   ├── modals/         # CreatePlaylistModal, EditPlaylistModal, DeletePlaylistModal, AddToPlaylistModal
│   │   │   ├── player/         # BottomPlayer, QueueDrawer
│   │   │   └── ui/             # SkeletonLoader
│   │   ├── context/            # AuthContext, PlayerContext, ToastContext
│   │   ├── pages/              # Home, Explore, Library, SongDetails, AlbumDetails, PlaylistDetails, ArtistDetails, Profile, Login, Register
│   │   ├── services/           # api.js (Axios API client)
│   │   ├── App.jsx             # Main router & layout shell
│   │   ├── main.jsx            # Application root
│   │   └── index.css           # Tailwind CSS & design system tokens
│   ├── vite.config.js          # Vite config with API proxy
│   ├── tailwind.config.js      # Custom theme colors & fonts
│   └── package.json
│
├── server/                     # Backend API & Database
│   ├── prisma/
│   │   ├── schema.prisma       # Relational models, constraints & relations
│   │   ├── seed.js             # High-fidelity demo data seed script
│   │   └── dev.db              # SQLite relational database
│   ├── src/
│   │   ├── config/             # Database client singleton
│   │   ├── controllers/        # Auth, Songs, Albums, Artists, Playlists, Users
│   │   ├── middleware/         # Auth, Error handling, Validation
│   │   ├── routes/             # REST route declarations
│   │   └── index.js            # Express server entry point
│   ├── .env                    # Environment configuration
│   ├── .env.example
│   └── package.json
│
├── package.json                # Monorepo task runner
├── .gitignore
└── README.md                   # Project documentation
```

---

## 🛡️ Security & Architecture Best Practices
- **No Plaintext Passwords**: Every credential is salted and hashed using bcrypt.
- **Input Validation**: Strict request payload normalization and sanitization on both frontend and backend.
- **Relational Integrity**: Foreign key constraints and cascading rules prevent orphaned tracks, duplicate likes, or duplicate playlist entries.
- **Object-Level Authorization**: Direct database checks ensure users can never edit or delete playlists belonging to other accounts.
- **Production-Ready Bundle**: Frontend builds cleanly with zero errors (`npm run build`).

---

## 📄 Internship Technical Assessment Compliance
Built with ❤️ for **Vibely** — *Feel Every Beat*.