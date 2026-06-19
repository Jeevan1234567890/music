import { useEffect, useRef, useState } from "react";

function Player({ currentTrack, isPlaying, setIsPlaying, onClose }) {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.log("Audio playback failed:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // When track changes, auto-play
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.previewUrl;
      audioRef.current.load();
      setIsPlaying(true);
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrack]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleProgressClick = (e) => {
    if (audioRef.current && duration > 0) {
      const rect = e.target.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const percentage = clickX / width;
      const newTime = percentage * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!currentTrack) return null;

  return (
    <div className="bottom-player">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
      />

      {/* Left section: Info */}
      <div className="player-left">
        <div className="player-art">
          <img
            src={currentTrack.artworkUrl100 || currentTrack.imageUrl}
            alt={currentTrack.trackName || currentTrack.name}
          />
        </div>
        <div className="player-info">
          <h4>{currentTrack.trackName || currentTrack.name}</h4>
          <p>{currentTrack.artistName || currentTrack.artist}</p>
        </div>
      </div>

      {/* Center section: Controls & Progress */}
      <div className="player-center">
        <div className="player-controls">
          <button className="control-btn" title="Previous">⏮</button>
          <button className="control-btn play-pause" onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button className="control-btn" title="Next">⏭</button>
        </div>
        <div className="player-timeline">
          <span>{formatTime(currentTime)}</span>
          <div className="timeline-slider" onClick={handleProgressClick}>
            <div
              className="timeline-progress"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right section: Volume & Close */}
      <div className="player-right">
        <div className="volume-container">
          <span style={{ fontSize: "14px", color: "#a0a0ab" }}>🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="volume-slider"
          />
        </div>
        <button className="close-player" onClick={onClose} title="Close Player">
          ✕
        </button>
      </div>
    </div>
  );
}

export default Player;
