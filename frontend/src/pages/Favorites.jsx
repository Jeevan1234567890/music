import { useEffect, useState } from "react";
import API from "../services/api";
import SongCard from "../components/SongCard";

function Favorites({
  setCurrentTrack,
  setIsPlaying,
  favoritesList,
  setFavoritesList,
}) {
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await API.get("/songs/favorites");
      setFavoritesList(res.data);
    } catch (err) {
      console.error("Failed to load favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

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

  const removeFavorite = async (song) => {
    try {
      await API.delete(`/songs/favorites/${song.trackId}`);
      setFavoritesList(favoritesList.filter((f) => String(f.trackId) !== String(song.trackId)));
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  return (
    <div className="container">
      <h2 className="section-title">❤️ My List</h2>

      {loading ? (
        <div className="empty-state">
          <h3>Loading your list...</h3>
        </div>
      ) : favoritesList.length === 0 ? (
        <div className="empty-state">
          <h3>Your list is empty</h3>
          <p>
            Browse the Home page or search for tracks to add them to your List.
          </p>
        </div>
      ) : (
        <div className="grid">
          {favoritesList.map((song) => (
            <SongCard
              key={song.trackId || song._id}
              song={song}
              isLiked={true}
              onPlay={playSong}
              onLike={removeFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;