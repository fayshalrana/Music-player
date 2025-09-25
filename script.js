// Music Player JavaScript
class MusicPlayer {
  constructor() {
    this.currentSongIndex = 0;
    this.isPlaying = false;
    this.isMuted = false;
    this.isReplayMode = false;
    this.currentTime = 0;
    this.duration = 0;
    this.volume = 1.0; // Volume level (0.0 to 1.0)
    this.currentPlaylist = "all"; // Current selected playlist
    this.allSongs = []; // All available songs
    this.songs = []; // Currently filtered songs

    // All available songs with language categories
    this.allSongs = [
      // Bangla Songs
      {
        title: "Tor Premete Ondho Holam",
        artist: "Adele",
        src: "./song/bangla/Tor Premete Ondho Holam.m4a",
        cover: "./cover/broken-heart.jpg",
        language: "bangla",
      },
      {
        title: "Ekhono-maje-maje",
        artist: "Asif",
        src: "./song/bangla/Ekhono-maje-maje.m4a",
        cover:
          "https://upload.wikimedia.org/wikipedia/en/d/df/RedHotChiliPeppersCalifornication.jpg",
        language: "bangla",
      },
      {
        title: "আজ কবিতা অন্য কারো",
        artist: "Aiub bacchu",
        src: "./song/bangla/আজ কবিতা অন্য কারো.m4a",
        cover:
          "http://images.rapgenius.com/59fc635f7dbe6b5cd1e07e5e605c96b5.640x640x1.jpg",
        language: "bangla",
      },
      // English Songs
      {
        title: "Lady Gaga, Bruno Mars - Die With A Smile (Lyrics)",
        artist: "Prince & The Revolution",
        src: "./song/english/Lady Gaga, Bruno Mars - Die With A Smile (Lyrics).m4a",
        cover: "./cover/fayshalrana.jpg",
        language: "english",
      },
      {
        title: "Alan Walker Mashup",
        artist: "Queen",
        src: "./song/english/Alan Walker Mashup.m4a",
        cover: "./cover/cover2.jpg",
        language: "english",
      },
      {
        title: "DHARIA - Sugar & Brownies",
        artist: "Eagles",
        src: "./song/english/DHARIA - Sugar & Brownies.m4a",
        cover: "./cover/fayshalrana.jpg",
        language: "english",
      },
      {
        title: "Pitbull - Rain Over Me ft. Marc Anthony",
        artist: "Pitbull",
        src: "./song/english/Pitbull - Rain Over Me ft. Marc Anthony.m4a",
        cover: "./cover/cover2.jpg",
        language: "english",
      },
      {
        title:
          "Arash - Broken Angel (Lyrics) Ft.Helena-I’m so lonely, broken angel",
        artist: "Arash",
        src: "./song/english/Arash - Broken Angel (Lyrics) Ft.Helena-I’m so lonely, broken angel.m4a",
        cover: "./cover/Fotos-para-tus-Portadas.jpg",
        language: "english",
      },
      // Hindi Songs
      {
        title:
          "Teri-Yaadon-Mein-Lyrical-Video-The-Killer-KK,Shreya-Ghosal-EmraanHashmi,Nisha-KothariTeri-Yaadon-Mein-Lyrical",
        artist: "K K",
        src: "./song/hindi/Teri-Yaadon-Mein-Lyrical-Video-The-Killer-KK,Shreya-Ghosal-EmraanHashmi,Nisha-KothariTeri-Yaadon-Mein-Lyrical.m4a",
        cover: "./cover/broken-heart.jpg",
        language: "hindi",
      },
      {
        title:
          "Aadat (Juda Hoke Bhi)  Atif Aslam  Kunal Khemu  Sayeed Q Emraan Hashmi",
        artist: "Kunal Khemu",
        src: "./song/hindi/Aadat-Juda-Hoke-Bhi-Atif-Aslam-Kunal-Khemu-Sayeed-Q-Emraan-Hashmi.m4a",
        cover: "./cover/fayshalrana.jpg",
        language: "hindi",
      },
      {
        title:
          "Kaho Na Kaho (Official Video) Murder | Emraan Hashmi | Mallika Sherawat",
        artist: "Emraan Hashmi",
        src: "./song/hindi/Kaho-Na-Kaho-Official-Video-Murder-Emraan-Hashmi-Mallika-Sherawat.m4a",
        cover:
          "http://images.rapgenius.com/59fc635f7dbe6b5cd1e07e5e605c96b5.640x640x1.jpg",
        language: "hindi",
      },
    ];

    // Initialize with all songs
    this.songs = [...this.allSongs];

    this.audio = new Audio();
    this.audio.volume = this.volume;
    this.init();
  }

