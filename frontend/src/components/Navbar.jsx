import { NavLink } from "react-router-dom";

function Navbar({ language, setLanguage }) {
  return (
    <nav className="navbar">
      <div className="logo">
        EMOTIFY
      </div>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")}>
          Home
        </NavLink>
        <NavLink to="/favorites" className={({ isActive }) => (isActive ? "active" : "")}>
          My List
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => (isActive ? "active" : "")}>
          Search
        </NavLink>
      </div>

      <div className="nav-right">
        <div className="lang-select-wrapper">
          <select
            className="lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="Telugu">Telugu</option>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Tamil">Tamil</option>
          </select>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;