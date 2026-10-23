/**
 * Vibely — Social Vibe Network Application Logic
 * Modern vanilla JS with state management, Web Audio synthesizer, and reactive DOM
 */

(function () {
  'use strict';

  // --- Initial State & Mock Data ---
  const state = {
    currentUser: {
      name: 'Trupti More',
      handle: '@trupti',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
      vibesCount: 18,
      auraScore: 1420,
      streak: 7,
      currentMood: 'Flow',
      currentMoodEmoji: '⚡'
    },
    activeFilter: 'all',
    activeTab: 'all',
    searchQuery: '',
    selectedComposerMood: 'Flow',
    selectedComposerEmoji: '⚡',
    selectedComposerAura: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(59, 130, 246, 0.2))',
    savedVibeIds: new Set(),
    vibes: [
      {
        id: 'vibe-1',
        author: {
          name: 'Elena Rostova',
          handle: '@elena',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
        },
        timestamp: '12m ago',
        mood: 'Chill',
        emoji: '🌙',
        aura: 'linear-gradient(135deg, rgba(59, 130, 246, 0.22), rgba(139, 92, 246, 0.18))',
        text: 'Lo-Fi dusk over the city rooftops 🌇 Watching the lights flicker on while sipping roasted matcha. The twilight breeze hits completely different today.',
        media: 'assets/images/sunset_vibe.jpg',
        soundtrack: 'Tycho — A Walk (Sunset Edit)',
        reactions: { vibes: 128, boosts: 42, comments: 19 },
        userReacted: { vibe: false, boost: false }
      },
      {
        id: 'vibe-2',
        author: {
          name: 'Kaelen Chen',
          handle: '@kaelen',
          avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80'
        },
        timestamp: '45m ago',
        mood: 'Creative',
        emoji: '🎨',
        aura: 'linear-gradient(135deg, rgba(236, 72, 153, 0.22), rgba(6, 182, 212, 0.2))',
        text: 'Holographic glass flora exhibition in the district tonight 🔮 Every angle bends light into a brand new spectrum of colors. Infinite design inspiration.',
        media: 'assets/images/neon_bloom.jpg',
        soundtrack: 'ODESZA — The Last Goodbye',
        reactions: { vibes: 294, boosts: 88, comments: 34 },
        userReacted: { vibe: true, boost: false }
      },
      {
        id: 'vibe-3',
        author: {
          name: 'Trupti More',
          handle: '@trupti',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'
        },
        timestamp: '2h ago',
        mood: 'Flow',
        emoji: '⚡',
        aura: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(59, 130, 246, 0.2))',
        text: 'Deep coding flow state achieved ⚡ 3 hours went by like 15 minutes. There is pure magic when the music, coffee, and code align seamlessly.',
        media: null,
        soundtrack: 'Kavinsky — Nightcall (Instrumental)',
        reactions: { vibes: 84, boosts: 36, comments: 11 },
        userReacted: { vibe: false, boost: false }
      },
      {
        id: 'vibe-4',
        author: {
          name: 'Maya Lin',
          handle: '@mayavibe',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80'
        },
        timestamp: '4h ago',
        mood: 'Hyped',
        emoji: '🔥',
        aura: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(236, 72, 153, 0.2))',
        text: 'Just scored tickets for the holographic festival next month!! 🔥 High frequency vibes incoming, anyone else from the community attending?',
        media: null,
        soundtrack: 'RÜFÜS DU SOL — Innerbloom',
        reactions: { vibes: 312, boosts: 115, comments: 46 },
        userReacted: { vibe: false, boost: false }
      }
    ]
  };

  // --- Web Audio Ambient Synthesizer ---
  let audioCtx = null;
  let isPlayingAmbient = false;
  let ambientOscillators = [];
  let ambientGainNode = null;
  let visualizerAnimId = null;

  const ambientTracks = [
    { title: 'Neon Horizon Dream', artist: 'Synthwave Lo-Fi • 432 Hz', chord: [220, 261.63, 329.63, 392.00] }, // Am7
    { title: 'Twilight Starlight Pulse', artist: 'Deep Ambient Flow • Binaural', chord: [174.61, 220, 261.63, 329.63] }, // Fmaj7
    { title: 'Cyber Rain Reverie', artist: 'Rainy Lo-Fi Beats • Cozy Chill', chord: [146.83, 220, 261.63, 349.23] }  // Dm7
  ];
  let currentAmbientTrackIdx = 0;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  }

  function startAmbientSynth() {
    initAudioContext();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    stopAmbientSynth();

    const track = ambientTracks[currentAmbientTrackIdx];
    ambientGainNode = audioCtx.createGain();
    const volumeSlider = document.getElementById('ambientVolume');
    const vol = volumeSlider ? volumeSlider.value / 100 : 0.7;
    ambientGainNode.gain.setValueAtTime(0.01, audioCtx.currentTime);
    ambientGainNode.gain.exponentialRampToValueAtTime(vol * 0.25, audioCtx.currentTime + 1.5);
    ambientGainNode.connect(audioCtx.destination);

    // Filter for warmth
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, audioCtx.currentTime);
    filter.connect(ambientGainNode);

    // Create polyphonic ambient oscillators
    ambientOscillators = track.chord.map((freq, idx) => {
      const osc = audioCtx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      // Subtle detune for lush chorus feel
      osc.detune.setValueAtTime((idx - 1.5) * 6, audioCtx.currentTime);
      osc.connect(filter);
      osc.start();
      return osc;
    });

    isPlayingAmbient = true;
    updateAmbientUI(true);
    startVisualizer();
    showToast(`Now Playing: ${track.title} 🎵`);
  }

  function stopAmbientSynth() {
    if (ambientOscillators.length > 0) {
      ambientOscillators.forEach(osc => {
        try {
          osc.stop();
          osc.disconnect();
        } catch (e) {}
      });
      ambientOscillators = [];
    }
    isPlayingAmbient = false;
    updateAmbientUI(false);
  }

  function toggleAmbientPlay() {
    if (isPlayingAmbient) {
      stopAmbientSynth();
    } else {
      startAmbientSynth();
    }
  }

  function updateAmbientUI(playing) {
    const playBtn = document.getElementById('playAmbientBtn');
    const playIcon = document.getElementById('playIcon');
    const statusText = document.getElementById('ambientStatusText');
    const track = ambientTracks[currentAmbientTrackIdx];

    document.getElementById('ambientTrackTitle').textContent = track.title;
    document.getElementById('ambientTrackArtist').textContent = track.artist;

    if (playing) {
      playIcon.textContent = '⏸';
      statusText.textContent = 'Live Audio Stream';
      statusText.style.color = '#34d399';
    } else {
      playIcon.textContent = '▶';
      statusText.textContent = 'Synthesized Chords (Paused)';
      statusText.style.color = '#a78bfa';
    }
  }

  // Visualizer Animation
  function startVisualizer() {
    const canvas = document.getElementById('audioVisualizerCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const numBars = 28;
      const barWidth = width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        const factor = isPlayingAmbient
          ? Math.sin(phase + i * 0.4) * 0.5 + 0.5
          : 0.15;
        const barHeight = Math.max(4, factor * (height - 8));
        const x = i * (barWidth + 2);
        const y = (height - barHeight) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#8b5cf6');
        gradient.addColorStop(0.5, '#ec4899');
        gradient.addColorStop(1, '#06b6d4');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      if (isPlayingAmbient) {
        phase += 0.08;
      }

      visualizerAnimId = requestAnimationFrame(render);
    }

    if (visualizerAnimId) cancelAnimationFrame(visualizerAnimId);
    render();
  }

  // --- Render Stream of Vibes ---
  function renderVibes() {
    const container = document.getElementById('vibesStream');
    if (!container) return;

    let filtered = state.vibes.filter(v => {
      // Channel / Mood filter
      if (state.activeFilter === 'saved') {
        if (!state.savedVibeIds.has(v.id)) return false;
      } else if (state.activeFilter !== 'all') {
        if (v.mood.toLowerCase() !== state.activeFilter.toLowerCase()) return false;
      }

      // Tab filter
      if (state.activeTab === 'audio' && !v.soundtrack) return false;
      if (state.activeTab === 'media' && !v.media) return false;

      // Search Query filter
      if (state.searchQuery.trim()) {
        const q = state.searchQuery.toLowerCase();
        const matchText = v.text.toLowerCase().includes(q);
        const matchAuthor = v.author.name.toLowerCase().includes(q) || v.author.handle.toLowerCase().includes(q);
        const matchMood = v.mood.toLowerCase().includes(q);
        const matchSound = v.soundtrack ? v.soundtrack.toLowerCase().includes(q) : false;
        if (!matchText && !matchAuthor && !matchMood && !matchSound) return false;
      }

      return true;
    });

    // Update Channel Counts
    const allCountElem = document.getElementById('channelCountAll');
    if (allCountElem) allCountElem.textContent = state.vibes.length;
    const savedCountElem = document.getElementById('channelCountSaved');
    if (savedCountElem) savedCountElem.textContent = state.savedVibeIds.size;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="glass-card" style="padding: 3rem; text-align: center; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.8rem;">🌌</div>
          <h3 style="font-family: var(--font-display); font-size: 1.2rem; color: #fff; margin-bottom: 0.4rem;">No vibrations found in this frequency</h3>
          <p style="font-size: 0.88rem;">Try switching channels, adjusting your search, or drop a new vibe!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(vibe => {
      const isSaved = state.savedVibeIds.has(vibe.id);
      return `
        <article class="glass-card vibe-card" id="${vibe.id}" style="--card-aura: ${vibe.aura};">
          <div class="vibe-card-inner">
            <!-- Header -->
            <div class="vibe-card-header">
              <div class="author-info">
                <img src="${vibe.author.avatar}" alt="${vibe.author.name}" class="author-avatar">
                <div class="author-details">
                  <span class="author-name">
                    ${vibe.author.name}
                    ${vibe.author.handle === state.currentUser.handle ? '<span style="color: var(--vibe-purple); font-size: 0.75rem;">(You)</span>' : ''}
                  </span>
                  <span class="author-meta">${vibe.author.handle} • ${vibe.timestamp}</span>
                </div>
              </div>
              <div class="vibe-badge">
                <span>${vibe.emoji}</span>
                <span>${vibe.mood}</span>
              </div>
            </div>

            <!-- Content -->
            <div class="vibe-card-content">
              <p>${vibe.text}</p>
            </div>

            <!-- Media Preview -->
            ${vibe.media ? `
              <div class="vibe-card-media" onclick="window.vibelyApp.openMediaModal('${vibe.media}')" style="cursor: pointer;">
                <img src="${vibe.media}" alt="Vibe visual" loading="lazy">
              </div>
            ` : ''}

            <!-- Attached Soundtrack -->
            ${vibe.soundtrack ? `
              <div class="vibe-audio-widget">
                <button class="audio-play-btn" onclick="window.vibelyApp.playTrack('${vibe.soundtrack.replace(/'/g, "\\'")}', this)" aria-label="Play Track">
                  <span>▶</span>
                </button>
                <div class="audio-meta-area">
                  <span class="audio-track-name">${vibe.soundtrack}</span>
                  <span class="audio-artist-name">Featured Aura Soundtrack</span>
                </div>
                <div class="sound-waves">
                  <span class="bar"></span>
                  <span class="bar"></span>
                  <span class="bar"></span>
                  <span class="bar"></span>
                  <span class="bar"></span>
                </div>
              </div>
            ` : ''}

            <!-- Actions / Reactions -->
            <div class="vibe-card-actions">
              <div class="actions-left">
                <button class="action-pill ${vibe.userReacted.vibe ? 'active-like' : ''}" onclick="window.vibelyApp.toggleReaction('${vibe.id}', 'vibe')">
                  <span>${vibe.userReacted.vibe ? '💜' : '🤍'}</span>
                  <span class="count">${vibe.reactions.vibes}</span>
                </button>
                <button class="action-pill ${vibe.userReacted.boost ? 'active-boost' : ''}" onclick="window.vibelyApp.toggleReaction('${vibe.id}', 'boost')">
                  <span>⚡</span>
                  <span class="count">${vibe.reactions.boosts}</span>
                </button>
                <button class="action-pill" onclick="window.vibelyApp.openCommentsModal('${vibe.id}')">
                  <span>💬</span>
                  <span class="count">${vibe.reactions.comments}</span>
                </button>
              </div>

              <div class="actions-right">
                <button class="action-pill" onclick="window.vibelyApp.shareVibe('${vibe.id}')" title="Share Vibe">
                  <span>🔗</span>
                </button>
                <button class="action-pill ${isSaved ? 'active-like' : ''}" onclick="window.vibelyApp.toggleBookmark('${vibe.id}')" title="Bookmark Vibe">
                  <span>${isSaved ? '🔖' : '🏷️'}</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }

  // --- Actions & Handlers ---
  function publishNewVibe() {
    const textarea = document.getElementById('composerText');
    const soundtrackInput = document.getElementById('composerSoundtrack');
    const text = textarea ? textarea.value.trim() : '';

    if (!text) {
      showToast('⚠️ Write a few words about your vibe before posting!');
      if (textarea) textarea.focus();
      return;
    }

    const newVibe = {
      id: 'vibe-' + Date.now(),
      author: {
        name: state.currentUser.name,
        handle: state.currentUser.handle,
        avatar: state.currentUser.avatar
      },
      timestamp: 'Just now',
      mood: state.selectedComposerMood,
      emoji: state.selectedComposerEmoji,
      aura: state.selectedComposerAura,
      text: text,
      media: null,
      soundtrack: soundtrackInput && soundtrackInput.value.trim() ? soundtrackInput.value.trim() : null,
      reactions: { vibes: 1, boosts: 0, comments: 0 },
      userReacted: { vibe: true, boost: false }
    };

    // Prepend to list
    state.vibes.unshift(newVibe);
    state.currentUser.vibesCount += 1;
    state.currentUser.auraScore += 45;

    // Reset composer
    textarea.value = '';
    if (soundtrackInput) soundtrackInput.value = '';

    // Update UI Stats
    document.getElementById('statVibesCount').textContent = state.currentUser.vibesCount;
    document.getElementById('statAuraScore').textContent = state.currentUser.auraScore.toLocaleString();

    renderVibes();
    showToast('✨ Vibe dropped into the frequency stream!');
  }

  function toggleReaction(vibeId, type) {
    const vibe = state.vibes.find(v => v.id === vibeId);
    if (!vibe) return;

    if (type === 'vibe') {
      vibe.userReacted.vibe = !vibe.userReacted.vibe;
      vibe.reactions.vibes += vibe.userReacted.vibe ? 1 : -1;
      if (vibe.userReacted.vibe) {
        showToast('💜 Vibe checked ✨');
        state.currentUser.auraScore += 10;
        document.getElementById('statAuraScore').textContent = state.currentUser.auraScore.toLocaleString();
      }
    } else if (type === 'boost') {
      vibe.userReacted.boost = !vibe.userReacted.boost;
      vibe.reactions.boosts += vibe.userReacted.boost ? 1 : -1;
      if (vibe.userReacted.boost) {
        showToast('⚡ Energy Boosted!');
        state.currentUser.auraScore += 15;
        document.getElementById('statAuraScore').textContent = state.currentUser.auraScore.toLocaleString();
      }
    }

    renderVibes();
  }

  function toggleBookmark(vibeId) {
    if (state.savedVibeIds.has(vibeId)) {
      state.savedVibeIds.delete(vibeId);
      showToast('Removed from Saved Vibes');
    } else {
      state.savedVibeIds.add(vibeId);
      showToast('🔖 Saved to your frequency collection!');
    }
    renderVibes();
  }

  function shareVibe(vibeId) {
    const url = window.location.origin + window.location.pathname + '#' + vibeId;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('🔗 Vibe link copied to clipboard!');
      }).catch(() => {
        showToast('🔗 Link: ' + url);
      });
    } else {
      showToast('🔗 Link: ' + url);
    }
  }

  function playTrack(trackTitle, btn) {
    const waveContainer = btn.parentElement.querySelector('.sound-waves');
    const isPlaying = btn.classList.contains('playing');

    // Reset any other playing vibe buttons
    document.querySelectorAll('.audio-play-btn').forEach(b => {
      b.classList.remove('playing');
      b.innerHTML = '<span>▶</span>';
      const w = b.parentElement.querySelector('.sound-waves');
      if (w) w.classList.remove('playing');
    });

    if (!isPlaying) {
      btn.classList.add('playing');
      btn.innerHTML = '<span>⏸</span>';
      if (waveContainer) waveContainer.classList.add('playing');

      // Update ambient player
      document.getElementById('ambientTrackTitle').textContent = trackTitle;
      document.getElementById('ambientTrackArtist').textContent = 'Vibe Track Stream • High Definition';
      startAmbientSynth();
    } else {
      stopAmbientSynth();
    }
  }

  // Daily Mood Check-In Handlers
  function setDailyMood(mood, emoji, color) {
    state.currentUser.currentMood = mood;
    state.currentUser.currentMoodEmoji = emoji;
    state.currentUser.auraScore += 25;

    // Update Header Pill
    document.getElementById('activeStatusEmoji').textContent = emoji;
    document.getElementById('activeStatusLabel').textContent = mood;

    // Update Profile Stat
    document.getElementById('statAuraScore').textContent = state.currentUser.auraScore.toLocaleString();

    // Visual selection
    document.querySelectorAll('#moodCheckinGrid .mood-option').forEach(btn => {
      if (btn.getAttribute('data-mood') === mood) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Animate Global Radar percentages subtly
    animateRadar(mood);
    showToast(`${emoji} Daily mood checked in: ${mood} (+25 Aura)`);
  }

  function animateRadar(boostMood) {
    const radar = {
      Flow: document.getElementById('radarFlowPct'),
      Chill: document.getElementById('radarChillPct'),
      Creative: document.getElementById('radarCreativePct'),
      Hyped: document.getElementById('radarHypedPct')
    };

    if (radar[boostMood]) {
      const current = parseInt(radar[boostMood].textContent, 10) || 30;
      radar[boostMood].textContent = (current + 3) + '%';
      const track = radar[boostMood].closest('.radar-item').querySelector('.radar-fill');
      if (track) track.style.width = (current + 3) + '%';
    }
  }

  // Toast System
  function showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 3000);
  }

  // Modal Dialog System
  function openMediaModal(imgSrc) {
    const backdrop = document.getElementById('modalBackdrop');
    const body = document.getElementById('modalBody');
    if (!backdrop || !body) return;

    body.innerHTML = `
      <div style="text-align: center;">
        <img src="${imgSrc}" alt="Expanded Vibe View" style="max-width: 100%; max-height: 70vh; border-radius: var(--radius-md); object-fit: contain; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
        <p style="margin-top: 1rem; color: var(--text-muted); font-size: 0.9rem;">✨ Vibely High-Definition Visual Stream</p>
      </div>
    `;
    backdrop.classList.add('open');
  }

  function openCommentsModal(vibeId) {
    const vibe = state.vibes.find(v => v.id === vibeId);
    if (!vibe) return;

    const backdrop = document.getElementById('modalBackdrop');
    const body = document.getElementById('modalBody');
    if (!backdrop || !body) return;

    body.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${vibe.author.avatar}" style="width: 40px; height: 40px; border-radius: 50%;">
          <div>
            <h4 style="font-family: var(--font-display); font-size: 1rem; color: #fff;">${vibe.author.name}'s Vibe</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted);">${vibe.mood} Frequency</p>
          </div>
        </div>
        <p style="padding: 0.8rem; background: rgba(255,255,255,0.04); border-radius: var(--radius-sm); color: #cbd5e1; font-size: 0.92rem;">
          "${vibe.text}"
        </p>

        <h5 style="color: #fff; font-size: 0.9rem; margin-top: 0.5rem;">Comments & Energy Resonance (${vibe.reactions.comments})</h5>
        <div style="display: flex; flex-direction: column; gap: 0.6rem; max-height: 200px; overflow-y: auto;">
          <div style="display: flex; gap: 0.6rem; font-size: 0.85rem;">
            <strong>@marcus:</strong> <span style="color: var(--text-muted);">The aesthetic on this is completely next level!</span>
          </div>
          <div style="display: flex; gap: 0.6rem; font-size: 0.85rem;">
            <strong>@synth_lover:</strong> <span style="color: var(--text-muted);">Added that track to my daily rotation immediately 🎧</span>
          </div>
        </div>

        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
          <input type="text" id="newCommentInput" placeholder="Add to the conversation..." style="flex:1; padding: 0.6rem 1rem; border-radius: var(--radius-pill); background: rgba(255,255,255,0.05); border: 1px solid var(--border-subtle); color: #fff; outline:none;">
          <button class="btn-primary" onclick="window.vibelyApp.postComment('${vibe.id}')">Send</button>
        </div>
      </div>
    `;
    backdrop.classList.add('open');
  }

  function postComment(vibeId) {
    const input = document.getElementById('newCommentInput');
    if (!input || !input.value.trim()) return;

    const vibe = state.vibes.find(v => v.id === vibeId);
    if (vibe) {
      vibe.reactions.comments += 1;
      renderVibes();
      showToast('💬 Comment dropped into the vibe!');
      document.getElementById('modalBackdrop').classList.remove('open');
    }
  }

  function closeModal() {
    const backdrop = document.getElementById('modalBackdrop');
    if (backdrop) backdrop.classList.remove('open');
  }

  // --- Initialize Event Listeners ---
  function setupEventListeners() {
    // Publish Vibe
    const publishBtn = document.getElementById('publishVibeBtn');
    if (publishBtn) publishBtn.addEventListener('click', publishNewVibe);

    // Composer Mood Pills
    document.querySelectorAll('#composerMoodPills .mood-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#composerMoodPills .mood-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        state.selectedComposerMood = pill.getAttribute('data-mood');
        state.selectedComposerEmoji = pill.getAttribute('data-emoji');
      });
    });

    // Composer Aura Swatches
    document.querySelectorAll('#composerAuraPalette .aura-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        document.querySelectorAll('#composerAuraPalette .aura-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        state.selectedComposerAura = swatch.getAttribute('data-gradient');
      });
    });

    // Channel Nav Links
    document.querySelectorAll('#vibeChannelNav .channel-link').forEach(link => {
      link.addEventListener('click', () => {
        document.querySelectorAll('#vibeChannelNav .channel-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        state.activeFilter = link.getAttribute('data-filter');

        const badge = document.getElementById('activeFilterBadge');
        if (badge) {
          const name = link.querySelector('.channel-name').textContent;
          badge.textContent = `Showing: ${name}`;
        }
        renderVibes();
      });
    });

    // Feed Tabs
    document.querySelectorAll('#feedTabs .feed-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('#feedTabs .feed-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.activeTab = tab.getAttribute('data-tab');
        renderVibes();
      });
    });

    // Search Input
    const searchInput = document.getElementById('vibeSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderVibes();
      });
    }

    // Daily Mood Buttons
    document.querySelectorAll('#moodCheckinGrid .mood-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const mood = opt.getAttribute('data-mood');
        const emoji = opt.getAttribute('data-emoji');
        const color = opt.getAttribute('data-color');
        setDailyMood(mood, emoji, color);
      });
    });

    // Trending Tag Chips
    document.querySelectorAll('#tagCloud .tag-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const tag = chip.getAttribute('data-tag');
        if (searchInput) {
          searchInput.value = tag;
          state.searchQuery = tag;
          renderVibes();
          showToast(`Filtered by tag: ${tag}`);
        }
      });
    });

    // Theme Toggle (Cycle: Dark -> Cyber -> Sunset)
    const themeBtn = document.getElementById('themeToggleBtn');
    const themes = ['theme-dark', 'theme-cyber', 'theme-sunset'];
    let currentThemeIdx = 0;

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        document.body.classList.remove(...themes);
        currentThemeIdx = (currentThemeIdx + 1) % themes.length;
        document.body.classList.add(themes[currentThemeIdx]);
        const themeNames = ['Velvet Dark', 'Cyber Neon', 'Sunset Amber'];
        showToast(`Theme switched to ${themeNames[currentThemeIdx]} 🎨`);
      });
    }

    // Modal close events
    const closeBtn = document.getElementById('modalCloseBtn');
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    const backdrop = document.getElementById('modalBackdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }

    // Ambient Controls
    const playAmbientBtn = document.getElementById('playAmbientBtn');
    if (playAmbientBtn) playAmbientBtn.addEventListener('click', toggleAmbientPlay);

    const nextTrackBtn = document.getElementById('nextTrackBtn');
    if (nextTrackBtn) {
      nextTrackBtn.addEventListener('click', () => {
        currentAmbientTrackIdx = (currentAmbientTrackIdx + 1) % ambientTracks.length;
        if (isPlayingAmbient) startAmbientSynth();
        else updateAmbientUI(false);
      });
    }

    const prevTrackBtn = document.getElementById('prevTrackBtn');
    if (prevTrackBtn) {
      prevTrackBtn.addEventListener('click', () => {
        currentAmbientTrackIdx = (currentAmbientTrackIdx - 1 + ambientTracks.length) % ambientTracks.length;
        if (isPlayingAmbient) startAmbientSynth();
        else updateAmbientUI(false);
      });
    }

    const volumeSlider = document.getElementById('ambientVolume');
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        if (ambientGainNode && audioCtx) {
          const vol = e.target.value / 100;
          ambientGainNode.gain.setValueAtTime(vol * 0.25, audioCtx.currentTime);
        }
      });
    }
  }

  // Connect Button handler (Global)
  window.toggleConnect = function (btn) {
    if (btn.classList.contains('connected')) {
      btn.classList.remove('connected');
      btn.textContent = 'Connect';
      showToast('Connection removed');
    } else {
      btn.classList.add('connected');
      btn.textContent = 'Connected ✓';
      showToast('✨ Vibe frequency connected!');
    }
  };

  // Expose methods for inline onclick events
  window.vibelyApp = {
    toggleReaction,
    toggleBookmark,
    shareVibe,
    playTrack,
    openMediaModal,
    openCommentsModal,
    postComment
  };

  // Run on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    renderVibes();
    startVisualizer();
  });
})();
