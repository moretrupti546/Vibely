-- ====================================================================
-- VIBELY — SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- Tagline: "Feel Every Beat."
-- Paste and execute in Supabase SQL Editor if direct client access is used.
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Artist" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Album" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Song" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Playlist" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PlaylistTrack" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "LikedSong" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SavedAlbum" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FollowedArtist" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ListeningHistory" ENABLE ROW LEVEL SECURITY;

-- 1. Public Music Catalog: Read-Only for All (Anonymous + Authenticated)
CREATE POLICY "Public catalog artists readable by everyone" ON "Artist"
    FOR SELECT USING (true);

CREATE POLICY "Public catalog albums readable by everyone" ON "Album"
    FOR SELECT USING (true);

CREATE POLICY "Public catalog songs readable by everyone" ON "Song"
    FOR SELECT USING (true);

CREATE POLICY "Public playlists readable by everyone" ON "Playlist"
    FOR SELECT USING ("isPublic" = true OR auth.uid()::text = "userId"::text);

CREATE POLICY "Playlist tracks readable if playlist is accessible" ON "PlaylistTrack"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM "Playlist"
            WHERE "Playlist"."id" = "PlaylistTrack"."playlistId"
            AND ("Playlist"."isPublic" = true OR auth.uid()::text = "Playlist"."userId"::text)
        )
    );

-- 2. User Profiles: Public info readable, only owner can update
CREATE POLICY "User profiles readable by all" ON "User"
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON "User"
    FOR UPDATE USING (auth.uid()::text = "id"::text);

-- 3. Playlists Management: Owner can insert, update, delete
CREATE POLICY "Users can create own playlists" ON "Playlist"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can update own playlists" ON "Playlist"
    FOR UPDATE USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can delete own playlists" ON "Playlist"
    FOR DELETE USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can add tracks to own playlists" ON "PlaylistTrack"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM "Playlist"
            WHERE "Playlist"."id" = "PlaylistTrack"."playlistId"
            AND auth.uid()::text = "Playlist"."userId"::text
        )
    );

CREATE POLICY "Users can remove tracks from own playlists" ON "PlaylistTrack"
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM "Playlist"
            WHERE "Playlist"."id" = "PlaylistTrack"."playlistId"
            AND auth.uid()::text = "Playlist"."userId"::text
        )
    );

-- 4. User Private Library (Likes, Saved Albums, Followed Artists, History)
CREATE POLICY "Users can view own liked songs" ON "LikedSong"
    FOR SELECT USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can like songs" ON "LikedSong"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can unlike songs" ON "LikedSong"
    FOR DELETE USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can view own saved albums" ON "SavedAlbum"
    FOR SELECT USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can save albums" ON "SavedAlbum"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can remove saved albums" ON "SavedAlbum"
    FOR DELETE USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can view followed artists" ON "FollowedArtist"
    FOR SELECT USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can follow artists" ON "FollowedArtist"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can unfollow artists" ON "FollowedArtist"
    FOR DELETE USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can view own listening history" ON "ListeningHistory"
    FOR SELECT USING (auth.uid()::text = "userId"::text);

CREATE POLICY "Users can add to listening history" ON "ListeningHistory"
    FOR INSERT WITH CHECK (auth.uid()::text = "userId"::text);