  init() {
    this.setupAudio();
    this.setupEventListeners();
    this.renderSongList();
    this.loadSong(this.currentSongIndex);
    this.updateUI();
    this.updateActivePlaylist(this.currentPlaylist);
  }

  setupAudio() {
    this.audio.addEventListener("loadedmetadata", () => {
      this.duration = this.audio.duration;
      this.updateProgress();
    });

    this.audio.addEventListener("timeupdate", () => {
      this.currentTime = this.audio.currentTime;
      this.updateProgress();
    });

    this.audio.addEventListener("ended", () => {
      if (this.isReplayMode) {
        this.play();
      } else {
        this.nextSong();
      }
    });
  }

  setupEventListeners() {
    // Play/Pause button
    document
      .querySelector(".controls .material-icons:nth-child(2)")
      .addEventListener("click", () => {
        this.togglePlayPause();
      });

    // Previous button
    document
      .querySelector(".controls .material-icons:nth-child(1)")
      .addEventListener("click", () => {
        this.previousSong();
      });

    // Next button
    document
      .querySelector(".controls .material-icons:nth-child(3)")
      .addEventListener("click", () => {
        this.nextSong();
      });

    // Replay button
    document.querySelector(".replay-btn").addEventListener("click", () => {
      this.toggleReplay();
    });

    // Volume control
    this.setupVolumeControl();

    // Playlist dropdown
    this.setupPlaylistDropdown();

    // Song list items
    document.querySelectorAll(".music > div").forEach((songElement, index) => {
      songElement.addEventListener("click", () => {
        this.selectSong(index);
      });
    });

    // Progress bar
    document.querySelector(".progress").addEventListener("click", (e) => {
      this.seekTo(e);
    });
  }

  loadSong(index) {
    const song = this.songs[index];
    this.audio.src = song.src;
    this.updateSongInfo(song);
    this.updateSongStates();
  }

  updateSongInfo(song) {
    document.querySelector(".title h3").textContent = song.title;
    document.querySelector(".small p").textContent = song.artist;

    // Update main player cover image dynamically
    const coverElement = document.querySelector(".cover");
    if (song.cover) {
      coverElement.style.backgroundImage = `linear-gradient(rgb(0 0 0 / 60%), rgba(0, 0, 0, 0.4)), url(${song.cover})`;
      coverElement.style.backgroundSize = "cover";
      coverElement.style.backgroundPosition = "center bottom";
    }
  }

  updateSongStates() {
    document.querySelectorAll(".music > div").forEach((songElement, index) => {
      const stateElement = songElement.querySelector(".state");
      if (index === this.currentSongIndex && this.isPlaying) {
        stateElement.classList.add("playing");
        this.addPlayingHoverEffect(stateElement);
      } else {
        stateElement.classList.remove("playing");
      }
    });
  }

