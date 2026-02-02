/* ===========================================
   CleanOS Academy — Podcasts System
   Audio player with Yandex Disk integration
   =========================================== */

const podcastsData = {
  episodes: [
    {
      id: 'ep1',
      title: 'Бизнес-план клинера с химией и приложением',
      description: 'Полный обзор бизнес-плана для профессионального клинера: расчёт затрат на химию, инвентарь и использование мобильного приложения.',
      duration: '47:00',
      durationSec: 2820,
      audioSrc: 'https://raw.githubusercontent.com/lowcostcleaning/cleanos-academy/main/compress.m4a',
      cover: '📊',
      category: 'Бизнес'
    }
  ]
};

// Audio element
let audioElement = null;

// Player state
let playerState = {
  currentEpisode: null,
  isPlaying: false,
  currentTime: 0,
  volume: 1,
  playbackRate: 1,
  isLoading: false
};

// Fetch direct download URL from Yandex Disk
async function getYandexDirectUrl(publicUrl) {
  try {
    const apiUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(publicUrl)}`;
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Failed to get download URL');
    const data = await response.json();
    return data.href;
  } catch (error) {
    console.error('Error getting Yandex URL:', error);
    return null;
  }
}

// Initialize podcasts page
function renderPodcastsPage() {
  const state = Storage.getState();

  // Create audio element if not exists
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.crossOrigin = 'anonymous';
    audioElement.addEventListener('timeupdate', onTimeUpdate);
    audioElement.addEventListener('ended', onAudioEnded);
    audioElement.addEventListener('loadedmetadata', onMetadataLoaded);
    audioElement.addEventListener('error', onAudioError);
    audioElement.addEventListener('canplay', onCanPlay);
  }

  // Restore player state from storage
  if (state.podcasts.currentEpisode) {
    const episode = podcastsData.episodes.find(e => e.id === state.podcasts.currentEpisode);
    if (episode) {
      playerState.currentEpisode = episode;
      playerState.currentTime = state.podcasts.currentTime || 0;
    }
  }

  renderPodcastsUI();
}

function renderPodcastsUI() {
  const container = document.querySelector('.podcasts-container');
  if (!container) return;

  const state = Storage.getState();
  const completedEpisodes = state.podcasts.completed || [];

  container.innerHTML = `
    <!-- Now Playing -->
    <div class="now-playing glass-card-static animate-fadeInUp">
      ${playerState.currentEpisode ? `
        <div class="now-playing-content">
          <div class="now-playing-cover">${playerState.currentEpisode.cover}</div>
          <div class="now-playing-info">
            <span class="now-playing-label">${playerState.isLoading ? '⏳ Загрузка...' : 'Сейчас играет'}</span>
            <h3 class="now-playing-title">${playerState.currentEpisode.title}</h3>
            <p class="now-playing-description">${playerState.currentEpisode.description}</p>
          </div>
        </div>
        
        <div class="player-controls">
          <div class="player-progress">
            <span class="player-time current">${formatPlayerTime(playerState.currentTime)}</span>
            <div class="player-progress-bar" onclick="seekTo(event)">
              <div class="player-progress-fill" style="width: ${(playerState.currentTime / playerState.currentEpisode.durationSec) * 100}%"></div>
              <div class="player-progress-handle" style="left: ${(playerState.currentTime / playerState.currentEpisode.durationSec) * 100}%"></div>
            </div>
            <span class="player-time total">${playerState.currentEpisode.duration}</span>
          </div>
          
          <div class="player-buttons">
            <button class="player-btn secondary" onclick="skipBackward()" ${playerState.isLoading ? 'disabled' : ''}>
              <span>⏪</span>
              <small>10с</small>
            </button>
            <button class="player-btn primary" onclick="togglePlay()" ${playerState.isLoading ? 'disabled' : ''}>
              ${playerState.isLoading ? '⏳' : playerState.isPlaying ? '⏸️' : '▶️'}
            </button>
            <button class="player-btn secondary" onclick="skipForward()" ${playerState.isLoading ? 'disabled' : ''}>
              <span>⏩</span>
              <small>10с</small>
            </button>
          </div>
          
          <div class="player-extras">
            <div class="player-speed">
              <button class="speed-btn ${playerState.playbackRate === 0.5 ? 'active' : ''}" onclick="setSpeed(0.5)">0.5x</button>
              <button class="speed-btn ${playerState.playbackRate === 1 ? 'active' : ''}" onclick="setSpeed(1)">1x</button>
              <button class="speed-btn ${playerState.playbackRate === 1.5 ? 'active' : ''}" onclick="setSpeed(1.5)">1.5x</button>
              <button class="speed-btn ${playerState.playbackRate === 2 ? 'active' : ''}" onclick="setSpeed(2)">2x</button>
            </div>
            <div class="player-volume">
              <span>🔊</span>
              <input type="range" min="0" max="100" value="${playerState.volume * 100}" onchange="setVolume(this.value)">
            </div>
          </div>
        </div>
      ` : `
        <div class="no-episode">
          <span class="no-episode-icon">🎧</span>
          <h3>Выберите эпизод</h3>
          <p>Нажмите на любой подкаст ниже, чтобы начать слушать</p>
        </div>
      `}
    </div>
    
    <!-- Episodes List -->
    <div class="section-header">
      <h2 class="section-title">Все эпизоды</h2>
      <span class="episodes-count">${podcastsData.episodes.length} эпизод${podcastsData.episodes.length > 1 ? 'ов' : ''}</span>
    </div>
    
    <div class="episodes-list">
      ${podcastsData.episodes.map((episode, index) => {
    const isCompleted = completedEpisodes.includes(episode.id);
    const isCurrent = playerState.currentEpisode?.id === episode.id;

    return `
          <div class="episode-card glass-card ${isCurrent ? 'active' : ''} animate-fadeInUp delay-${index % 5 + 1}"
               onclick="playEpisode('${episode.id}')">
            <div class="episode-cover">${episode.cover}</div>
            <div class="episode-info">
              <span class="episode-category">${episode.category}</span>
              <h4 class="episode-title">${episode.title}</h4>
              <p class="episode-description">${episode.description}</p>
              <div class="episode-meta">
                <span class="episode-duration">🕐 ${episode.duration}</span>
                ${isCompleted ? '<span class="episode-completed">✅ Прослушано</span>' : ''}
              </div>
            </div>
            <div class="episode-play">
              ${isCurrent && playerState.isLoading ? '⏳' : isCurrent && playerState.isPlaying ? '⏸️' : '▶️'}
            </div>
          </div>
        `;
  }).join('')}
    </div>
    
    <!-- Stats -->
    <div class="podcasts-stats glass-card-static mt-8">
      <div class="stat-item">
        <span class="stat-value">${completedEpisodes.length}</span>
        <span class="stat-label">Прослушано</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${podcastsData.episodes.length - completedEpisodes.length}</span>
        <span class="stat-label">Осталось</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">${getTotalDuration()}</span>
        <span class="stat-label">Всего контента</span>
      </div>
    </div>
  `;
}

// Play episode
async function playEpisode(episodeId) {
  const episode = podcastsData.episodes.find(e => e.id === episodeId);
  if (!episode) return;

  // If same episode, toggle play/pause
  if (playerState.currentEpisode?.id === episodeId && !playerState.isLoading) {
    togglePlay();
    return;
  }

  // New episode - start loading
  playerState.currentEpisode = episode;
  playerState.currentTime = 0;
  playerState.isLoading = true;
  playerState.isPlaying = false;
  renderPodcastsUI();

  showToast('⏳ Загрузка аудио...');

  // Load and play audio
  audioElement.src = episode.audioSrc;
  audioElement.playbackRate = playerState.playbackRate;
  audioElement.volume = playerState.volume;
  audioElement.load();

  // Save to storage
  Storage.updatePodcastProgress(episodeId, 0);
}

function onCanPlay() {
  if (playerState.isLoading) {
    playerState.isLoading = false;
    playerState.isPlaying = true;
    audioElement.play().catch(err => {
      console.error('Error playing audio:', err);
      showToast('❌ Ошибка воспроизведения', 'error');
    });
    renderPodcastsUI();
    showToast(`▶️ ${playerState.currentEpisode.title}`);
  }
}

function onAudioError(e) {
  console.error('Audio error:', e);
  playerState.isLoading = false;
  playerState.isPlaying = false;
  showToast('❌ Ошибка загрузки аудио', 'error');
  renderPodcastsUI();
}

// Toggle play/pause
function togglePlay() {
  if (!playerState.currentEpisode || playerState.isLoading) return;

  if (playerState.isPlaying) {
    audioElement.pause();
    playerState.isPlaying = false;
  } else {
    audioElement.play().catch(err => console.error('Error playing:', err));
    playerState.isPlaying = true;
  }

  renderPodcastsUI();
}

// Audio event handlers
function onTimeUpdate() {
  if (!playerState.currentEpisode) return;

  playerState.currentTime = audioElement.currentTime;

  // Update progress bar
  const progressFill = document.querySelector('.player-progress-fill');
  const progressHandle = document.querySelector('.player-progress-handle');
  const currentTimeEl = document.querySelector('.player-time.current');

  if (progressFill && playerState.currentEpisode) {
    const progress = (playerState.currentTime / playerState.currentEpisode.durationSec) * 100;
    progressFill.style.width = progress + '%';
    if (progressHandle) progressHandle.style.left = progress + '%';
  }
  if (currentTimeEl) {
    currentTimeEl.textContent = formatPlayerTime(playerState.currentTime);
  }

  // Save progress every 10 seconds
  if (Math.floor(playerState.currentTime) % 10 === 0) {
    Storage.updatePodcastProgress(playerState.currentEpisode.id, playerState.currentTime);
  }
}

function onAudioEnded() {
  playerState.isPlaying = false;

  // Mark as completed
  Storage.markPodcastCompleted(playerState.currentEpisode.id);

  showToast('✅ Эпизод завершён!', 'success');

  // Play next episode if available
  const currentIndex = podcastsData.episodes.findIndex(e => e.id === playerState.currentEpisode.id);
  if (currentIndex < podcastsData.episodes.length - 1) {
    setTimeout(() => {
      playEpisode(podcastsData.episodes[currentIndex + 1].id);
    }, 2000);
  } else {
    renderPodcastsUI();
  }
}

function onMetadataLoaded() {
  // Update duration from actual audio file
  if (audioElement.duration && playerState.currentEpisode) {
    playerState.currentEpisode.durationSec = audioElement.duration;
    playerState.currentEpisode.duration = formatPlayerTime(audioElement.duration);
    renderPodcastsUI();
  }
}

// Player controls
function skipBackward() {
  if (!playerState.currentEpisode) return;
  audioElement.currentTime = Math.max(0, audioElement.currentTime - 10);
}

function skipForward() {
  if (!playerState.currentEpisode) return;
  audioElement.currentTime = Math.min(audioElement.duration, audioElement.currentTime + 10);
}

function seekTo(event) {
  if (!playerState.currentEpisode) return;

  const bar = event.currentTarget;
  const rect = bar.getBoundingClientRect();
  const percent = (event.clientX - rect.left) / rect.width;

  audioElement.currentTime = audioElement.duration * percent;
}

function setSpeed(rate) {
  playerState.playbackRate = rate;
  if (audioElement) {
    audioElement.playbackRate = rate;
  }
  renderPodcastsUI();
  showToast(`⏱️ Скорость: ${rate}x`);
}

function setVolume(value) {
  playerState.volume = value / 100;
  if (audioElement) {
    audioElement.volume = playerState.volume;
  }
}

// Helpers
function formatPlayerTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getTotalDuration() {
  const totalSeconds = podcastsData.episodes.reduce((sum, ep) => sum + ep.durationSec, 0);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}ч ${mins}м`;
  }
  return `${mins} мин`;
}

// Export
window.renderPodcastsPage = renderPodcastsPage;
window.playEpisode = playEpisode;
window.togglePlay = togglePlay;
window.skipBackward = skipBackward;
window.skipForward = skipForward;
window.seekTo = seekTo;
window.setSpeed = setSpeed;
window.setVolume = setVolume;
