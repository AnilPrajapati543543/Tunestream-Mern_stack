import React, { useEffect, useRef, useState } from 'react';

let apiLoading = false;
const callbacks = [];

const loadYoutubeAPI = (callback) => {
  if (window.YT && window.YT.Player) {
    callback();
    return;
  }
  callbacks.push(callback);
  if (apiLoading) return;
  apiLoading = true;

  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  window.onYouTubeIframeAPIReady = () => {
    callbacks.forEach(cb => cb());
  };
};

const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

class YoutubeMockAudio {
  constructor(ytPlayer) {
    this.player = ytPlayer;
    this._volume = 1;
    this.listeners = {
      timeupdate: [],
      ended: [],
      play: [],
      pause: []
    };

    this.interval = setInterval(() => {
      if (this.player && typeof this.player.getPlayerState === 'function') {
        const state = this.player.getPlayerState();
        if (state === 1) { // YT.PlayerState.PLAYING
          this.listeners.timeupdate.forEach(cb => cb());
        }
      }
    }, 250);
  }

  get currentTime() {
    return this.player && typeof this.player.getCurrentTime === 'function'
      ? this.player.getCurrentTime()
      : 0;
  }

  set currentTime(val) {
    if (this.player && typeof this.player.seekTo === 'function') {
      this.player.seekTo(val, true);
    }
  }

  get duration() {
    return this.player && typeof this.player.getDuration === 'function'
      ? this.player.getDuration()
      : 0;
  }

  get volume() {
    return this._volume;
  }

  set volume(val) {
    this._volume = val;
    if (this.player && typeof this.player.setVolume === 'function') {
      this.player.setVolume(val * 100);
    }
  }

  play() {
    if (this.player && typeof this.player.playVideo === 'function') {
      this.player.playVideo();
    }
    return Promise.resolve();
  }

  pause() {
    if (this.player && typeof this.player.pauseVideo === 'function') {
      this.player.pauseVideo();
    }
  }

  addEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  removeEventListener(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  destroy() {
    clearInterval(this.interval);
  }
}

export const UnifiedAudioPlayer = ({ track, audioRef, isAuthenticated }) => {
  const ytContainerRef = useRef(null);
  const localAudioRef = useRef(null);
  const [isYoutube, setIsYoutube] = useState(false);
  const ytPlayerRef = useRef(null);
  const mockAudioRef = useRef(null);

  const songUrl = track?.file || "";
  const ytId = getYouTubeId(songUrl);

  useEffect(() => {
    setIsYoutube(!!ytId);
  }, [songUrl, ytId]);

  // Clean up on unmount or mode switch
  useEffect(() => {
    return () => {
      if (mockAudioRef.current) {
        mockAudioRef.current.destroy();
        mockAudioRef.current = null;
      }
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (_) {}
        ytPlayerRef.current = null;
      }
    };
  }, []);

  // Standard HTML5 Audio logic
  useEffect(() => {
    if (!isYoutube && localAudioRef.current) {
      // Direct bind to parent ref
      audioRef.current = localAudioRef.current;
    }
  }, [isYoutube, songUrl]);

  // YouTube Audio logic
  useEffect(() => {
    if (isYoutube && ytId && ytContainerRef.current) {
      if (mockAudioRef.current) {
        mockAudioRef.current.destroy();
        mockAudioRef.current = null;
      }
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (_) {}
        ytPlayerRef.current = null;
      }

      loadYoutubeAPI(() => {
        const container = document.createElement('div');
        container.id = `yt-player-${ytId}`;
        ytContainerRef.current.innerHTML = '';
        ytContainerRef.current.appendChild(container);

        const player = new window.YT.Player(container.id, {
          height: '1',
          width: '1',
          videoId: ytId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
            modestbranding: 1
          },
          events: {
            onReady: (event) => {
              ytPlayerRef.current = event.target;
              const mock = new YoutubeMockAudio(event.target);
              mockAudioRef.current = mock;
              audioRef.current = mock;

              // Play immediately if authenticated
              if (isAuthenticated) {
                mock.play();
              }
            },
            onStateChange: (event) => {
              const mock = mockAudioRef.current;
              if (!mock) return;

              if (event.data === window.YT.PlayerState.ENDED) {
                mock.listeners.ended.forEach(cb => cb());
              } else if (event.data === window.YT.PlayerState.PLAYING) {
                mock.listeners.play.forEach(cb => cb());
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                mock.listeners.pause.forEach(cb => cb());
              }
            }
          }
        });
      });
    }

    return () => {
      if (isYoutube) {
        if (mockAudioRef.current) {
          mockAudioRef.current.destroy();
          mockAudioRef.current = null;
        }
        audioRef.current = null;
      }
    };
  }, [isYoutube, ytId, isAuthenticated]);

  if (isYoutube) {
    return (
      <div 
        ref={ytContainerRef} 
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: '1px', height: '1px' }} 
      />
    );
  }

  return (
    <audio 
      ref={(el) => {
        localAudioRef.current = el;
        if (!isYoutube) {
          audioRef.current = el;
        }
      }} 
      src={songUrl} 
      preload="auto" 
    />
  );
};

export default UnifiedAudioPlayer;
