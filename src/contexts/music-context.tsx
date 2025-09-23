'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

// Types for the music system
export interface Track {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  duration: number;
  url: string;
  file?: File;
  addedAt: Date;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  tracks: Track[];
  mood?: string;
  season?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MusicState {
  // Playback state
  currentTrack: Track | null;
  currentPlaylist: Playlist | null;
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  
  // UI state
  isMinimized: boolean;
  showVisualizer: boolean;
  showQueue: boolean;
  
  // Queue and playlists
  queue: Track[];
  originalQueue: Track[];
  playlists: Playlist[];
  recentlyPlayed: Track[];
}

export interface MusicActions {
  // Playback controls
  play: (track?: Track, playlist?: Playlist) => void;
  pause: () => void;
  stop: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
  
  // Track management
  addTrack: (file: File) => Promise<Track>;
  removeTrack: (trackId: string) => void;
  
  // Playlist management
  createPlaylist: (name: string, mood?: string, season?: string) => Playlist;
  updatePlaylist: (playlistId: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (playlistId: string) => void;
  addTrackToPlaylist: (playlistId: string, track: Track) => void;
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void;
  
  // Queue management
  addToQueue: (track: Track) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  shuffleQueue: () => void;
  
  // UI controls
  toggleMinimized: () => void;
  toggleVisualizer: () => void;
  toggleQueue: () => void;
  
  // Smart features
  suggestPlaylistForMood: (mood: string) => Playlist | null;
  suggestPlaylistForSeason: (season: string) => Playlist | null;
  getPlaylistForMoodAndSeason: (mood?: string, season?: string) => Playlist | null;
}

const MusicContext = createContext<(MusicState & MusicActions) | null>(null);

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<MusicState>({
    currentTrack: null,
    currentPlaylist: null,
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    isShuffled: false,
    repeatMode: 'none',
    isMinimized: false,
    showVisualizer: false,
    showQueue: false,
    queue: [],
    originalQueue: [],
    playlists: [],
    recentlyPlayed: []
  });

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;
    
    audio.volume = state.volume;
    
    // Audio event listeners
    const handleLoadedMetadata = () => {
      setState(prev => ({ ...prev, duration: audio.duration }));
    };
    
    const handleTimeUpdate = () => {
      setState(prev => ({ ...prev, currentTime: audio.currentTime }));
    };
    
    const handleEnded = () => {
      handleNext();
    };
    
    const handlePlay = () => {
      setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    };
    
    const handlePause = () => {
      setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    };

    // Volume change event listener (for device volume controls)
    const handleVolumeChange = () => {
      setState(prev => ({ 
        ...prev, 
        volume: audio.volume,
        isMuted: audio.volume === 0 || audio.muted
      }));
    };
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('volumechange', handleVolumeChange);
    