  addPlayingHoverEffect(stateElement) {
    const equalizerBars = stateElement.querySelector(".equalizer-bars");
    const playIcon = stateElement.querySelector(".play-icon");

    // Remove existing event listeners
    if (equalizerBars) {
      equalizerBars.removeEventListener("mouseenter", this.handlePlayingHover);
      equalizerBars.removeEventListener("mouseleave", this.handlePlayingLeave);
      equalizerBars.removeEventListener("click", this.handlePlayingClick);
    }
    if (playIcon) {
      playIcon.removeEventListener("click", this.handlePlayClick);
    }

    // Add event listeners to equalizer bars (for playing songs)
    if (equalizerBars) {
      equalizerBars.addEventListener("mouseenter", () => {
        equalizerBars.style.transform = "scale(1.2)";
        equalizerBars.style.opacity = "1";
      });

      equalizerBars.addEventListener("mouseleave", () => {
        equalizerBars.style.transform = "scale(1)";
        if (stateElement.classList.contains("playing")) {
          equalizerBars.style.opacity = "1";
        } else {
          equalizerBars.style.opacity = "0.5";
        }
      });

      equalizerBars.addEventListener("click", (e) => {
        e.stopPropagation();
        this.togglePlayPause();
      });
    }

    // Add event listeners to play icon (for non-playing songs)
    if (playIcon) {
      playIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        this.togglePlayPause();
      });
    }
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.audio
      .play()
      .then(() => {
        this.isPlaying = true;
        this.updatePlayButton();
        this.updateSongStates();
      })
      .catch((error) => {
        console.log("Error playing audio:", error);
      });
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
    this.updatePlayButton();
    this.updateSongStates();
  }

  nextSong() {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
    this.loadSong(this.currentSongIndex);
    if (this.isPlaying) {
      this.play();
    }
  }

  previousSong() {
    this.currentSongIndex =
      this.currentSongIndex === 0
        ? this.songs.length - 1
        : this.currentSongIndex - 1;
    this.loadSong(this.currentSongIndex);
    if (this.isPlaying) {
      this.play();
    }
  }

  selectSong(index) {
    this.currentSongIndex = index;
    this.loadSong(this.currentSongIndex);
    this.play(); // Always play when a song is selected
  }

  toggleReplay() {
    this.isReplayMode = !this.isReplayMode;
    const replayIcon = document.querySelector(".replay-btn");
    replayIcon.style.color = this.isReplayMode ? "#f44336" : "white";
  }

  setupVolumeControl() {
    const volumeSlider = document.querySelector(".volume-slider");
    const volumeValue = document.querySelector(".volume-value");
    const volumeIcon = document.querySelector(".volume-icon");

    // Set initial volume display
    volumeSlider.value = this.volume * 100;
    volumeValue.textContent = Math.round(this.volume * 100) + "%";

    // Volume slider change event
    volumeSlider.addEventListener("input", (e) => {
      this.volume = parseFloat(e.target.value) / 100;
      this.audio.volume = this.volume;
      volumeValue.textContent = Math.round(this.volume * 100) + "%";

      // Update volume icon based on level
      this.updateVolumeIcon();

      // Unmute if volume is increased
      if (this.volume > 0 && this.isMuted) {
        this.isMuted = false;
        this.audio.muted = false;
      }
    });

    // Volume icon click to toggle mute
    volumeIcon.addEventListener("click", () => {
      this.toggleMute();
    });
  }

  updateVolumeIcon() {
    const volumeIcon = document.querySelector(".volume-icon");

    if (this.isMuted || this.volume === 0) {
      volumeIcon.textContent = "volume_off";
    } else if (this.volume < 0.3) {
      volumeIcon.textContent = "volume_mute";
    } else if (this.volume < 0.7) {
      volumeIcon.textContent = "volume_down";
    } else {
      volumeIcon.textContent = "volume_up";
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audio.muted = this.isMuted;
    this.updateVolumeIcon();
  }

  updatePlayButton() {
    const playButton = document.querySelector(
      ".controls .material-icons:nth-child(2)"
    );
    playButton.textContent = this.isPlaying ? "pause" : "play_arrow";
  }

  updateProgress() {
    if (this.duration > 0) {
      const progressPercent = (this.currentTime / this.duration) * 100;
      document.querySelector(".progress .played").style.width =
        progressPercent + "%";

      const circlePosition = (progressPercent / 100) * (320 - 40); // 320px width - 40px margins
      document.querySelector(".progress .played .circle").style.marginLeft =
        circlePosition + "px";
    }

    // Update time display
    this.updateTimeDisplay();
  }

  updateTimeDisplay() {
    const currentTimeElement = document.querySelector(".current-time");
    const durationElement = document.querySelector(".duration");

    // Format current time
    const currentMinutes = Math.floor(this.currentTime / 60);
    const currentSeconds = Math.floor(this.currentTime % 60);
    const currentTimeFormatted = `${currentMinutes}:${currentSeconds
      .toString()
      .padStart(2, "0")}`;

    // Format duration
    const durationMinutes = Math.floor(this.duration / 60);
    const durationSeconds = Math.floor(this.duration % 60);
    const durationFormatted = `${durationMinutes}:${durationSeconds
      .toString()
      .padStart(2, "0")}`;

    // Update display
    if (currentTimeElement) {
      currentTimeElement.textContent = currentTimeFormatted;
    }
    if (durationElement) {
      durationElement.textContent = durationFormatted;
    }
  }

  seekTo(event) {
    const progressBar = document.querySelector(".progress");
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * this.duration;

    this.audio.currentTime = seekTime;
    this.currentTime = seekTime;
    this.updateProgress();
    this.updateTimeDisplay();
  }

  updateUI() {
    this.updatePlayButton();
    this.updateSongStates();
  }

  setupPlaylistDropdown() {
    const dropdown = document.querySelector(".playlist-dropdown");
    const dropdownContent = document.querySelector(".dropdown-content");
    const dropdownItems = document.querySelectorAll(".dropdown-item");

    // Toggle dropdown on click
    dropdown.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleDropdown();
    });

    // Handle dropdown item clicks
    dropdownItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const playlist = item.getAttribute("data-playlist");
        this.selectPlaylist(playlist);
        this.closeDropdown();
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target)) {
        this.closeDropdown();
      }
    });
  }

  toggleDropdown() {
    const dropdownContent = document.querySelector(".dropdown-content");
    const isOpen = dropdownContent.classList.contains("show");

    if (isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    const dropdownContent = document.querySelector(".dropdown-content");
    dropdownContent.classList.add("show");
  }

  closeDropdown() {
    const dropdownContent = document.querySelector(".dropdown-content");
    dropdownContent.classList.remove("show");
  }

  selectPlaylist(playlist) {
    this.currentPlaylist = playlist;

    // Stop current song if playing
    if (this.isPlaying) {
      this.pause();
    }

    // Update active state in dropdown
    this.updateActivePlaylist(playlist);

    // Filter songs based on selected playlist
    if (playlist === "all") {
      this.songs = [...this.allSongs];
    } else {
      this.songs = this.allSongs.filter((song) => song.language === playlist);
    }

    // Reset current song index if it's out of bounds
    if (this.currentSongIndex >= this.songs.length) {
      this.currentSongIndex = 0;
    }

    // Update the song list display
    this.renderSongList();

    // Load the current song (but don't auto-play)
    if (this.songs.length > 0) {
      this.loadSong(this.currentSongIndex);
    }
  }

  updateActivePlaylist(activePlaylist) {
    const dropdownItems = document.querySelectorAll(".dropdown-item");

    dropdownItems.forEach((item) => {
      const playlist = item.getAttribute("data-playlist");
      if (playlist === activePlaylist) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  renderSongList() {
    const musicContainer = document.querySelector(".music");
    musicContainer.innerHTML = "";

    this.songs.forEach((song, index) => {
      const songElement = document.createElement("div");
      songElement.className = `song-${index + 1}`;
      songElement.innerHTML = `
        <div class="info">
          <div class="img ${this.getImageClass(index)}"></div>
          <div class="titles">
            <h5>${song.title}</h5>
            <p>${song.artist}</p>
          </div>
        </div>
        <div class="state">
          <div class="equalizer-bars">
            <div class="equalizer-bar"></div>
            <div class="equalizer-bar"></div>
            <div class="equalizer-bar"></div>
          </div>
          <div class="play-icon">▶</div>
        </div>
      `;

      // Set background image dynamically for each song list
      const imgElement = songElement.querySelector(".img");
      if (song.cover) {
        imgElement.style.backgroundImage = `url(${song.cover})`;
        imgElement.style.backgroundSize = "cover";
        imgElement.style.backgroundPosition = "center center";
      }

      // Add click event listener
      songElement.addEventListener("click", () => {
        this.selectSong(index);
      });

      musicContainer.appendChild(songElement);
    });

    // Update song states after rendering
    this.updateSongStates();
  }

  getImageClass(index) {
    const imageClasses = [
      "first",
      "second",
      "third",
      "fourth",
      "fifth",
      "sixth",
      "seventh",
      "eighth",
    ];
    return imageClasses[index] || "first";
  }
}

// Initialize the music player when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new MusicPlayer();
});
