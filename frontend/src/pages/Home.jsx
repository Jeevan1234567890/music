import { useEffect, useState } from "react";
import API from "../services/api";
import SongCard from "../components/SongCard";

const MOODS = [
  { name: "Happy", emoji: "😊" },
  { name: "Sad", emoji: "😢" },
  { name: "Relaxed", emoji: "😌" },
  { name: "Energy", emoji: "🔥" },
  { name: "Focus", emoji: "💪" },
  { name: "Sleep", emoji: "😴" },
  { name: "Love", emoji: "🥰" },
  { name: "Angry", emoji: "😡" },
  { name: "Party", emoji: "🥳" },
];

function Home({
  language,
  setCurrentTrack,
  setIsPlaying,
  favoritesList,
  setFavoritesList,
}) {
  const [activeMood, setActiveMood] = useState(MOODS[0]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync favorites on mount
  const fetchFavorites = async () => {
    try {
      const res = await API.get("/songs/favorites");
      setFavoritesList(res.data);
    } catch (err) {
      console.error("Failed to load favorites:", err);
    }
  };

  const loadSongs = async () => {
    setLoading(true);
    try {
      // Query Term combines selected Language and active Mood (e.g. "Telugu Happy")
      const query = `${language} ${activeMood.name} songs`;
      const res = await API.get(`/songs/search?q=${encodeURIComponent(query)}`);
      setSongs(res.data);
    } catch (err) {
      console.error("Error fetching songs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    loadSongs();
  }, [language, activeMood]);

  const playSong = (song) => {
    // Set song metadata structure for player compatibility
    setCurrentTrack({
      trackId: song.trackId,
      trackName: song.trackName || song.name,
      artistName: song.artistName || song.artist,
      artworkUrl100: song.artworkUrl100 || song.imageUrl,
      previewUrl: song.previewUrl,
    });
    setIsPlaying(true);
  };

  const toggleLike = async (song) => {
    const trackId = song.trackId;
    const isAlreadyLiked = favoritesList.some(
      (f) => String(f.trackId) === String(trackId)
    );

    try {
      if (isAlreadyLiked) {
        await API.delete(`/songs/favorites/${trackId}`);
        setFavoritesList(favoritesList.filter((f) => String(f.trackId) !== String(trackId)));
      } else {
        const payload = {
          trackId: song.trackId,
          name: song.trackName || song.name,
          artist: song.artistName || song.artist,
          imageUrl: song.artworkUrl100 || song.imageUrl,
        };
        const res = await API.post("/songs/favorites", payload);
        setFavoritesList([...favoritesList, res.data]);
      }
    } catch (err) {
      console.error("Error updating favorites:", err);
    }
  };

  return (
    <div className="container">
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>FEEL THE BEAT</h1>
            <p>
              Discover the perfect soundtrack for your current mood. Select an
              option below to start listening.
            </p>
          </div>
        </div>
      </div>

      {/* Mood Chips Section */}
      <div className="mood-container">
        <h3 className="section-title">🎭 Browse by Mood</h3>
        <div className="mood-grid">
          {MOODS.map((mood) => (
            <button
              key={mood.name}
              className={`mood-chip ${activeMood.name === mood.name ? "active" : ""}`}
              onClick={() => setActiveMood(mood)}
            >
              <span>{mood.emoji}</span>
              {mood.name}
            </button>
          ))}
        </div>
      </div>

      {/* Top Picks Section Header */}
      <div className="section-info">
        <h2>Top Picks for You ({language})</h2>
        <p>Because you're feeling {activeMood.emoji}</p>
      </div>

      {/* Songs Grid */}
      {loading ? (
        <div className="empty-state">
          <h3>Loading recommendations...</h3>
        </div>
      ) : songs.length === 0 ? (
        <div className="empty-state">
          <h3>No songs found</h3>
          <p>Try changing your active language or mood choice.</p>
        </div>
      ) : (
        <div className="grid">
          {songs.map((song) => {
            const isLiked = favoritesList.some(
              (f) => String(f.trackId) === String(song.trackId)
            );
            return (
              <SongCard
                key={song.trackId}
                song={song}
                isLiked={isLiked}
                onPlay={playSong}
                onLike={toggleLike}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Home;