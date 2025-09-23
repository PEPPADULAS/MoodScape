'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Play, 
  Pause, 
  Edit3, 
  Trash2, 
  Music, 
  Folder, 
  Heart,
  Sun,
  Cloud,
  Snowflake,
  Flower,
  CloudRain,
  Smile,
  Frown,
  Meh,
  Zap,
  Moon,
  Coffee,
  Upload,
  FileAudio
} from 'lucide-react';
import { useMusic, Playlist, Track } from '@/contexts/music-context';
import { ThemedInput } from '@/components/ui/themed-input';
import { useTheme } from '@/contexts/theme-context';
import { cn } from '@/lib/utils';

interface PlaylistManagerProps {
  className?: string;
}

export function PlaylistManager({ className }: PlaylistManagerProps) {
  const music = useMusic();
  const { theme } = useTheme();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [uploadingToPlaylist, setUploadingToPlaylist] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mood and season options
  const moods = [
    { id: 'happy', name: 'Happy', icon: Smile, color: 'text-yellow-400' },
    { id: 'sad', name: 'Sad', icon: Frown, color: 'text-blue-400' },
    { id: 'calm', name: 'Calm', icon: Moon, color: 'text-purple-400' },
    { id: 'energetic', name: 'Energetic', icon: Zap, color: 'text-orange-400' },
    { id: 'focused', name: 'Focused', icon: Coffee, color: 'text-green-400' },
    { id: 'nostalgic', name: 'Nostalgic', icon: Heart, color: 'text-pink-400' }
  ];

  const seasons = [
    { id: 'spring', name: 'Spring', icon: Flower, color: 'text-green-400' },
    { id: 'summer', name: 'Summer', icon: Sun, color: 'text-yellow-400' },
    { id: 'fall', name: 'Fall', icon: Cloud, color: 'text-orange-400' },
    { id: 'winter', name: 'Winter', icon: Snowflake, color: 'text-blue-400' },
    { id: 'rainy', name: 'Rainy', icon: CloudRain, color: 'text-gray-400' }
  ];

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      music.createPlaylist(newPlaylistName.trim(), selectedMood, selectedSeason);
      setNewPlaylistName('');
      setSelectedMood('');
      setSelectedSeason('');
      setShowCreateForm(false);
    }
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.tracks.length > 0) {
      // Clear current queue and add playlist tracks
      music.clearQueue();
      playlist.tracks.forEach(track => music.addToQueue(track));
      music.play(playlist.tracks[0], playlist);
    }
  };

  const handleAddTracksToPlaylist = (playlistId: string) => {
    setUploadingToPlaylist(playlistId);
    fileInputRef.current?.click();
  };

  const handleFileSelection = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !uploadingToPlaylist) return;

    const audioFiles = Array.from(files).filter(file => 
      file.type.startsWith('audio/') || 
      /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.name)
    );

    if (audioFiles.length === 0) {
      alert('Please select valid audio files (.mp3, .wav, .ogg, .m4a, .aac, .flac)');
      return;
    }

    // Process each audio file
    for (const file of audioFiles) {
      try {
        // Create object URL for the file
        const url = URL.createObjectURL(file);
        
        // Create audio element to get duration and metadata
        const audio = new Audio(url);
        
        await new Promise((resolve, reject) => {
          audio.addEventListener('loadedmetadata', () => {
            const track: Track = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              title: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
              artist: 'Unknown Artist',
              duration: Math.floor(audio.duration) || 0,
              url: url,
              addedAt: new Date()
            };
            
            // Add track to the playlist
            music.addTrackToPlaylist(uploadingToPlaylist!, track);
            resolve(track);
          });
          
          audio.addEventListener('error', () => {
            console.error(`Failed to load audio file: ${file.name}`);
            URL.revokeObjectURL(url);
            reject(new Error(`Failed to load ${file.name}`));
          });
        });
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }

    // Reset the file input and state
    event.target.value = '';
    setUploadingToPlaylist(null);
  };

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getTotalDuration = (tracks: Track[]) => {
    return tracks.reduce((total, track) => total + track.duration, 0);
  };

  const getMoodIcon = (mood?: string) => {
    const moodData = moods.find(m => m.id === mood);
    return moodData ? moodData.icon : Music;
  };

  const getSeasonIcon = (season?: string) => {
    const seasonData = seasons.find(s => s.id === season);
    return seasonData ? seasonData.icon : Folder;
  };

  const getMoodColor = (mood?: string) => {
    const moodData = moods.find(m => m.id === mood);
    return moodData ? moodData.color : 'text-gray-400';
  };

  const getSeasonColor = (season?: string) => {
    const seasonData = seasons.find(s => s.id === season);
    return seasonData ? seasonData.color : 'text-gray-400';
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${theme.text}`}>Your Playlists</h2>
        <motion.button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          Create Playlist
        </motion.button>
      </div>

      {/* Create Playlist Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`${theme.card} rounded-xl p-6 space-y-4`}
          >
            <h3 className={`text-lg font-semibold ${theme.text}`}>Create New Playlist</h3>
            
            <ThemedInput
              type="text"
              placeholder="Playlist name"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              autoFocus
            />

            {/* Mood Selection */}
            <div>
              <label className={`block text-sm font-medium ${theme.text} mb-2`}>Mood (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {moods.map((mood) => {
                  const Icon = mood.icon;
                  return (
                    <motion.button
                      key={mood.id}
                      onClick={() => setSelectedMood(selectedMood === mood.id ? '' : mood.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200",
                        selectedMood === mood.id
                          ? "bg-blue-500/20 border-blue-500 text-blue-300"
                          : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className={cn("w-4 h-4", selectedMood === mood.id ? "text-blue-300" : mood.color)} />
                      <span className="text-sm">{mood.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Season Selection */}
            <div>
              <label className={`block text-sm font-medium ${theme.text} mb-2`}>Season (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {seasons.map((season) => {
                  const Icon = season.icon;
                  return (
                    <motion.button
                      key={season.id}
                      onClick={() => setSelectedSeason(selectedSeason === season.id ? '' : season.id)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200",
                        selectedSeason === season.id
                          ? "bg-green-500/20 border-green-500 text-green-300"
                          : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className={cn("w-4 h-4", selectedSeason === season.id ? "text-green-300" : season.color)} />
                      <span className="text-sm">{season.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <motion.button
                onClick={handleCreatePlaylist}
                disabled={!newPlaylistName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create
              </motion.button>
              <motion.button
                onClick={() => {
                  setShowCreateForm(false);
                  setNewPlaylistName('');
                  setSelectedMood('');
                  setSelectedSeason('');
                }}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Playlists Grid */}
      {music.playlists.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Music className="w-10 h-10 text-white" />
          </div>
          <h3 className={`text-xl font-semibold ${theme.text} mb-2`}>No playlists yet</h3>
          <p className={`${theme.accent} mb-6`}>Create your first playlist to organize your music by mood and season.</p>
          <motion.button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Create Your First Playlist
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {music.playlists.map((playlist) => {
            const MoodIcon = getMoodIcon(playlist.mood);
            const SeasonIcon = getSeasonIcon(playlist.season);
            const isCurrentPlaylist = music.currentPlaylist?.id === playlist.id;
            
            return (
              <motion.div
                key={playlist.id}
                className={cn(
                  `${theme.card} rounded-xl p-6 group hover:shadow-lg transition-all duration-200`,
                  isCurrentPlaylist && "ring-2 ring-blue-500/50"
                )}
                whileHover={{ scale: 1.02 }}
                layout
              >
                {/* Playlist Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      playlist.mood || playlist.season
                        ? "bg-gradient-to-br from-purple-500 to-blue-500"
                        : "bg-gray-500"
                    )}>
                      {playlist.mood ? (
                        <MoodIcon className="w-6 h-6 text-white" />
                      ) : playlist.season ? (
                        <SeasonIcon className="w-6 h-6 text-white" />
                      ) : (
                        <Music className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${theme.text} line-clamp-1`}>
                        {playlist.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {playlist.mood && (
                          <span className={cn("text-xs", getMoodColor(playlist.mood))}>
                            {moods.find(m => m.id === playlist.mood)?.name}
                          </span>
                        )}
                        {playlist.season && (
                          <span className={cn("text-xs", getSeasonColor(playlist.season))}>
                            {seasons.find(s => s.id === playlist.season)?.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Playlist Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      onClick={() => setEditingPlaylist(playlist)}
                      className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit3 className="w-4 h-4 text-white/60" />
                    </motion.button>
                    <motion.button
                      onClick={() => music.deletePlaylist(playlist.id)}
                      className="p-1.5 hover:bg-red-500/20 rounded-md transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </motion.button>
                  </div>
                </div>

                {/* Playlist Stats */}
                <div className="space-y-2 mb-4">
                  <div className={`text-sm ${theme.accent}`}>
                    {playlist.tracks.length} track{playlist.tracks.length !== 1 ? 's' : ''}
                  </div>
                  {playlist.tracks.length > 0 && (
                    <div className={`text-xs ${theme.accent}`}>
                      {formatDuration(getTotalDuration(playlist.tracks))} total
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {playlist.tracks.length > 0 ? (
                    <motion.button
                      onClick={() => handlePlayPlaylist(playlist)}
                      className="w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isCurrentPlaylist && music.isPlaying ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Playing
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Play
                        </>
                      )}
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => handleAddTracksToPlaylist(playlist.id)}
                      disabled={uploadingToPlaylist === playlist.id}
                      className={cn(
                        "w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2",
                        uploadingToPlaylist === playlist.id
                          ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700"
                      )}
                      whileHover={uploadingToPlaylist !== playlist.id ? { scale: 1.02 } : {}}
                      whileTap={uploadingToPlaylist !== playlist.id ? { scale: 0.98 } : {}}
                    >
                      {uploadingToPlaylist === playlist.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Adding tracks...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Add tracks to play
                        </>
                      )}
                    </motion.button>
                  )}
                  
                  {/* Add More Tracks Button for non-empty playlists */}
                  {playlist.tracks.length > 0 && (
                    <motion.button
                      onClick={() => handleAddTracksToPlaylist(playlist.id)}
                      disabled={uploadingToPlaylist === playlist.id}
                      className={cn(
                        "w-full py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm",
                        uploadingToPlaylist === playlist.id
                          ? "bg-gray-600/30 text-gray-400 cursor-not-allowed"
                          : "bg-white/10 text-white/80 hover:bg-white/20"
                      )}
                      whileHover={uploadingToPlaylist !== playlist.id ? { scale: 1.02 } : {}}
                      whileTap={uploadingToPlaylist !== playlist.id ? { scale: 0.98 } : {}}
                    >
                      {uploadingToPlaylist === playlist.id ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <FileAudio className="w-3 h-3" />
                          Add more tracks
                        </>
                      )}
                    </motion.button>
                  )}
                </div>

                {/* Recent Tracks Preview */}
                {playlist.tracks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="space-y-2">
                      {playlist.tracks.slice(0, 3).map((track, index) => (
                        <div key={track.id} className="flex items-center gap-2 text-xs text-white/60">
                          <span className="w-4 text-center">{index + 1}</span>
                          <span className="flex-1 truncate">{track.title}</span>
                        </div>
                      ))}
                      {playlist.tracks.length > 3 && (
                        <div className="text-xs text-white/40 text-center">
                          +{playlist.tracks.length - 3} more tracks
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
      
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac"
        onChange={handleFileSelection}
        className="hidden"
      />
    </div>
  );
}