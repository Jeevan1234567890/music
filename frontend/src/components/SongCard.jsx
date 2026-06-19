function SongCard({ song, isLiked, onLike, onPlay }) {
  const title = song.trackName || song.name || "Unknown Track";
  const artist = song.artistName || song.artist || "Unknown Artist";
  // Determine image URL: prioritize high‑resolution artwork, then image_url, then imageUrl, then placeholder
  const placeholder = "https://via.placeholder.com/300";
  const rawImage = song.artworkUrl100 || song.image_url || song.imageUrl || "";
  // If rawImage is an absolute URL, use it; otherwise treat as a filename in the public folder
  let image = rawImage && rawImage.startsWith("http")
    ? rawImage
    : rawImage
    ? `/${rawImage}`
    : placeholder;
  if (image && image.includes("100x100bb.jpg")) {
    image = image.replace("100x100bb.jpg", "300x300bb.jpg");
  }

  return (
    <div className="card">
      <div className="card-img-wrapper">
        <img src={image} alt={title} loading="lazy" />
      </div>

      <div className="card-body">
        <h3>{title}</h3>
        <p>{artist}</p>

        <div className="card-controls">
          <button className="play-btn" onClick={() => onPlay(song)}>
            ▶ Play
          </button>

          <button
            className={`like-btn ${isLiked ? "liked" : ""}`}
            onClick={() => onLike(song)}
            title={isLiked ? "Remove from List" : "Add to List"}
          >
            {isLiked ? "✓" : "+"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SongCard;