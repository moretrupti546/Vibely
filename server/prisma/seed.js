const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Vibely database seeding...');

  // Clean existing tables (in order of foreign key dependency)
  await prisma.listeningHistory.deleteMany();
  await prisma.likedSong.deleteMany();
  await prisma.savedAlbum.deleteMany();
  await prisma.followedArtist.deleteMany();
  await prisma.playlistTrack.deleteMany();
  await prisma.playlist.deleteMany();
  await prisma.song.deleteMany();
  await prisma.album.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database records.');

  // 1. Create Demo User
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Vibely2026!', salt);

  const demoUser = await prisma.user.create({
    data: {
      email: 'trupti@vibely.io',
      password: hashedPassword,
      name: 'Trupti More',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Music enthusiast & Vibe Alchemist ✨ Curating the frequency of sound.'
    }
  });

  const curatorUser = await prisma.user.create({
    data: {
      email: 'curator@vibely.io',
      password: hashedPassword,
      name: 'Vibely Editorial',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
      bio: 'Official curated sounds and editorial mood drops.'
    }
  });

  console.log('👤 Created demo users.');

  // 2. Create Artists
  const artistsData = [
    {
      name: 'Neon Mirage',
      bio: 'Pioneering retro-futuristic synthwave and pulsating neon electronic soundscapes.',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 842100
    },
    {
      name: 'Luna Eclipse',
      bio: 'Warm dusty lo-fi piano loops, rainy beats, and late-night coffee shop frequencies.',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 1250400
    },
    {
      name: 'The Velvet Frequency',
      bio: 'Ethereal indie pop, dreamy guitars, and lush harmonic vocal layers.',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 620000
    },
    {
      name: 'Aura Resonance',
      bio: 'Deep binaural ambient drones, 432 Hz healing chords, and immersive cinematic textures.',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 490200
    },
    {
      name: 'Solar Drift',
      bio: 'High-octane electronic beats, melodic bass, and festival peak-hour anthems.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 980100
    }
  ];

  const artists = [];
  for (const art of artistsData) {
    const artist = await prisma.artist.create({ data: art });
    artists.push(artist);
  }
  console.log(`🎤 Created ${artists.length} artists.`);

  // 3. Create Albums
  const albumsData = [
    {
      title: 'Neon Odyssey 2084',
      releaseYear: 2024,
      genre: 'Synthwave',
      coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
      artistId: artists[0].id // Neon Mirage
    },
    {
      title: 'Midnight Coffee & Rain',
      releaseYear: 2024,
      genre: 'Lo-Fi',
      coverArt: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
      artistId: artists[1].id // Luna Eclipse
    },
    {
      title: 'Dreamstate Horizon',
      releaseYear: 2023,
      genre: 'Indie Pop',
      coverArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80',
      artistId: artists[2].id // The Velvet Frequency
    },
    {
      title: 'Infinite Sanctuary',
      releaseYear: 2024,
      genre: 'Ambient',
      coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      artistId: artists[3].id // Aura Resonance
    },
    {
      title: 'Kinetic Overdrive',
      releaseYear: 2023,
      genre: 'Electronic',
      coverArt: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
      artistId: artists[4].id // Solar Drift
    }
  ];

  const albums = [];
  for (const alb of albumsData) {
    const album = await prisma.album.create({ data: alb });
    albums.push(album);
  }
  console.log(`💿 Created ${albums.length} albums.`);

  // 4. Create Songs (Using reliable, permitted, high-quality audio files)
  const songsData = [
    // Album 1: Neon Odyssey
    {
      title: 'Cyberpunk Skyline',
      duration: 212,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      coverArt: albums[0].coverArt,
      genre: 'Synthwave',
      plays: 245100,
      artistId: artists[0].id,
      albumId: albums[0].id
    },
    {
      title: 'Midnight Cruiser',
      duration: 198,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      coverArt: albums[0].coverArt,
      genre: 'Synthwave',
      plays: 184200,
      artistId: artists[0].id,
      albumId: albums[0].id
    },
    {
      title: 'Neon Heartbeat',
      duration: 245,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
      coverArt: albums[0].coverArt,
      genre: 'Synthwave',
      plays: 120500,
      artistId: artists[0].id,
      albumId: albums[0].id
    },

    // Album 2: Midnight Coffee & Rain
    {
      title: 'Lo-Fi Rain on the Window',
      duration: 180,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
      coverArt: albums[1].coverArt,
      genre: 'Lo-Fi',
      plays: 389400,
      artistId: artists[1].id,
      albumId: albums[1].id
    },
    {
      title: 'Warm Matcha Latte',
      duration: 165,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
      coverArt: albums[1].coverArt,
      genre: 'Lo-Fi',
      plays: 210800,
      artistId: artists[1].id,
      albumId: albums[1].id
    },
    {
      title: 'Study Session 3 AM',
      duration: 220,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
      coverArt: albums[1].coverArt,
      genre: 'Lo-Fi',
      plays: 450100,
      artistId: artists[1].id,
      albumId: albums[1].id
    },

    // Album 3: Dreamstate Horizon
    {
      title: 'Ethereal Afterglow',
      duration: 205,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
      coverArt: albums[2].coverArt,
      genre: 'Indie Pop',
      plays: 167300,
      artistId: artists[2].id,
      albumId: albums[2].id
    },
    {
      title: 'Lavender Sky',
      duration: 194,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
      coverArt: albums[2].coverArt,
      genre: 'Indie Pop',
      plays: 142900,
      artistId: artists[2].id,
      albumId: albums[2].id
    },

    // Album 4: Infinite Sanctuary
    {
      title: 'Binaural Tranquility (432Hz)',
      duration: 310,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
      coverArt: albums[3].coverArt,
      genre: 'Ambient',
      plays: 95400,
      artistId: artists[3].id,
      albumId: albums[3].id
    },
    {
      title: 'Starlight Forest',
      duration: 275,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
      coverArt: albums[3].coverArt,
      genre: 'Ambient',
      plays: 82000,
      artistId: artists[3].id,
      albumId: albums[3].id
    },

    // Album 5: Kinetic Overdrive
    {
      title: 'Neon Velocity',
      duration: 188,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
      coverArt: albums[4].coverArt,
      genre: 'Electronic',
      plays: 310200,
      artistId: artists[4].id,
      albumId: albums[4].id
    },
    {
      title: 'Circuit Breaker',
      duration: 215,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
      coverArt: albums[4].coverArt,
      genre: 'Electronic',
      plays: 289400,
      artistId: artists[4].id,
      albumId: albums[4].id
    }
  ];

  const songs = [];
  for (const s of songsData) {
    const song = await prisma.song.create({ data: s });
    songs.push(song);
  }
  console.log(`🎵 Created ${songs.length} songs.`);

  // 5. Create Curated Playlists
  const playlistsData = [
    {
      title: 'Midnight Lo-Fi Chill',
      description: 'Mellow beats, tape hiss, and relaxing vibes for unwinding or late-night thoughts.',
      coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      userId: curatorUser.id,
      tracks: [songs[3].id, songs[4].id, songs[5].id, songs[7].id]
    },
    {
      title: 'Deep Focus & Code Flow',
      description: 'Rhythmic electronic and synthwave tracks designed to keep you in the zone for hours.',
      coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
      userId: curatorUser.id,
      tracks: [songs[0].id, songs[1].id, songs[8].id, songs[10].id]
    },
    {
      title: 'Cyberpunk Neon Pulse',
      description: 'Futuristic high-energy beats for night drives through the neon metropolis.',
      coverArt: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
      userId: curatorUser.id,
      tracks: [songs[10].id, songs[11].id, songs[0].id, songs[2].id]
    },
    {
      title: 'Aura Meditation & Zen',
      description: 'Pure harmonic frequencies and peaceful ambient soundscapes for rejuvenation.',
      coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      userId: curatorUser.id,
      tracks: [songs[8].id, songs[9].id, songs[3].id, songs[4].id]
    },
    // User's own playlist
    {
      title: "Trupti's Daily Frequency",
      description: 'My favorite curated tracks for deep work and evening unwinding.',
      coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      userId: demoUser.id,
      tracks: [songs[0].id, songs[3].id, songs[6].id, songs[10].id]
    }
  ];

  for (const p of playlistsData) {
    const playlist = await prisma.playlist.create({
      data: {
        title: p.title,
        description: p.description,
        coverArt: p.coverArt,
        userId: p.userId
      }
    });

    for (let i = 0; i < p.tracks.length; i++) {
      await prisma.playlistTrack.create({
        data: {
          playlistId: playlist.id,
          songId: p.tracks[i],
          order: i
        }
      });
    }
  }
  console.log(`📋 Created ${playlistsData.length} playlists with assigned tracks.`);

  // 6. Seed Liked Songs & Saved Albums for Demo User
  await prisma.likedSong.createMany({
    data: [
      { userId: demoUser.id, songId: songs[0].id },
      { userId: demoUser.id, songId: songs[3].id },
      { userId: demoUser.id, songId: songs[6].id }
    ]
  });

  await prisma.savedAlbum.createMany({
    data: [
      { userId: demoUser.id, albumId: albums[0].id },
      { userId: demoUser.id, albumId: albums[1].id }
    ]
  });

  await prisma.followedArtist.createMany({
    data: [
      { userId: demoUser.id, artistId: artists[0].id },
      { userId: demoUser.id, artistId: artists[1].id }
    ]
  });

  // Seed listening history
  await prisma.listeningHistory.createMany({
    data: [
      { userId: demoUser.id, songId: songs[0].id },
      { userId: demoUser.id, songId: songs[1].id },
      { userId: demoUser.id, songId: songs[3].id }
    ]
  });

  console.log('✨ Seeded user likes, saved albums, followed artists, and history!');
  console.log('🎉 Vibely database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