    // Load saved data from localStorage
    loadPersistedData();
    
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('volumechange', handleVolumeChange);
    };
  }, []);

  // Set up MediaSession action handlers separately to avoid circular dependencies
  useEffect(() => {
    if ('mediaSession' in navigator && navigator.mediaSession) {
      const handlePlay = () => {
        audioRef.current?.play();
      };
      
      const handlePause = () => {
        audioRef.current?.pause();
      };
      
      const handleNext = () => {
        if (state.queue.length === 0) return;
        const currentIndex = state.queue.findIndex(track => track.id === state.currentTrack?.id);
        let nextIndex = currentIndex + 1;
        
        if (state.repeatMode === 'one') {
          nextIndex = currentIndex;
        } else if (nextIndex >= state.queue.length) {
          if (state.repeatMode === 'all') {
            nextIndex = 0;
          } else {
            return;
          }
        }
        
        if (state.queue[nextIndex] && audioRef.current) {
          const track = state.queue[nextIndex];
          audioRef.current.src = track.url;
          setState(prev => ({
            ...prev,
            currentTrack: track,
            recentlyPlayed: [track, ...prev.recentlyPlayed.filter(t => t.id !== track.id).slice(0, 49)]
          }));
          audioRef.current.play().catch(console.error);
        }
      };
      
      const handlePrevious = () => {
        if (state.queue.length === 0) return;
        const currentIndex = state.queue.findIndex(track => track.id === state.currentTrack?.id);
        let prevIndex = currentIndex - 1;
        
        if (prevIndex < 0) {
          prevIndex = state.queue.length - 1;
        }
        
        if (state.queue[prevIndex] && audioRef.current) {
          const track = state.queue[prevIndex];
          audioRef.current.src = track.url;
          setState(prev => ({
            ...prev,
            currentTrack: track,
            recentlyPlayed: [track, ...prev.recentlyPlayed.filter(t => t.id !== track.id).slice(0, 49)]
          }));
          audioRef.current.play().catch(console.error);
        }
      };
      
      const handleSeek = (details: MediaSessionActionDetails) => {
        if (details.seekTime !== undefined && audioRef.current) {
          audioRef.current.currentTime = details.seekTime;
        }
      };
      
      try {
        navigator.mediaSession.setActionHandler('play', handlePlay);
        navigator.mediaSession.setActionHandler('pause', handlePause);
        navigator.mediaSession.setActionHandler('previoustrack', handlePrevious);
        navigator.mediaSession.setActionHandler('nexttrack', handleNext);
        navigator.mediaSession.setActionHandler('seekto', handleSeek);
      } catch (error) {
        console.log('MediaSession API not fully supported:', error);
      }
    }
  }, [state.queue, state.currentTrack, state.repeatMode]); // Removed play dependency to avoid circular reference

  // Persist data to localStorage and update MediaSession position
  useEffect(() => {
    const dataToSave = {
      playlists: state.playlists,
      volume: state.volume,
      isMuted: state.isMuted,
      isShuffled: state.isShuffled,
      repeatMode: state.repeatMode,
      isMinimized: state.isMinimized,
      showVisualizer: state.showVisualizer
    };
    localStorage.setItem('musicPlayerData', JSON.stringify(dataToSave));
    
    // Update MediaSession position state if available
    if ('mediaSession' in navigator && navigator.mediaSession && state.duration > 0) {
      navigator.mediaSession.setPositionState({
        duration: state.duration,
        playbackRate: 1.0,
        position: state.currentTime
      });
    }
  }, [
    state.playlists, 
    state.volume, 
    state.isMuted, 
    state.isShuffled, 
    state.repeatMode,
    state.isMinimized,
    state.showVisualizer,
    state.duration,
    state.currentTime
  ]);

  const loadPersistedData = () => {
    try {
      const saved = localStorage.getItem('musicPlayerData');
      if (saved) {
        const data = JSON.parse(saved);
        setState(prev => ({
          ...prev,
          playlists: data.playlists || [],
          volume: data.volume ?? 0.7,
          isMuted: data.isMuted ?? false,
          isShuffled: data.isShuffled ?? false,
          repeatMode: data.repeatMode || 'none',
          isMinimized: data.isMinimized ?? false,
          showVisualizer: data.showVisualizer ?? false
        }));
      }
    } catch (error) {
      console.error('Error loading music data:', error);
    }
  };

  // Playback controls
  const play = useCallback((track?: Track, playlist?: Playlist) => {
    if (!audioRef.current) return;
    
    if (track) {
      audioRef.current.src = track.url;
      setState(prev => ({
        ...prev,
        currentTrack: track,
        currentPlaylist: playlist || prev.currentPlaylist,
        recentlyPlayed: [track, ...prev.recentlyPlayed.filter(t => t.id !== track.id).slice(0, 49)]
      }));
      
      // Update MediaSession if available
      if ('mediaSession' in navigator && navigator.mediaSession) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: track.title,
          artist: track.artist || 'Unknown Artist',
          album: track.album || 'Unknown Album',
        });
      }
    }
    
    audioRef.current.play().catch(console.error);
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setState(prev => ({ ...prev, isPlaying: false, isPaused: false, currentTime: 0 }));
  }, []);

  const handleNext = useCallback(() => {
    if (state.queue.length === 0) return;
    
    const currentIndex = state.queue.findIndex(track => track.id === state.currentTrack?.id);
    let nextIndex = currentIndex + 1;
    
    if (state.repeatMode === 'one') {
      nextIndex = currentIndex;
    } else if (nextIndex >= state.queue.length) {
      if (state.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        stop();
        return;
      }
    }
    
    play(state.queue[nextIndex]);
  }, [state.queue, state.currentTrack, state.repeatMode, play, stop]);

  const previous = useCallback(() => {
    if (state.queue.length === 0) return;
    
    const currentIndex = state.queue.findIndex(track => track.id === state.currentTrack?.id);
    let prevIndex = currentIndex - 1;
    
    if (prevIndex < 0) {
      prevIndex = state.queue.length - 1;
    }
    
    play(state.queue[prevIndex]);
  }, [state.queue, state.currentTrack, play]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
      // Update MediaSession if available
      if ('mediaSession' in navigator && navigator.mediaSession) {
        navigator.mediaSession.metadata = audioRef.current.currentSrc ? new MediaMetadata({
          title: state.currentTrack?.title || 'Unknown Title',
          artist: state.currentTrack?.artist || 'Unknown Artist',
        }) : null;
      }
    }
    setState(prev => ({ ...prev, volume: clampedVolume, isMuted: clampedVolume === 0 ? true : false }));
  }, [state.currentTrack]);

  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = !state.isMuted;
      if (newMuted) {
        audioRef.current.volume = 0;
      } else {
        audioRef.current.volume = state.volume > 0 ? state.volume : 0.7;
      }
      setState(prev => ({ ...prev, isMuted: newMuted }));
    }
  }, [state.isMuted, state.volume]);

  const toggleShuffle = useCallback(() => {
    setState(prev => {
      const newShuffled = !prev.isShuffled;
      if (newShuffled) {
        // Shuffle the queue
        const shuffled = [...prev.queue].sort(() => Math.random() - 0.5);
        return {
          ...prev,
          isShuffled: newShuffled,
          originalQueue: prev.queue,
          queue: shuffled
        };
      } else {
        // Restore original order
        return {
          ...prev,
          isShuffled: newShuffled,
          queue: prev.originalQueue,
          originalQueue: []
        };
      }
    });
  }, []);

  const setRepeatMode = useCallback((mode: 'none' | 'one' | 'all') => {
    setState(prev => ({ ...prev, repeatMode: mode }));
  }, []);

  // Track management
  const addTrack = useCallback(async (file: File): Promise<Track> => {
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    
    return new Promise((resolve, reject) => {
      audio.addEventListener('loadedmetadata', () => {
        const track: Track = {
          id: `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          duration: audio.duration,
          url,
          file,
          addedAt: new Date()
        };
        resolve(track);
      });
      
      audio.addEventListener('error', () => {
        reject(new Error('Failed to load audio file'));
      });
    });
  }, []);

  const removeTrack = useCallback((trackId: string) => {
    setState(prev => ({
      ...prev,
      playlists: prev.playlists.map(playlist => ({
        ...playlist,
        tracks: playlist.tracks.filter(track => track.id !== trackId)
      })),
      queue: prev.queue.filter(track => track.id !== trackId),
      recentlyPlayed: prev.recentlyPlayed.filter(track => track.id !== trackId)
    }));
  }, []);

  // Playlist management
  const createPlaylist = useCallback((name: string, mood?: string, season?: string): Playlist => {
    const playlist: Playlist = {
      id: `playlist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      tracks: [],
      mood,
      season,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setState(prev => ({
      ...prev,
      playlists: [...prev.playlists, playlist]
    }));
    
    return playlist;
  }, []);

  const updatePlaylist = useCallback((playlistId: string, updates: Partial<Playlist>) => {
    setState(prev => ({
      ...prev,
      playlists: prev.playlists.map(playlist => 
        playlist.id === playlistId 
          ? { ...playlist, ...updates, updatedAt: new Date() }
          : playlist
      )
    }));
  }, []);

  const deletePlaylist = useCallback((playlistId: string) => {
    setState(prev => ({
      ...prev,
      playlists: prev.playlists.filter(playlist => playlist.id !== playlistId)
    }));
  }, []);

  const addTrackToPlaylist = useCallback((playlistId: string, track: Track) => {
    setState(prev => ({
      ...prev,
      playlists: prev.playlists.map(playlist =>
        playlist.id === playlistId
          ? { 
              ...playlist, 
              tracks: [...playlist.tracks, track],
              updatedAt: new Date()
            }
          : playlist
      )
    }));
  }, []);

  const removeTrackFromPlaylist = useCallback((playlistId: string, trackId: string) => {
    setState(prev => ({
      ...prev,
      playlists: prev.playlists.map(playlist =>
        playlist.id === playlistId
          ? { 
              ...playlist, 
              tracks: playlist.tracks.filter(track => track.id !== trackId),
              updatedAt: new Date()
            }
          : playlist
      )
    }));
  }, []);

  // Queue management
  const addToQueue = useCallback((track: Track) => {
    setState(prev => ({
      ...prev,
      queue: [...prev.queue, track]
    }));
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      queue: prev.queue.filter((_, i) => i !== index)
    }));
  }, []);

  const clearQueue = useCallback(() => {
    setState(prev => ({ ...prev, queue: [], originalQueue: [] }));
  }, []);

  const shuffleQueue = useCallback(() => {
    setState(prev => ({
      ...prev,
      queue: [...prev.queue].sort(() => Math.random() - 0.5)
    }));
  }, []);

  // UI controls
  const toggleMinimized = useCallback(() => {
    setState(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
  }, []);

  const toggleVisualizer = useCallback(() => {
    setState(prev => ({ ...prev, showVisualizer: !prev.showVisualizer }));
  }, []);

  const toggleQueue = useCallback(() => {
    setState(prev => ({ ...prev, showQueue: !prev.showQueue }));
  }, []);

  // Smart features
  const suggestPlaylistForMood = useCallback((mood: string): Playlist | null => {
    return state.playlists.find(playlist => playlist.mood === mood) || null;
  }, [state.playlists]);

  const suggestPlaylistForSeason = useCallback((season: string): Playlist | null => {
    return state.playlists.find(playlist => playlist.season === season) || null;
  }, [state.playlists]);

  const getPlaylistForMoodAndSeason = useCallback((mood?: string, season?: string): Playlist | null => {
    if (mood && season) {
      return state.playlists.find(playlist => playlist.mood === mood && playlist.season === season) ||
             state.playlists.find(playlist => playlist.mood === mood) ||
             state.playlists.find(playlist => playlist.season === season) ||
             null;
    } else if (mood) {
      return suggestPlaylistForMood(mood);
    } else if (season) {
      return suggestPlaylistForSeason(season);
    }
    return null;
  }, [state.playlists, suggestPlaylistForMood, suggestPlaylistForSeason]);

  const value = {
    ...state,
    play,
    pause,
    stop,
    next: handleNext,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    setRepeatMode,
    addTrack,
    removeTrack,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
    addToQueue,
    removeFromQueue,
    clearQueue,
    shuffleQueue,
    toggleMinimized,
    toggleVisualizer,
    toggleQueue,
    suggestPlaylistForMood,
    suggestPlaylistForSeason,
    getPlaylistForMoodAndSeason
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}