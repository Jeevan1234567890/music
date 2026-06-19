import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Favorites from "./pages/Favorites";
import Navbar from "./components/Navbar";
import Player from "./components/Player";

function App() {
  const [language, setLanguage] = useState("Telugu");
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load and save favorite status helper to sync cards across pages
  const [favoritesList, setFavoritesList] = useState([]);

  return (
    <BrowserRouter>
      <Navbar language={language} setLanguage={setLanguage} />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              language={language}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              setCurrentTrack={setCurrentTrack}
              setIsPlaying={setIsPlaying}
              favoritesList={favoritesList}
              setFavoritesList={setFavoritesList}
            />
          }
        />
        <Route
          path="/search"
          element={
            <Search
              language={language}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              setCurrentTrack={setCurrentTrack}
              setIsPlaying={setIsPlaying}
              favoritesList={favoritesList}
              setFavoritesList={setFavoritesList}
            />
          }
        />
        <Route
          path="/favorites"
          element={
            <Favorites
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              setCurrentTrack={setCurrentTrack}
              setIsPlaying={setIsPlaying}
              favoritesList={favoritesList}
              setFavoritesList={setFavoritesList}
            />
          }
        />
      </Routes>

      <Player
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        onClose={() => {
          setCurrentTrack(null);
          setIsPlaying(false);
        }}
      />
    </BrowserRouter>
  );
}

export default App;