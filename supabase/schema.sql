-- ====================================================================
-- VIBELY — SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Tagline: "Feel Every Beat."
-- Run this script in the Supabase SQL Editor: Dashboard -> SQL Editor
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS "User" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    "bio" TEXT DEFAULT 'Music enthusiast & curator',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Artists Table
CREATE TABLE IF NOT EXISTS "Artist" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" TEXT UNIQUE NOT NULL,
    "bio" TEXT,
    "image" TEXT NOT NULL,
    "verified" BOOLEAN DEFAULT true NOT NULL,
    "monthlyListeners" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Albums Table
CREATE TABLE IF NOT EXISTS "Album" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "coverArt" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "artistId" UUID NOT NULL REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 5. Create Songs Table
CREATE TABLE IF NOT EXISTS "Song" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "coverArt" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "plays" INTEGER DEFAULT 0 NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "artistId" UUID NOT NULL REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "albumId" UUID REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- 6. Create Playlists Table
CREATE TABLE IF NOT EXISTS "Playlist" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "title" TEXT NOT NULL,
    "description" TEXT,
    "coverArt" TEXT DEFAULT 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    "isPublic" BOOLEAN DEFAULT true NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- 7. Create Playlist Tracks Table (Ordered Many-to-Many)
CREATE TABLE IF NOT EXISTS "PlaylistTrack" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "order" INTEGER DEFAULT 0 NOT NULL,
    "addedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "playlistId" UUID NOT NULL REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "songId" UUID NOT NULL REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PlaylistTrack_playlistId_songId_key" UNIQUE ("playlistId", "songId")
);

-- 8. Create Liked Songs Table
CREATE TABLE IF NOT EXISTS "LikedSong" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "likedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "songId" UUID NOT NULL REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LikedSong_userId_songId_key" UNIQUE ("userId", "songId")
);

-- 9. Create Saved Albums Table
CREATE TABLE IF NOT EXISTS "SavedAlbum" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "savedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "albumId" UUID NOT NULL REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "SavedAlbum_userId_albumId_key" UNIQUE ("userId", "albumId")
);

-- 10. Create Followed Artists Table
CREATE TABLE IF NOT EXISTS "FollowedArtist" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "followedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "artistId" UUID NOT NULL REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FollowedArtist_userId_artistId_key" UNIQUE ("userId", "artistId")
);

-- 11. Create Listening History Table
CREATE TABLE IF NOT EXISTS "ListeningHistory" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "playedAt" TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "songId" UUID NOT NULL REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- ====================================================================
-- PERFORMANCE INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS "Song_artistId_idx" ON "Song"("artistId");
CREATE INDEX IF NOT EXISTS "Song_albumId_idx" ON "Song"("albumId");
CREATE INDEX IF NOT EXISTS "Song_genre_idx" ON "Song"("genre");
CREATE INDEX IF NOT EXISTS "Song_plays_idx" ON "Song"("plays" DESC);
CREATE INDEX IF NOT EXISTS "Album_artistId_idx" ON "Album"("artistId");
CREATE INDEX IF NOT EXISTS "Playlist_userId_idx" ON "Playlist"("userId");
CREATE INDEX IF NOT EXISTS "PlaylistTrack_playlistId_idx" ON "PlaylistTrack"("playlistId");
CREATE INDEX IF NOT EXISTS "ListeningHistory_userId_playedAt_idx" ON "ListeningHistory"("userId", "playedAt" DESC);
