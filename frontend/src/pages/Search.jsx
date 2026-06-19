import { useEffect, useState } from "react";
import API from "../services/api";
import SongCard from "../components/SongCard";

function Search({
  language,
  setCurrentTrack,
  setIsPlaying,
  favoritesList,
  setFavoritesList,
}) {
  const [search, setSearch] = useState("");
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sync favorites on mount
  const fetchFavorites = async () => {
    try {
      const res = await API.get("/songs/favorites");
      setFavoritesList(res.data);
    } catch (err) {
      console.error("Failed to load favorites:", err);
    }
  };

  useEffect(() => {
    fetchFavorites();
    // Default search matching selected language on load
    performSearch(`${language} popular`);
  }, [language]);

  const performSearch = async (term) => {
    if (!term.trim()) return;
    setLoading(true);
    try {
      const res = await API.get(`/songs/search?q=${encodeURIComponent(term)}`);
      setSongs(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch(search);
  };

  const playSong = (song) => {
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
    <div className="container search-container">
      <h2 className="section-title">🔍 Search Music</h2>

      <form onSubmit={handleSearchSubmit} className="search-box">
        <input
          type="text"
          placeholder={`Search for tracks, artists in ${language}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <div className="empty-state">
          <h3>Searching tracks...</h3>
        </div>
      ) : songs.length === 0 ? (
        <div className="empty-state">
          <h3>No tracks found</h3>
          <p>Try searching for a different song name or artist.</p>
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

export default Search;