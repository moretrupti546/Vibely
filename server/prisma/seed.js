const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Vibely database seeding with 24 authentic tracks & global vibes...');

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
      name: 'Jubin Nautiyal',
      bio: 'Chart-dominating romantic vocalist with a soothing timbre celebrated for record-breaking emotional anthems.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 28900000
    },
    {
      name: 'Alka Yagnik',
      bio: 'Iconic playback legend with decades of unforgettable duets, golden era Bollywood melodies, and 2-time National Film Award winner.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 26400000
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
      name: 'Mohit Chauhan',
      bio: 'The soulful voice of wanderlust, poetic romance, and acoustic guitar ballads that capture the pure essence of music.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 15400000
    },
    {
      name: 'The Weeknd',
      bio: 'Global superstar known for dark R&B, glittering retro 80s synthwave, and hypnotic stadium pop anthems.',
      image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 108000000
    },
    {
      name: 'Dua Lipa',
      bio: 'Modern pop queen defining high-energy disco grooves, infectious dance hooks, and vibrant empowerment.',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 78000000
    },
    {
      name: 'Karan Aujla',
      bio: 'Global Punjabi music phenomenon delivering infectious party beats, viral dance bangers, and witty lyricism.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      verified: true,
      monthlyListeners: 19500000
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
  for (const a of artistsData) {
    const artist = await prisma.artist.create({ data: a });
    artistMap[a.name] = artist;
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
      title: 'Shershaah & Modern Romance',
      releaseYear: 2024,
      genre: 'Bollywood Romance',
      coverArt: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
      artistId: artistMap['Jubin Nautiyal'].id
    },
    {
      title: 'Tamasha & Soul Duets',
      releaseYear: 2024,
      genre: 'Bollywood',
      coverArt: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80',
      artistId: artistMap['Alka Yagnik'].id
    },
    {
      title: 'War & High-Voltage Beats',
      releaseYear: 2024,
      genre: 'Bollywood Dance',
      coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      artistId: artistMap['Arijit Singh'].id
    },
    {
      title: 'Yeh Jawaani Hai Deewani Vibes',
      releaseYear: 2024,
      genre: 'Bollywood Pop',
      coverArt: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
      artistId: artistMap['Arijit Singh'].id
    },
    {
      title: 'Bad Newz & Desi Heat',
      releaseYear: 2024,
      genre: 'Punjabi Pop',
      coverArt: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
      artistId: artistMap['Karan Aujla'].id
    },
    {
      title: 'After Hours & Neon Dreams',
      releaseYear: 2024,
      genre: 'Synthwave',
      coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
      artistId: artistMap['The Weeknd'].id
    },
    {
      title: 'Future Nostalgia & Disco Gold',
      releaseYear: 2024,
      genre: 'Pop Dance',
      coverArt: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
      artistId: artistMap['Dua Lipa'].id
    },
    {
      title: 'Late Night Coffee & Lo-Fi Beats',
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

  // 4. Create Songs (24 verified authentic tracks)
  const songsData = [
    {
      title: 'Tum Hi Ho',
      duration: 262,
      audioUrl: '/audio/tum-hi-ho.mp3',
      coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 5850000,
      artistId: artistMap['Arijit Singh'].id,
      albumId: albumMap['Aashiqui 2 & Soul Ballads'].id
    },
    {
      title: 'Kesariya (Brahmāstra)',
      duration: 268,
      audioUrl: '/audio/kesariya.mp3',
      coverArt: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 6210000,
      artistId: artistMap['Arijit Singh'].id,
      albumId: albumMap['Bollywood Blockbuster Hits'].id
    },
    {
      title: 'Apna Bana Le (Bhediya)',
      duration: 261,
      audioUrl: '/audio/apna-bana-le.mp3',
      coverArt: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood Romance',
      plays: 7120000,
      artistId: artistMap['Arijit Singh'].id,
      albumId: albumMap['Aashiqui 2 & Soul Ballads'].id
    },
    {
      title: 'Raataan Lambiyan (Shershaah)',
      duration: 230,
      audioUrl: '/audio/raataan-lambiyan.mp3',
      coverArt: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood Romance',
      plays: 8940000,
      artistId: artistMap['Jubin Nautiyal'].id,
      albumId: albumMap['Shershaah & Modern Romance'].id
    },
    {
      title: 'Agar Tum Saath Ho (Tamasha)',
      duration: 341,
      audioUrl: '/audio/agar-tum-saath-ho.mp3',
      coverArt: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 7650000,
      artistId: artistMap['Alka Yagnik'].id,
      albumId: albumMap['Tamasha & Soul Duets'].id
    },
    {
      title: 'Channa Mereya',
      duration: 289,
      audioUrl: '/audio/channa-mereya.mp3',
      coverArt: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 5320000,
      artistId: artistMap['Arijit Singh'].id,
      albumId: albumMap['Aashiqui 2 & Soul Ballads'].id
    },
    {
      title: 'Dil Diyan Gallan',
      duration: 260,
      audioUrl: '/audio/dil-diyan-gallan.mp3',
      coverArt: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 5920000,
      artistId: artistMap['Atif Aslam'].id,
      albumId: albumMap['Ishq Sufiyana & Serenades'].id
    },
    {
      title: 'Khuda Jaane',
      duration: 335,
      audioUrl: '/audio/khuda-jaane.mp3',
      coverArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 5620000,
      artistId: artistMap['KK (Krishnakumar Kunnath)'].id,
      albumId: albumMap['Bachna Ae Haseeno & 2000s Nostalgia'].id
    },
    {
      title: 'Zara Sa (Jannat)',
      duration: 303,
      audioUrl: '/audio/zara-sa.mp3',
      coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 4980000,
      artistId: artistMap['KK (Krishnakumar Kunnath)'].id,
      albumId: albumMap['Bachna Ae Haseeno & 2000s Nostalgia'].id
    },
    {
      title: 'Deewani Mastani (Bajirao Mastani)',
      duration: 272,
      audioUrl: '/audio/deewani-mastani.mp3',
      coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 5410000,
      artistId: artistMap['Shreya Ghoshal'].id,
      albumId: albumMap['Suron Ki Raani (Queen of Melody)'].id
    },
    {
      title: 'Yeh Aaina (Kabir Singh)',
      duration: 310,
      audioUrl: '/audio/yeh-aaina.mp3',
      coverArt: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 4740000,
      artistId: artistMap['Shreya Ghoshal'].id,
      albumId: albumMap['Suron Ki Raani (Queen of Melody)'].id
    },
    {
      title: 'Pee Loon (OUATIM)',
      duration: 288,
      audioUrl: '/audio/pee-loon.mp3',
      coverArt: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
      genre: 'Sufi',
      plays: 6340000,
      artistId: artistMap['Mohit Chauhan'].id,
      albumId: albumMap['Ishq Sufiyana & Serenades'].id
    },
    {
      title: 'Ghungroo (War)',
      duration: 302,
      audioUrl: '/audio/ghungroo.mp3',
      coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood Dance',
      plays: 7890000,
      artistId: artistMap['Arijit Singh'].id,
      albumId: albumMap['War & High-Voltage Beats'].id
    },
    {
      title: 'Tauba Tauba (Bad Newz)',
      duration: 206,
      audioUrl: '/audio/tauba-tauba.mp3',
      coverArt: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
      genre: 'Punjabi Pop',
      plays: 9420000,
      artistId: artistMap['Karan Aujla'].id,
      albumId: albumMap['Bad Newz & Desi Heat'].id
    },
    {
      title: 'Chaiyya Chaiyya (Dil Se)',
      duration: 369,
      audioUrl: '/audio/chaiyya-chaiyya.mp3',
      coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood Dance',
      plays: 6820000,
      artistId: artistMap['A.R. Rahman'].id,
      albumId: albumMap['Bollywood Blockbuster Hits'].id
    },
    {
      title: 'London Thumakda (Queen)',
      duration: 232,
      audioUrl: '/audio/london-thumakda.mp3',
      coverArt: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood Dance',
      plays: 5780000,
      artistId: artistMap['Neha Kakkar'].id,
      albumId: albumMap['Desi Dhol & Party Anthems'].id
    },
    {
      title: 'Ilahi (YJHD)',
      duration: 229,
      audioUrl: '/audio/ilahi.mp3',
      coverArt: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood Pop',
      plays: 6540000,
      artistId: artistMap['Arijit Singh'].id,
      albumId: albumMap['Yeh Jawaani Hai Deewani Vibes'].id
    },
    {
      title: 'Galliyan (Ek Villain)',
      duration: 340,
      audioUrl: '/audio/galliyan.mp3',
      coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 5120000,
      artistId: artistMap['KK (Krishnakumar Kunnath)'].id,
      albumId: albumMap['Bachna Ae Haseeno & 2000s Nostalgia'].id
    },
    {
      title: 'Main Rahoon Ya Na Rahoon',
      duration: 309,
      audioUrl: '/audio/main-rahoon.mp3',
      coverArt: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80',
      genre: 'Bollywood',
      plays: 4820000,
      artistId: artistMap['Armaan Malik'].id,
      albumId: albumMap['Main Rahoon Ya Na Rahoon EP'].id
    },
    {
      title: 'Kun Faya Kun (Rockstar)',
      duration: 473,
      audioUrl: '/audio/kun-faya-kun.mp3',
      coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      genre: 'Sufi',
      plays: 6890000,
      artistId: artistMap['A.R. Rahman'].id,
      albumId: albumMap['Rockstar & Timeless Sufi'].id
    },
    {
      title: 'Blinding Lights',
      duration: 200,
      audioUrl: '/audio/blinding-lights.mp3',
      coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
      genre: 'Synthwave',
      plays: 14200000,
      artistId: artistMap['The Weeknd'].id,
      albumId: albumMap['After Hours & Neon Dreams'].id
    },
    {
      title: 'Levitating (Club Mix)',
      duration: 203,
      audioUrl: '/audio/levitating.mp3',
      coverArt: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
      genre: 'Pop Dance',
      plays: 12100000,
      artistId: artistMap['Dua Lipa'].id,
      albumId: albumMap['Future Nostalgia & Disco Gold'].id
    },
    {
      title: 'Midnight Rain & Chill',
      duration: 195,
      audioUrl: '/audio/midnight-rain.mp3',
      coverArt: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
      genre: 'Lo-Fi',
      plays: 3450000,
      artistId: artistMap['Luna Eclipse'].id,
      albumId: albumMap['Late Night Coffee & Lo-Fi Beats'].id
    },
    {
      title: 'Cyber City Drive (432Hz)',
      duration: 218,
      audioUrl: '/audio/cyber-city-drive.mp3',
      coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      genre: 'Synthwave',
      plays: 2890000,
      artistId: artistMap['Neon Mirage'].id,
      albumId: albumMap['After Hours & Neon Dreams'].id
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
      description: 'The definitive Hindi romantic collection featuring heartfelt vocals from Arijit Singh, Jubin Nautiyal, Atif Aslam, and Shreya Ghoshal.',
      coverArt: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
      userId: curatorUser.id,
      tracks: [createdSongs[0].id, createdSongs[1].id, createdSongs[2].id, createdSongs[3].id, createdSongs[4].id, createdSongs[5].id, createdSongs[6].id]
    },
    {
      title: 'Arijit Singh Soulful Anthems',
      description: 'Acoustic mastery and heart-touching melodies by Bollywood legend Arijit Singh.',
      coverArt: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80',
      userId: curatorUser.id,
      tracks: [createdSongs[0].id, createdSongs[1].id, createdSongs[2].id, createdSongs[5].id, createdSongs[12].id, createdSongs[16].id]
    },
    {
      title: 'Desi Party & Dhol Anthems',
      description: 'High-voltage dance club anthems and energetic wedding hits featuring Tauba Tauba, Ghungroo, and Chaiyya Chaiyya.',
      coverArt: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
      userId: curatorUser.id,
      tracks: [createdSongs[13].id, createdSongs[12].id, createdSongs[14].id, createdSongs[15].id, createdSongs[21].id]
    },
    {
      title: 'Sufi & Soulful Divinity',
      description: 'Spiritual transcendence and emotional depth with Kun Faya Kun, Pee Loon, and Dil Diyan Gallan.',
      coverArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      userId: curatorUser.id,
      tracks: [createdSongs[19].id, createdSongs[11].id, createdSongs[6].id, createdSongs[4].id]
    },
    {
      title: 'Wanderlust: Highway & Road Trips',
      description: 'Wind down the windows with Ilahi, Galliyan, and unforgettable college anthems.',
      coverArt: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
      userId: curatorUser.id,
      tracks: [createdSongs[16].id, createdSongs[17].id, createdSongs[18].id, createdSongs[7].id]
    },
    {
      title: 'Late Night Synthwave & Neon Lights',
      description: 'Retro 80s synthesizers, driving basslines, and cyberpunk midnight vibes.',
      coverArt: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
      userId: curatorUser.id,
      tracks: [createdSongs[20].id, createdSongs[23].id, createdSongs[22].id]
    },
    {
      title: "Trupti's Bollywood Gold",
      description: "Trupti's personally curated mix of romantic, soul, and evergreen Bollywood hits.",
      coverArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      userId: demoUser.id,
      tracks: [createdSongs[0].id, createdSongs[1].id, createdSongs[2].id, createdSongs[3].id, createdSongs[4].id, createdSongs[12].id, createdSongs[19].id]
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
      { userId: demoUser.id, songId: createdSongs[0].id },
      { userId: demoUser.id, songId: createdSongs[1].id },
      { userId: demoUser.id, songId: createdSongs[2].id },
      { userId: demoUser.id, songId: createdSongs[3].id },
      { userId: demoUser.id, songId: createdSongs[4].id },
      { userId: demoUser.id, songId: createdSongs[12].id },
      { userId: demoUser.id, songId: createdSongs[19].id }
    ]
  });

  await prisma.savedAlbum.createMany({
    data: [
      { userId: demoUser.id, albumId: albumMap['Aashiqui 2 & Soul Ballads'].id },
      { userId: demoUser.id, albumId: albumMap['Shershaah & Modern Romance'].id },
      { userId: demoUser.id, albumId: albumMap['War & High-Voltage Beats'].id },
      { userId: demoUser.id, albumId: albumMap['Rockstar & Timeless Sufi'].id }
    ]
  });

  await prisma.followedArtist.createMany({
    data: [
      { userId: demoUser.id, artistId: artistMap['Arijit Singh'].id },
      { userId: demoUser.id, artistId: artistMap['Shreya Ghoshal'].id },
      { userId: demoUser.id, artistId: artistMap['Jubin Nautiyal'].id },
      { userId: demoUser.id, artistId: artistMap['Atif Aslam'].id },
      { userId: demoUser.id, artistId: artistMap['A.R. Rahman'].id },
      { userId: demoUser.id, artistId: artistMap['The Weeknd'].id }
    ]
  });

  console.log('✨ Seeded user likes, saved albums, and followed artists!');
  console.log('🎉 Vibely 24-track database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
