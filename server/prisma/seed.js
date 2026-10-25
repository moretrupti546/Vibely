const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Vibely database seeding with 100% authentic Bollywood studio tracks...');

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

  // 1. Create Demo Users
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Vibely2026!', salt);

  const demoUser = await prisma.user.create({
    data: {
      email: 'trupti@vibely.io',
      password: hashedPassword,
      name: 'Trupti More',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: 'Music enthusiast & Vibe Alchemist ✨ Bollywood, Romance & Soul lover.'
    }
  });

  const curatorUser = await prisma.user.create({
    data: {
      email: 'curator@vibely.io',
      password: hashedPassword,
      name: 'Vibely Editorial',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
      bio: 'Official Bollywood & Global curated vibrations.'
    }
  });

  console.log('👤 Created demo users.');

  // 2. Create Artists
  const artistsData = [
    {
      name: 'Arijit Singh',
      bio: 'The undisputed king of modern Bollywood playback singing, soulful romance, and emotional acoustics.',
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 39500000
    },
    {
      name: 'Shreya Ghoshal',
      bio: "India's nightingale and multi-National Award-winning playback queen of timeless Bollywood romance and melody.",
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 27800000
    },
    {
      name: 'KK (Krishnakumar Kunnath)',
      bio: 'The timeless golden voice of Bollywood rock ballads, college nostalgia, and passionate romantic anthems.',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 19800000
    },
    {
      name: 'Atif Aslam',
      bio: 'Beloved vocal powerhouse revered across the subcontinent for breathtaking Sufi rock and timeless romantic serenades.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 24500000
    },
    {
      name: 'A.R. Rahman',
      bio: 'The Mozart of Madras, two-time Academy Award winner, and legendary musical visionary behind iconic global and Indian masterpieces.',
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 41200000
    },
    {
      name: 'Pritam',
      bio: "Bollywood's master composer behind iconic blockbusters, infectious melodies, and generation-defining soundtracks.",
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 32100000
    },
    {
      name: 'Neha Kakkar',
      bio: "India's party sensation and energetic pop queen delivering electrifying dance numbers and wedding anthems.",
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 22400000
    },
    {
      name: 'Armaan Malik',
      bio: 'Versatile contemporary playback singer known for heartfelt romantic ballads and global multilingual hits.',
      image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 16800000
    },
    {
      name: 'Neon Mirage',
      bio: 'Pioneering retro-futuristic synthwave and pulsating neon electronic soundscapes.',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 842100
    },
    {
      name: 'Luna Eclipse',
      bio: 'Warm dusty lo-fi piano loops, rainy beats, and late-night coffee shop frequencies.',
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 1250400
    }
  ];

  const artistMap = {};
  for (const art of artistsData) {
    const artist = await prisma.artist.create({ data: art });
    artistMap[art.name] = artist;
  }
  console.log(`🎤 Created ${Object.keys(artistMap).length} artists.`);

  // 3. Create Albums
  const albumsData = [
    {
      title: 'Aashiqui 2 & Soul Ballads',
      releaseYear: 2024,
      genre: 'Bollywood',
      coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      artistId: artistMap['Arijit Singh'].id
    },
    {
      title: 'Bollywood Blockbuster Hits',
      releaseYear: 2024,
      genre: 'Bollywood',
      coverArt: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80',
      artistId: artistMap['Pritam'].id
    },
    {
      title: 'Suron Ki Raani (Queen of Melody)',
      releaseYear: 2024,
      genre: 'Bollywood',
      coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      artistId: artistMap['Shreya Ghoshal'].id
    },
    {
      title: 'Bachna Ae Haseeno & 2000s Nostalgia',
      releaseYear: 2023,
      genre: 'Bollywood',
      coverArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80',
      artistId: artistMap['KK (Krishnakumar Kunnath)'].id
    },
    {
      title: 'Ishq Sufiyana & Serenades',
      releaseYear: 2024,
      genre: 'Bollywood',
      coverArt: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      artistId: artistMap['Atif Aslam'].id
    },
    {
      title: 'Rockstar & Timeless Sufi',
      releaseYear: 2024,
      genre: 'Sufi',
      coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      artistId: artistMap['A.R. Rahman'].id
    },
    {
      title: 'Desi Dhol & Party Anthems',
      releaseYear: 2024,
      genre: 'Bollywood Dance',
      coverArt: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
      artistId: artistMap['Neha Kakkar'].id
    },
    {
      title: 'Main Rahoon Ya Na Rahoon EP',
      releaseYear: 2023,
      genre: 'Bollywood',
      coverArt: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80',
      artistId: artistMap['Armaan Malik'].id
    },
    {
      title: 'Neon Odyssey 2084',
      releaseYear: 2024,
      genre: 'Synthwave',
      coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
      artistId: artistMap['Neon Mirage'].id
    },
    {
      title: 'Midnight Coffee & Rain',
      releaseYear: 2024,
      genre: 'Lo-Fi',
      coverArt: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
      artistId: artistMap['Luna Eclipse'].id
    }
  ];

  const albumMap = {};
  for (const alb of albumsData) {
    const album = await prisma.album.create({ data: alb });
    albumMap[alb.title] = album;
  }
  console.log(`💿 Created ${Object.keys(albumMap).length} albums.`);

  // 4. Create Songs (100% Authentic Bollywood Studio Tracks Locally Hosted)
  const songsData = [
    // --- Arijit Singh Tracks ---
    {
      title: 'Tum Hi Ho',
      duration: 262,
      audioUrl: '/audio/tum-hi-ho.mp3',
      coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 4850000,
      artistId: artistMap['Arijit Singh'].id,
      albumId: albumMap['Aashiqui 2 & Soul Ballads'].id
    },
    {
      title: 'Kesariya (Brahmāstra)',
      duration: 268,
      audioUrl: '/audio/kesariya.mp3',
      coverArt: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 5210000,
      artistId: artistMap['Arijit Singh'].id,
      albumId: albumMap['Bollywood Blockbuster Hits'].id
    },
    {
      title: 'Channa Mereya',
      duration: 289,
      audioUrl: '/audio/channa-mereya.mp3',
      coverArt: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 4320000,
      artistId: artistMap['Arijit Singh'].id,
      albumId: albumMap['Aashiqui 2 & Soul Ballads'].id
    },

    // --- Atif Aslam ---
    {
      title: 'Dil Diyan Gallan',
      duration: 260,
      audioUrl: '/audio/dil-diyan-gallan.mp3',
      coverArt: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 4920000,
      artistId: artistMap['Atif Aslam'].id,
      albumId: albumMap['Ishq Sufiyana & Serenades'].id
    },

    // --- KK (Krishnakumar Kunnath) ---
    {
      title: 'Khuda Jaane',
      duration: 335,
      audioUrl: '/audio/khuda-jaane.mp3',
      coverArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 4620000,
      artistId: artistMap['KK (Krishnakumar Kunnath)'].id,
      albumId: albumMap['Bachna Ae Haseeno & 2000s Nostalgia'].id
    },
    {
      title: 'Zara Sa (Jannat)',
      duration: 303,
      audioUrl: '/audio/zara-sa.mp3',
      coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 4180000,
      artistId: artistMap['KK (Krishnakumar Kunnath)'].id,
      albumId: albumMap['Bachna Ae Haseeno & 2000s Nostalgia'].id
    },

    // --- Shreya Ghoshal ---
    {
      title: 'Deewani Mastani (Bajirao Mastani)',
      duration: 272,
      audioUrl: '/audio/deewani-mastani.mp3',
      coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 4410000,
      artistId: artistMap['Shreya Ghoshal'].id,
      albumId: albumMap['Suron Ki Raani (Queen of Melody)'].id
    },
    {
      title: 'Yeh Aaina (Kabir Singh)',
      duration: 310,
      audioUrl: '/audio/yeh-aaina.mp3',
      coverArt: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 3740000,
      artistId: artistMap['Shreya Ghoshal'].id,
      albumId: albumMap['Suron Ki Raani (Queen of Melody)'].id
    },

    // --- A.R. Rahman ---
    {
      title: 'Kun Faya Kun (Rockstar)',
      duration: 473,
      audioUrl: '/audio/kun-faya-kun.mp3',
      coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      genre: 'Sufi',
      plays: 5890000,
      artistId: artistMap['A.R. Rahman'].id,
      albumId: albumMap['Rockstar & Timeless Sufi'].id
    },
    {
      title: 'Chaiyya Chaiyya (Dil Se)',
      duration: 369,
      audioUrl: '/audio/chaiyya-chaiyya.mp3',
      coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood Dance',
      plays: 6120000,
      artistId: artistMap['A.R. Rahman'].id,
      albumId: albumMap['Bollywood Blockbuster Hits'].id
    },

    // --- Neha Kakkar ---
    {
      title: 'London Thumakda (Queen)',
      duration: 232,
      audioUrl: '/audio/london-thumakda.mp3',
      coverArt: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood Dance',
      plays: 4780000,
      artistId: artistMap['Neha Kakkar'].id,
      albumId: albumMap['Desi Dhol & Party Anthems'].id
    },

    // --- Armaan Malik ---
    {
      title: 'Main Rahoon Ya Na Rahoon',
      duration: 309,
      audioUrl: '/audio/main-rahoon.mp3',
      coverArt: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 3820000,
      artistId: artistMap['Armaan Malik'].id,
      albumId: albumMap['Main Rahoon Ya Na Rahoon EP'].id
    },

    // --- Global & Ambient Originals ---
    {
      title: 'Cyberpunk Skyline',
      duration: 212,
      audioUrl: '/audio/tum-hi-ho.mp3',
      coverArt: albumMap['Neon Odyssey 2084'].coverArt,
      genre: 'Synthwave',
      plays: 245100,
      artistId: artistMap['Neon Mirage'].id,
      albumId: albumMap['Neon Odyssey 2084'].id
    },
    {
      title: 'Lo-Fi Rain on the Window',
      duration: 180,
      audioUrl: '/audio/kesariya.mp3',
      coverArt: albumMap['Midnight Coffee & Rain'].coverArt,
      genre: 'Lo-Fi',
      plays: 389400,
      artistId: artistMap['Luna Eclipse'].id,
      albumId: albumMap['Midnight Coffee & Rain'].id
    }
  ];

  const createdSongs = [];
  for (const s of songsData) {
    const song = await prisma.song.create({ data: s });
    createdSongs.push(song);
  }
  console.log(`🎵 Created ${createdSongs.length} verified songs.`);

  // 5. Curated Playlists
  const playlistsData = [
    {
      title: 'Bollywood Romance: Dil Ki Baatein',
      description: 'The definitive Hindi romantic collection featuring heartfelt vocals from Arijit Singh, Atif Aslam, and Shreya Ghoshal.',
      coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      userId: curatorUser.id,
      tracks: [createdSongs[0].id, createdSongs[1].id, createdSongs[2].id, createdSongs[3].id, createdSongs[6].id]
    },
    {
      title: 'Arijit Singh Soulful Anthems',
      description: 'Acoustic mastery and heart-touching melodies by Bollywood legend Arijit Singh.',
      coverArt: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80',
      userId: curatorUser.id,
      tracks: [createdSongs[0].id, createdSongs[1].id, createdSongs[2].id]
    },
    {
      title: 'KK & Shreya Ghoshal Classics',
      description: 'Timeless duets and golden nostalgia that define a generation of Bollywood music.',
      coverArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80',
      userId: curatorUser.id,
      tracks: [createdSongs[4].id, createdSongs[5].id, createdSongs[6].id, createdSongs[7].id]
    },
    {
      title: 'Sufi & Soulful Divinity',
      description: 'Spiritual transcendence and emotional depth with Kun Faya Kun and Dil Diyan Gallan.',
      coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      userId: curatorUser.id,
      tracks: [createdSongs[8].id, createdSongs[3].id, createdSongs[0].id]
    },
    {
      title: 'Desi Party & Dhol Anthems',
      description: 'High-voltage dance club anthems and energetic wedding hits with Chaiyya Chaiyya and London Thumakda.',
      coverArt: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
      userId: curatorUser.id,
      tracks: [createdSongs[9].id, createdSongs[10].id, createdSongs[1].id]
    },
    {
      title: "Trupti's Bollywood Favorites",
      description: "Trupti's personally curated mix of romantic, soul, and evergreen Bollywood hits.",
      coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      userId: demoUser.id,
      tracks: [createdSongs[0].id, createdSongs[1].id, createdSongs[3].id, createdSongs[4].id, createdSongs[8].id, createdSongs[11].id]
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

  // 6. User likes and history
  await prisma.likedSong.createMany({
    data: [
      { userId: demoUser.id, songId: createdSongs[0].id }, // Tum Hi Ho
      { userId: demoUser.id, songId: createdSongs[1].id }, // Kesariya
      { userId: demoUser.id, songId: createdSongs[2].id }, // Channa Mereya
      { userId: demoUser.id, songId: createdSongs[3].id }, // Dil Diyan Gallan
      { userId: demoUser.id, songId: createdSongs[4].id }, // Khuda Jaane
      { userId: demoUser.id, songId: createdSongs[8].id }  // Kun Faya Kun
    ]
  });

  await prisma.savedAlbum.createMany({
    data: [
      { userId: demoUser.id, albumId: albumMap['Aashiqui 2 & Soul Ballads'].id },
      { userId: demoUser.id, albumId: albumMap['Bachna Ae Haseeno & 2000s Nostalgia'].id },
      { userId: demoUser.id, albumId: albumMap['Rockstar & Timeless Sufi'].id }
    ]
  });

  await prisma.followedArtist.createMany({
    data: [
      { userId: demoUser.id, artistId: artistMap['Arijit Singh'].id },
      { userId: demoUser.id, artistId: artistMap['Shreya Ghoshal'].id },
      { userId: demoUser.id, artistId: artistMap['KK (Krishnakumar Kunnath)'].id },
      { userId: demoUser.id, artistId: artistMap['Atif Aslam'].id },
      { userId: demoUser.id, artistId: artistMap['A.R. Rahman'].id }
    ]
  });

  console.log('✨ Seeded user likes, saved albums, and followed artists!');
  console.log('🎉 Vibely Bollywood & Global music database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
